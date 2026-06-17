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