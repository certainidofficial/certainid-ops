# Council Review — 2026-06-17

**Convened by:** Gandelf7
**Reviewers:** Frontend · Mobile · Backend · Blockchain · DevOps · QA-UX (6 specialists, parallel)
**Scope:** Honest gap audit. Find what's broken, what's fragile, what's dead code. No politeness.

---

## TL;DR Verdict

**The product is closer to working than the code suggests, and farther from alpha-ready than the recent shipping cadence implies.**

OAuth works for one human (you) on one platform (LinkedIn). The actual *flow a stranger would take* — landing on the site, signing up, signing content, having a friend verify that content — has at least three points where it silently breaks or visibly confuses. Several "shipped" features are actually half-shipped because the verification step was never done (ABI drift, Supabase column-write gap, RLS scoping).

The system has **two structural integrity issues** (ABI drift, Supabase data writes not matching the OAuth flow) that should be fixed before TASK-01 hash-embedding starts. Both will produce data corruption that is invisible to us until a real user hits it.

---

## P0 — Alpha-blocking (must fix before letting testers in)

### 1. Contract ABI is out of sync with the deployed Solidity source

**Source:** Blockchain agent. Single sharpest finding in the entire review.

`UserIdentity.sol:543` declares `verifySocialProfile(string _platform, VerificationMethod _method)` — **two params**.

The inlined ABI in `certainid_ui/api/deploy-identity.ts:21` and `certainid_ui/src/contracts/UserIdentity.json` declare the same function with **one param** (`_platform` only). `getSocialProfile` returns 7 fields in the ABI but 8 fields in source (missing `verificationMethod`).

**Consequence:** Every OAuth profile verification call either reverts silently on-chain or hits the wrong function selector. The verification badge shown to users may not match what's actually on-chain. `useSocialProfiles.ts:101` reads `verificationMethod` from index `[7]` which is `undefined` if the deployed function returns 7 fields.

**Cannot be resolved by inspection** — needs an Amoy bytecode check + redeployment if source and chain diverge.

**Files:** `certainid-blockchain/contracts/UserIdentity.sol:506-543`, `certainid_ui/api/deploy-identity.ts:21`, `certainid_ui/src/contracts/UserIdentity.json`

### 2. Verification URL shared to friends doesn't include the contract address

**Source:** QA-UX agent. The product's central pitch breaks at first contact.

`ContentTab.tsx:157` `captionUrl()` encodes only `?hash=` in the verification link the user posts to social media. `VerifyContent.tsx:131-139` requires BOTH `?contract=&hash=` to auto-verify. So the friend who clicks the link sees a form asking for a "Contract Address" they've never heard of. They cannot verify. They leave.

**Fix:** `captionUrl()` must include `?contract=${contractAddress}&hash=${hash}` — both. Contract address is already available as a prop in `ContentTab.tsx`.

### 3. OAuth verification_method/strength never written to Supabase

**Source:** Backend agent.

`supabaseTracker.ts:123-140` `trackProfileVerified` only sets `is_verified: true` and `verified_at`. It does NOT write `verification_method: 'oauth'` or `verification_strength: 3`. Every OAuth-linked profile in Supabase shows `verification_method: 'manual', verification_strength: 1` — whatever was set at link time. The UI's three-tier badge system (Owned / Verified / Claimed) is reading from these columns, so **every OAuth user's badge is wrong in the fast-read path**.

Blockchain is the source of truth so this only corrupts the public profile page, but the public profile page is the user-facing artifact.

### 4. Wrong wallet copy shown to Privy email users during enrollment

**Source:** QA-UX agent. Highest-probability "is this broken?" email from testers.

`Enrollment.tsx:293` shows **"Step 1/2: Confirm deployment in MetaMask"** to ALL users, including the 90%+ who signed up with email and have a Privy embedded wallet. They will never see a MetaMask popup. They sit at a spinner forever. They email support.

### 5. Supabase RLS lets anon key UPDATE any user's social_profiles row

**Source:** Backend agent.

`supabase-rls-hardening.sql:120-123` `social_update` policy: `USING (true) WITH CHECK (is_verified IS NOT TRUE)` — any anon client can overwrite any row's `username`, `platform_user_id`, `verification_post` as long as they don't flip `is_verified`. There's no `wallet_address` ownership check because Supabase Auth isn't in use. The schema's own comment (lines 157-160) flags this as post-alpha but **for an identity product, this is the wrong call** — cross-user data corruption is trivial.

Same problem on `signed_content` UPDATE.

