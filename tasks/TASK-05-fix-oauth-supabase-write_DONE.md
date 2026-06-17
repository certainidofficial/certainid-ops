# TASK-05 — Write verification_method/strength on OAuth return — DONE

**Completed:** 2026-06-17
**By:** Claude Code
**Time elapsed:** ~10 minutes

## What shipped

OAuth (and proof-of-post) verified profiles now write the correct `verification_method` and `verification_strength` to Supabase, fixing the public profile badge tier display.

- `trackProfileVerified` now accepts `verificationMethod` and `verificationStrength` params and writes them to the `social_profiles` table (commit `fa6a45c`)
- `verifyProfile` in `useSocialProfiles.ts` now calls `trackProfileVerified` after successful on-chain write, passing the correct method and strength tier: oauth=3, proof_of_post=2, manual=1 (commit `fa6a45c`)

## Acceptance criteria — verified?

- [x] `trackProfileVerified` accepts `verification_method` and `verification_strength` parameters — added as optional params with defaults (`'manual'`, `1`)
- [x] OAuth verification path passes `method: 'oauth'` and `strength: 3` — `METHOD_STRENGTH` map in `useSocialProfiles.ts` maps oauth→3
- [x] Existing manual verification path still works — defaults to `'manual'` / `1` when params not specified
- [x] Public profile page reads correct method/strength — `PublicIdentityCard.tsx` already reads `verification_method` and `verification_strength` columns directly from Supabase; no changes needed there
- [x] No regression on existing OAuth flows — typecheck clean, build clean, no changes to OAuth callback logic

## Deployment status

- **Built:** ✅
- **Typecheck:** ✅ `npx tsc --noEmit` — clean
- **Deployed to production:** ✅ https://app.certainid.io — deployment `dpl_GXLoueViSSfLRqFHHhFwsPjzrfy3`
- **Smoke tested:** ✅ HTTP 200 on https://app.certainid.io/

## What broke / surprises

- **Key finding:** `verifyProfile` in `useSocialProfiles.ts` was never calling `trackProfileVerified` at all — not just missing the method/strength fields. The on-chain write succeeded but the Supabase mirror was completely skipped for verification events. This meant that a user who verified via OAuth would see their profile as "Claimed" (strength 1) in the fast-read path until a full blockchain re-read happened.
- **Brief said deploy via git push → Vercel auto-deploy.** Memory says auto-deploy is disabled (`ignoreCommand: "exit 0"` in vercel.json). Used `./deploy-ui.sh --prod` instead.

## Decisions made

- Added a `METHOD_STRENGTH` constant map in `useSocialProfiles.ts` rather than accepting strength as a separate parameter to `verifyProfile`. The method→strength mapping is deterministic (oauth=3, proof_of_post=2, manual=1), so passing both independently would be error-prone.
- Kept `trackProfileVerified` params optional with defaults to avoid breaking any future callers.

## What's next / follow-ups

- Existing OAuth-verified profiles in Supabase still have stale `verification_method: 'manual', verification_strength: 1`. A one-time data migration (UPDATE social_profiles SET verification_method='oauth', verification_strength=3 WHERE verification_post LIKE 'oauth:%' AND is_verified=true) would fix historical data.
- The proof-of-post flow in `handleVerify` also calls `verifyProfile` with `'proof_of_post'` — this now correctly writes strength=2 to Supabase too.

## Files changed

```
certainid_ui/src/lib/supabaseTracker.ts
certainid_ui/src/hooks/useSocialProfiles.ts
```
