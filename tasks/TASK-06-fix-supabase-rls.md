# TASK-06 — Tighten Supabase RLS on social_profiles UPDATE and signed_content

**Owner:** Cipher
**Assigned:** Claude Code
**Status:** 🔵 READY
**Created:** 2026-06-17
**Priority:** P0

## Context

From the Council Review (COUNCIL_REVIEW_2026-06-17.md, P0-5): The `social_update` RLS policy (`supabase-rls-hardening.sql:120-123`) has `USING (true) WITH CHECK (is_verified IS NOT TRUE)` — any anon client can overwrite any row's `username`, `platform_user_id`, `verification_post` as long as they don't flip `is_verified`. There's no `wallet_address` ownership check because Supabase Auth isn't in use. Same problem exists on `signed_content` UPDATE. For an identity product, cross-user data corruption is trivially exploitable.

## Goal

Add wallet-address ownership scoping to `social_profiles` and `signed_content` UPDATE policies so users can only modify their own rows.

## Acceptance criteria

- [ ] `social_profiles` UPDATE policy checks `wallet_address` matches the requesting user's wallet
- [ ] `signed_content` UPDATE policy checks wallet ownership
- [ ] Existing INSERT/SELECT policies remain functional
- [ ] Normal OAuth flow and content signing still work end-to-end
- [ ] An anon client cannot UPDATE another user's social_profiles or signed_content rows
- [ ] Policy changes applied to Supabase (migration SQL committed to repo)

## Files / surfaces likely involved

- `certainid-mvp/supabase-rls-hardening.sql:120-123` (social_update policy)
- Similar policies on `signed_content` table
- `certainid_ui/src/lib/supabaseTracker.ts` (caller that writes to these tables)

## Git / deploy

- **Branch:** `main`
- **Deploy:** auto via `git push` → Vercel (app code), SQL migration applied separately to Supabase dashboard
- **Special considerations:** The SQL needs to be run in Supabase SQL editor after committing. Document exact SQL to run.

## Dependencies

- None — but test after TASK-05 to ensure the OAuth write path still works

## References

- `COUNCIL_REVIEW_2026-06-17.md` — P0-5 section
- Supabase dashboard for running migration SQL
- `tasks/TASK-06-fix-supabase-rls_CLARIFY.md` — clarification questions raised 2026-06-17 (now resolved, see decision below)

---

## DECISION — 2026-06-18 (Gandelf7)

**Selected: Option C — remove anon UPDATE policies entirely, route writes through server-side endpoints with the service-role key.**

This is the option Claude Code recommended in the CLARIFY as the minimum viable fix that actually achieves the acceptance criterion "An anon client cannot UPDATE another user's rows."

### Why this option

The other options can't deliver the acceptance criteria with the current architecture:
- **Option A** (full wallet-signature verification) — most correct but largest scope; deferred to post-alpha
- **Option B** (column-level UPDATE restriction) — only partial mitigation, cross-user updates still possible
- **Option D** (Supabase Auth + custom JWT claims) — infrastructure rewrite, out of scope

Option C trades architectural purity for shipping speed. The server-side endpoints validate the request (wallet ownership, on-chain state consistency) before using the service-role key to write. The anon key loses direct UPDATE access; READ stays open.

### Updated acceptance criteria

- [ ] New server-side endpoint(s) for the three write paths:
  - `trackProfileVerified` (called from OAuth return in `useSocialProfiles.ts`)
  - `trackProfileUnlinked` (called from unlink action)
  - `trackContentRevoked` (called from revoke action in `useContentSigning.ts`)
  - Likely consolidated into one endpoint with `?action=` discriminator to stay under Vercel Hobby 12-function cap
- [ ] Each endpoint validates the request before writing (wallet signature OR on-chain ownership cross-check — pick whichever is faster to ship)
- [ ] Each endpoint uses `SUPABASE_SERVICE_ROLE_KEY` for the actual DB write
- [ ] Client-side `useSocialProfiles.ts` and `useContentSigning.ts` updated to `fetch()` the new endpoint instead of calling `supabase.from(...).update(...)` directly
- [ ] RLS migration: drop anon UPDATE policies on `social_profiles` and `signed_content`; keep INSERT (used by linkProfile / signContent during contract write callbacks) and SELECT
- [ ] OAuth flow still works end-to-end (LinkedIn especially — already shipped, must not regress)
- [ ] Content signing flow still works end-to-end
- [ ] Migration SQL committed to repo; documented for running in Supabase SQL editor

### Function-count budget

Currently at 7/12 Vercel Hobby functions. This adds at most 2 new endpoints (one consolidated profile-write endpoint + content-revoke if not consolidatable). New total: 8 or 9 of 12. Under cap.

### Out of scope for this task

- Full wallet-signature verification (EIP-712) — defer to post-alpha. Initial validation can be "does the wallet address match the on-chain owner of the target contract?" which is checkable via a simple chain read.
- Migration of the existing `linkProfile` / `signContent` INSERT calls — those happen during chain-write callbacks and are bound to wallet activity already; lower risk, leave for now.
- Supabase Auth integration — deferred.

### When you ship this

1. New endpoints land in `certainid_ui/api/`
2. Client refactor in the two hooks
3. RLS migration committed at `certainid_ui/supabase-rls-task06.sql` (or similar)
4. Migration must be run manually in Supabase SQL editor (Gandelf7 confirms in completion report; or completion report instructs him)
5. Smoke test: OAuth a new LinkedIn profile + sign a piece of content, both must complete without errors

**Status:** 🔵 READY (decision resolved, brief now actionable)