### 6. Hardcoded relayer private key in plaintext, only protected by root `.gitignore`

**Source:** DevOps agent.

`certainid-blockchain/.env` contains `PRIVATE_KEY=0x2c3d...` — a real relayer key, not a test key. The root `.gitignore` excludes it, but the `certainid-blockchain/` subdirectory has **no `.gitignore` of its own**. One bad `git add` or one extraction of `certainid-blockchain` to its own repo and the key is on GitHub.

### 7. ProfilesTab empty-state describes a flow that no longer exists

**Source:** Frontend agent.

`ProfilesTab.tsx:537` hardcodes "X, YouTube, GitHub" as the bio-verification platforms in step-2 of the onboarding bullet. But all three are now `proofOfPost: false, oauth: true` in `useSocialProfiles.ts:33-36`. An alpha tester reads the step, pastes a magic string into their X bio that will never be checked, and waits for verification that won't come.

---

## P1 — Important (next sprint)

### Frontend
- **OAuth return has no loading state.** When the user lands back from LinkedIn, `linking=true` is set but only rendered inside `showLinkModal`. The user sees the profile list with two contract writes in flight (10-30s) and no feedback. (`ProfilesTab.tsx:126-487`)
- **`window.confirm()` for Unlink fails on mobile** — iOS Safari blocks UI thread; some Android webviews silently resolve `false`. (`ProfilesTab.tsx:253`)
- **`linkedPlatformForCheck` state is always empty** at runtime — dead state with wrong-platform-name potential. (`ProfilesTab.tsx:43`)

### Mobile
- **No service worker.** `vite.config.ts` has zero PWA configuration. "Install" prompt won't fire on Android Chrome. iOS Safari can still "Add to Home Screen" but loses session on backgrounding.
- **`ContentCapture.tsx` has no Promise.race timeout** (unlike `MultiPhotoCapture` which does). Network hiccup = infinite spinner with no recovery.
- **Session URL params are query-string only** — iOS Safari link unfurlers strip them silently. Session dies with no error.

### Backend
- **OAuth endpoints have zero rate-limiting.** Attacker loops `/api/auth/github/start` to burn GitHub OAuth quota. Need 5 req/10min per IP. (`api/auth/[provider]/start.ts`)
- **Relayer `hasExistingDeployment` check uses `social_profiles` as a proxy.** Cold start + zero-linked-profile user can trigger concurrent N deployments before Supabase writes land. At 0.2 MATIC current balance, a 10-request burst drains the wallet.
- **No Pimlico free-tier failure fallback.** When the daily cap hits, content signing breaks for everyone on the embedded wallet path with a generic wallet error. No user-friendly message, no fallback to "pay your own gas."

### Blockchain
- **Two writes per OAuth profile link** (linkProfile + verifyProfile) is 2× Pimlico cost AND 2 Privy popups. Solved by adding one new contract function `linkAndVerifyProfile(...)` that does both in one storage write. Detailed spec in the blockchain agent's report.
- **`linkSocialProfile` overwrites `linkedTimestamp` on re-link.** "Linked since" display is untrustworthy for re-linked accounts. (`UserIdentity.sol:506-528`)
- **`linkSocialProfile` hardcodes `VerificationMethod.MANUAL`** — verification_method on the contract is wrong until verifySocialProfile lands separately. Window of incorrect state.

### DevOps
- **No pre-commit hook enforcing the canonical git author rule.** Purely a memory rule. A misfire bypasses it silently. 5-minute fix exists.
- **Supabase keep-alive cron is the only signal.** Vercel Hobby cron throttling has happened before. UptimeRobot 6-hour external monitor on `/api/ping` adds redundancy for free.
- **No env-var inventory.** `OAUTH_STATE_SECRET`, `PRIVATE_KEY`, `VITE_PIMLICO_API_KEY` exist only in Vercel + this machine. If either dies, three secrets are unrecoverable. Back up to 1Password today.
- **Hobby plan function cap hit in ~2 months** if Instagram/TikTok/Facebook OAuth ship. Forced upgrade to Pro by August 2026 unless we consolidate or trim.

### QA-UX
- **Dashboard 3.5s silent wallet wait + silent redirect to /login on failure.** Returning users get bounced with no explanation. (`Dashboard.tsx:123-139`)
- **Overview tab is a status display, not an onboarding experience.** Grey pillars, "Not Bound" jargon, 0/0/0 counters, no "what to do next" prompt.
- **Landing page hero is generic** ("Your Identity. Your Control."), CTA sub-copy mentions "Polygon Amoy testnet" which scares civilians.

