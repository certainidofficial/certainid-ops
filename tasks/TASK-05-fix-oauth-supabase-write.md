# TASK-05 — Write verification_method/strength on OAuth return

**Owner:** Cipher
**Assigned:** Claude Code
**Status:** 🔵 READY
**Created:** 2026-06-17
**Priority:** P0

## Context

From the Council Review (COUNCIL_REVIEW_2026-06-17.md, P0-3): `supabaseTracker.ts:123-140` `trackProfileVerified` only sets `is_verified: true` and `verified_at`. It does NOT write `verification_method: 'oauth'` or `verification_strength: 3`. Every OAuth-linked profile in Supabase shows `verification_method: 'manual', verification_strength: 1` — whatever was set at link time. The UI's three-tier badge system (Owned / Verified / Claimed) reads from these columns, so every OAuth user's badge is wrong in the fast-read path. The public profile page shows incorrect verification tiers.

## Goal

Update `trackProfileVerified` to accept and write `verification_method` and `verification_strength` so the public profile page shows the correct badge tier for OAuth-verified users.

## Acceptance criteria

- [ ] `trackProfileVerified` in `supabaseTracker.ts:123-140` accepts `verification_method` and `verification_strength` parameters
- [ ] OAuth verification path passes `method: 'oauth'` and `strength: 3` when writing to Supabase
- [ ] Existing manual verification path still works (defaults to `manual` / `1` when not specified)
- [ ] Public profile page reads the correct method/strength and shows the right badge tier
- [ ] No regression on existing OAuth flows

## Files / surfaces likely involved

- `certainid_ui/src/lib/supabaseTracker.ts:123-140`
- `certainid_ui/src/components/ProfilesTab.tsx` (caller of trackProfileVerified)
- `certainid_ui/src/components/PublicIdentityCard.tsx` (reads these columns for display)

## Git / deploy

- **Branch:** `main`
- **Deploy:** auto via `git push` → Vercel
- **Special considerations:** None — Supabase schema already has these columns

## Dependencies

- TASK-02 (ABI fix) should land first — if ABI is wrong, OAuth verification itself may not complete

## References

- `COUNCIL_REVIEW_2026-06-17.md` — P0-3 section