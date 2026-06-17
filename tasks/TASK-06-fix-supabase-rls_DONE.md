# TASK-06 — Tighten Supabase RLS on social_profiles UPDATE and signed_content — DONE

**Completed:** 2026-06-18
**By:** Claude Code
**Time elapsed:** ~20 minutes from brief to deploy

## What shipped

Implemented Option C from the decision: removed anon UPDATE access on `social_profiles` and `signed_content`, routing all writes through a new server-side endpoint that validates on-chain contract ownership.

- New endpoint `/api/tracker-write` (commit `32d8b15`)
- Client-side `supabaseTracker.ts` refactored to `fetch()` the new endpoint
- RLS migration SQL at `certainid_ui/supabase-rls-task06.sql`
- Live at https://app.certainid.io

## Acceptance criteria — verified?

- [x] New server-side endpoint for three write paths (profileVerified, profileUnlinked, contentRevoked) — consolidated into one endpoint with action discriminator
- [x] Each endpoint validates the request before writing — on-chain `owner()` check confirms wallet owns contract
- [x] Each endpoint uses `SUPABASE_SERVICE_ROLE_KEY` for the actual DB write
- [x] Client-side `supabaseTracker.ts` updated to `fetch()` the new endpoint instead of calling `supabase.from(...).update(...)` directly
- [x] RLS migration: SQL to drop anon UPDATE policies on `social_profiles` and `signed_content` committed; INSERT and SELECT policies untouched
- [ ] OAuth flow still works end-to-end — **MANUAL TEST REQUIRED** by Gandelf7 (LinkedIn OAuth verifying a profile should call the new endpoint)
- [ ] Content signing flow still works end-to-end — **MANUAL TEST REQUIRED** by Gandelf7
- [x] Migration SQL committed to repo at `certainid_ui/supabase-rls-task06.sql`; documented for running in Supabase SQL editor

## Deployment status

- **Built:** ✅ local build succeeded
- **Typecheck:** ✅ `npx tsc --noEmit` clean
- **Deployed to production:** ✅ https://app.certainid.io (deployment `dpl_k5i3ccrnYxAivpmJZtoE2PfPFtMh`)
- **Smoke tested:** ✅ Endpoint returns 403 for non-owner wallets, 400 for missing fields, 405 for GET requests

## What broke / surprises

None. Clean implementation.

## Decisions made

1. **Single consolidated endpoint** (`/api/tracker-write`) with `action` discriminator rather than 3 separate endpoints. Keeps us well under the 12-function Vercel Hobby cap (now 8/12 including existing waitlist.js).
2. **Validation via on-chain `owner()` read** rather than wallet signature (EIP-712). This is faster to ship and sufficient for alpha — the contract's `owner()` is immutable and set at deploy time. Full EIP-712 deferred per brief.
3. **Used viem `createPublicClient`** for the chain read, consistent with the existing `deploy-identity.ts` pattern.

## Action required from Gandelf7

**Before the RLS migration is fully effective, you must:**

1. Set `SUPABASE_SERVICE_ROLE_KEY` in the Vercel environment variables for `certainid_ui` if not already set. The endpoint reads `process.env.SUPABASE_SERVICE_ROLE_KEY`.
2. Run the migration SQL in Supabase Dashboard → SQL Editor:
   - Open `certainid_ui/supabase-rls-task06.sql`
   - Copy the SQL and run it
   - Verify with the SELECT query at the bottom of the file
3. After running the migration, test an OAuth flow (link + verify a LinkedIn profile) and a content sign + revoke to confirm end-to-end.

**Until the SQL migration is run, the old anon UPDATE policies still exist.** The app code is already routing through the server endpoint, but the old policies haven't been dropped yet in the live database.

## What's next / follow-ups

- **SUPABASE_SERVICE_ROLE_KEY env var** — must be set in Vercel for the endpoint to work. If missing, it returns 500.
- **Full EIP-712 wallet signature validation** — deferred to post-alpha per brief. Would replace the on-chain ownership check with a signed message proving the caller controls the wallet.
- **INSERT policy hardening** — `trackProfileLinked` and `trackContentSigned` still use anon INSERT. Lower risk (bound to wallet activity), but same pattern could be applied.
- **POLYGON_AMOY_RPC_URL env var** — optional. Falls back to the public Polygon Amoy RPC. For production reliability, set a dedicated RPC (Alchemy/Infura).

## Files changed

```
certainid_ui/api/tracker-write.ts          (new — server-side write endpoint)
certainid_ui/src/lib/supabaseTracker.ts     (modified — 3 functions now use fetch())
certainid_ui/supabase-rls-task06.sql        (new — RLS migration to drop UPDATE policies)
```