---

## P2 — Cleanup / refactor debt

- **~120 lines of dead bio-paste JSX** in ProfilesTab (modal screen 2, magic string display, copyMagic helper, expandedMagic state, post-instructions branch)
- **`/api/verify/proof-of-post.ts` is dead** — no platform has `proofOfPost: true` anymore. Deleting it + `_lib/verifiers/{github,youtube,x,_types}.ts` frees one serverless function slot
- **`manual` enum is a zombie** in `useSocialProfiles.ts:10` and `VERIFICATION_METHOD_ENUM:90` — nothing sets it anymore
- **`getProfiles()` does N+1 RPC calls** (1 getLinkedPlatforms + 1 getSocialProfile per platform). Fine for alpha, problematic at scale
- **`getGuardians()` loops over append-only `_guardianList`** including revoked entries — unbounded growth on mainnet

---

## Single biggest SPOF

**Supabase.** Free tier, no read replica, no daily backup export, no pg_dump cron. Auto-paused once already. Going down = product 100% non-functional. Vercel down = recoverable in minutes. Privy down = wallet users can't sign in but data is intact. Supabase down = nothing works.

---

## What the council unanimously agreed is doing well (preserve)

- **The 3-tier verification badge system** (Owned / Verified / Claimed) — correct visual + data instinct (Frontend, QA-UX)
- **The biometric consent gate at enrollment** — specific, honest, placed at the decision point (QA-UX)
- **The `Promise.race` 30s timeout pattern** in MultiPhotoCapture — correct mobile resilience approach (Mobile)
- **The two-contract IdentityRegistry/UserIdentity split** — scales, chain-agnostic, mainnet-ready as-is (Blockchain)

---

## Strategic decisions surfaced for Gandelf7

These aren't bugs — they're decisions the council surfaced that you need to make:

1. **Collapse link + verify into ONE contract call.** Blockchain agent says yes, with a `linkAndVerifyProfile()` function added to `UserIdentity.sol`. Requires redeployment + alpha user re-enrollment. **Decision: yes/no/defer.**

2. **Mobile content scanner — when to start.** Realistic 2-4 weeks of work. Currently the only mobile use case is enrollment-time biometric capture. **Decision: TASK-N where?**

3. **Mobile-as-signing-surface.** 80% built (ContentCapture exists). 3-5 day spike. **Decision: do we close this loop for the mobile-only user?**

4. **Family app contracts — deploy or defer.** Contracts exist, Supabase flow works. Deploying creates two-source-of-truth migration pain. **Council recommendation: defer until core identity stable on mainnet.**

5. **Mainnet migration window.** Council says 3-5 days, not month. Triggers: relayer funding required, Pimlico mainnet credit, contract redeploy, ABI regen. **Decision: which sprint?**

6. **Vercel Pro upgrade timing.** ~Aug 2026 forced by function cap if social verifiers ship. $80/month at 4 projects, $60 if we consolidate to 3. **Decision: budget approval window.**

---

## Recommended next 5 task briefs for Cipher

In execution order (not priority — these are sequenced for dependency):

1. **TASK-02 — Fix the ABI drift** (P0-1). Verify Amoy bytecode matches source; if not, redeploy. Regenerate `UserIdentity.json`, sync inlined ABI in `deploy-identity.ts`. Estimate: 3-4 hours including chain interaction tests.
2. **TASK-03 — Fix verification URL to include contract address** (P0-2). One-line fix in `ContentTab.tsx:157`. Estimate: 30 minutes including tests.
3. **TASK-04 — Fix wrong "MetaMask" copy for Privy embedded wallet users** (P0-4). Conditional on `isGasless` flag. Estimate: 30 minutes.
4. **TASK-05 — Write verification_method/strength on OAuth return** (P0-3). Update `trackProfileVerified` to accept method+strength; pass from ProfilesTab. Estimate: 1 hour.
5. **TASK-06 — Tighten Supabase RLS on social_profiles UPDATE** (P0-5). Add wallet_address scoping. Estimate: 2 hours including testing.

After these five P0s land, do TASK-01 (hash-embedding floating badge) per the existing brief.

---

## Verdict

**Don't open alpha to testers tomorrow.** The five P0s above represent ~1 working day of fixes. After they land, do one end-to-end smoke test with you as the alpha tester (signup → enrollment → sign content → share URL → verify content as a friend in incognito). If that flow completes cleanly, then alpha opens.

Hash-embedding (TASK-01) is real product work and worth doing, but it's downstream of fixing the things that are silently broken on the existing surfaces.
