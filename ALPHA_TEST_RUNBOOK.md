# Alpha Test Runbook — Founder End-to-End Walkthrough

**Created:** 2026-06-23
**For:** Gandelf7 — hands-on test before soft launch
**Estimated time:** 30-45 minutes for full path

This is a checklist-style runbook. Tick boxes as you go. Each step says **what to do**, **what success looks like**, and **what to do if it breaks**. Run it end-to-end as a stranger would — no shortcuts.

---

## ⚠️ Pre-flight (5 min) — DO THIS FIRST

Before testing, run the TASK-06 RLS migration. The code already ships through the new server endpoint, but the old anon-write policies are still in the database. Until you drop them, the security fix is half-applied.

### Step 0.1 — Run the migration SQL

- [ ] Open https://supabase.com/dashboard/project/odszybuhotefjnafdbob/sql/new
- [ ] Paste:

```sql
DROP POLICY IF EXISTS "social_update" ON social_profiles;
DROP POLICY IF EXISTS "signed_update" ON signed_content;
```

- [ ] Click **Run**
- [ ] Expected: "Success. No rows returned"
- [ ] Verify with:

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('social_profiles', 'signed_content');
```

- [ ] Confirm: **no UPDATE policies remain** on either table. INSERT and SELECT policies should still be listed.

**If it errors:** the policy names may differ. Paste this to see all current policies:
```sql
SELECT * FROM pg_policies WHERE tablename IN ('social_profiles', 'signed_content');
```
Identify the UPDATE rows and adjust the DROP statements.

### Step 0.2 — Confirm relayer has gas

- [ ] Open https://amoy.polygonscan.com/address/0x9DF7Ccc1A560303520D138e14ef6bDD15f364249
- [ ] Confirm: balance ≥ 0.1 MATIC (a full enrollment costs ~0.005–0.01 MATIC, so 0.1 = ~10 enrollments worth)
- [ ] **If under 0.1:** see the Polygon Amoy faucet section in earlier docs to top up. Don't skip this — running out mid-enrollment leaves a partial contract.

### Step 0.3 — Confirm Pimlico paymaster is funded

- [ ] Open https://dashboard.pimlico.io → your CertainID project
- [ ] Confirm: free-tier credit available (10,000 sponsored UserOps/month, fresh on the 1st)
- [ ] **If exhausted:** content signing via the embedded wallet will fail silently. Either wait for monthly reset OR upgrade. For testing today, you should be fine.

---

## Test 1: Marketing site (3 min)

The first thing a stranger sees.

- [ ] Open **https://www.certainid.io** (no www auto-redirect — try both)
- [ ] **Success:** page loads, no waitlist modal stuck open (the fix from earlier today)
- [ ] **Smoke check:** scroll to the bottom, read every section. Anything say "Tenderly", "MetaMask required", or "Claimed" badge? Those are stale — flag for Cipher.
- [ ] Click **Join Waitlist** in the top nav → modal opens
- [ ] Click the X → modal closes
- [ ] Refresh (Cmd+R) → modal stays closed
- [ ] Click **Blog** in the nav → goes to /blog → see the welcome post
- [ ] Click the **CertainID logo** → routes you to `app.certainid.io`

**If broken:** marketing site bug; tell Cipher to write a brief.

---

## Test 2: Sign in (2 min)

- [ ] At https://app.certainid.io, click **Continue with Email**
- [ ] **Success:** Privy modal opens
- [ ] Enter your email → click Submit
- [ ] **Within 30 seconds:** OTP code arrives in your inbox
- [ ] Paste the code → click Verify
- [ ] **Success:** you land on the dashboard
- [ ] **Note:** if this is a returning email, you'll skip enrollment and go straight to your existing dashboard. To test enrollment fresh, use a different email or wipe your test account in Supabase first.

**If the OTP never arrives:**
- Check spam folder
- Privy free tier has occasional delays — wait 60s and resend
- If still nothing: Privy dashboard at dashboard.privy.io shows recent auth attempts

**If you land on the dashboard but it's blank:** Privy SDK loaded but the dashboard isn't reading your wallet correctly. Open browser console — look for errors. Common cause: cookies/cache stale; try incognito.

---

## Test 3: First-time enrollment ceremony (10-15 min)

**Only runs if this email has no existing identity contract.**

- [ ] On the dashboard, you should see an enrollment prompt or call-to-action
- [ ] Follow the prompt → it'll show a QR code for phone handoff
- [ ] **On your phone:** open the camera, scan the QR
- [ ] **Success:** phone opens https://m.certainid.io with your session attached
- [ ] **On phone:** allow camera access
- [ ] Follow the prompts — face capture, document capture
- [ ] **Watch the desktop:** as each photo is captured, the desktop UI should update (hash arrives via Supabase Realtime channel)
- [ ] When all photos are captured, the desktop triggers contract deployment
- [ ] **Wait 20-60 seconds** — relayer is deploying your UserIdentity contract on Polygon Amoy
- [ ] **Success:** the dashboard now shows your wallet address, contract address, and the 3-pillar binding starts populating

**Common failures and fixes:**

| What you see | Probable cause | Fix |
|---|---|---|
| QR scan opens phone but session "expired" | Session row in Supabase has 5-min TTL; you took too long | Restart from desktop, scan again |
| Camera-denied error on phone | Permissions | Tap "Upload from Gallery" instead — fallback we shipped |
| Photo upload spinner stuck | Network issue | 30s timeout we shipped will surface error; retry |
| Contract deploy fails | Relayer out of gas | Step 0.2 — top up |
| Spinner hangs forever | Relayer endpoint 500 | Open `https://app.certainid.io/api/deploy-identity` — should return JSON. If 500, check Vercel env vars |

---

## Test 4: Link a social profile via OAuth (2 min)

The LinkedIn flow is the most polished — test it first.

- [ ] Click **Profiles** tab
- [ ] Click **+ Link Profile** (top right)
- [ ] Select **LinkedIn** — should show green **OAUTH** badge in the platform card
- [ ] Click **Sign in with LinkedIn** (no username field on OAuth platforms)
- [ ] **Success:** redirected to LinkedIn → click Allow
- [ ] Returns you to the dashboard
- [ ] **Wait 10-20 seconds:** two Privy popups appear (gasless via Pimlico) — one for `linkProfile`, one for `verifyProfile`. Confirm both.
- [ ] **Success:** LinkedIn appears in your profile list with a green **"Owned"** badge
- [ ] Refresh the dashboard — badge persists (not just optimistic UI)

**If you see "Linked" (amber) instead of "Owned" (green) after refresh:**
- Means `verifyProfile` didn't reach the server endpoint, only `linkProfile` did
- Check: was TASK-06's `/api/tracker-write` endpoint deployed? Hit `https://app.certainid.io/api/tracker-write` — should return 405 (method not allowed for GET) or similar. If 404, the endpoint didn't deploy.
- Check: was the SQL migration run (Step 0.1)? Until those old policies drop, you may get inconsistent state.

**If LinkedIn returns "redirect_uri does not match":**
- Their dashboard config drifted; re-add `https://app.certainid.io/api/auth/linkedin/callback` to authorized URLs

**Repeat for X, GitHub, YouTube** — these endpoints exist but need credentials registered. If you hit 500, the env vars for that provider aren't set yet. Not a blocker for alpha; LinkedIn alone proves the pattern works.

---

## Test 5: Sign content (3 min)

- [ ] Click **Content** tab (or similar — wherever the Sign Content button lives in the current build)
- [ ] Click **Sign Content**
- [ ] Drag in any test image (small PNG or JPG works fine, <5MB)
- [ ] **Success:** SHA-256 hash appears (looks like `0x99f428...`)
- [ ] Add a short description: "Test sign — 2026-06-23"
- [ ] Click **Sign**
- [ ] Privy modal pops (NOT MetaMask — gasless via embedded wallet + Pimlico)
- [ ] Confirm the signature
- [ ] **Wait 5-15 seconds** for on-chain confirmation
- [ ] **Success:** the app shows a verification link — copy it (looks like `https://app.certainid.io/#/v/0x99f428...?contract=0x...`)

**Confirm the URL has BOTH `?contract=` AND `?hash=`** — TASK-03 fixed this. If the URL only has `?hash=` and no `?contract=`, the TASK-03 fix didn't deploy or it regressed. Verify the new bundle is live.

**If sign fails:**
- "Insufficient funds" — Pimlico paymaster ran out of credit
- Generic wallet error — Privy embedded wallet not initialized; sign out and back in
- 500 from `/api/sign-content` — check Vercel logs

---

## Test 6: Verify the content as a friend (2 min)

**Open in incognito or a different browser** (so you're not logged in as yourself).

- [ ] Paste the verification URL from Test 5 into incognito
- [ ] **Success:** page loads showing a green **"Verified"** state
- [ ] Confirms: your wallet address (or display name), the timestamp, the content hash
- [ ] **Failure modes you'd see:**
  - "Not Found" — chain write may not have confirmed; wait 30s and retry
  - "Contract Address required" — the URL is missing `?contract=` (TASK-03 regression)
  - Page loads but says "Unverified" — hash genuinely isn't on chain; sign step failed silently

---

## Test 7: Public identity card (1 min)

The shareable "this is me" page anyone can see.

- [ ] In incognito, open `https://app.certainid.io/#/u/<your-contract-address>` (replace with the contract address from your dashboard)
- [ ] **Success:** see your public identity — display name (if set), verification level icons, all linked social profiles with badges, recent signed content count
- [ ] Badges should match what you see in your own dashboard
- [ ] Check that "Linked" appears for self-attested platforms (Instagram/TikTok if you linked any) and "Owned" for OAuth-verified ones (LinkedIn)

---

## Test 8: Family mode (optional, 5 min)

Only test if you want family-mode coverage. Otherwise skip.

- [ ] Open https://family.certainid.io in incognito
- [ ] Click **Sign Up** → create account with email + password
- [ ] Confirm email if required
- [ ] **Success:** lands on onboarding → pick "I'm a Parent"
- [ ] **New step:** asks for your name → enter it → Continue
- [ ] **Success:** lands on Parent Dashboard
- [ ] Click **+ Add child** → invite code generated
- [ ] Copy the invite link
- [ ] **Open in a SECOND incognito (different browser profile)** → paste the invite link
- [ ] Sign up as the child → pick age tier → join
- [ ] Back on parent dashboard → child appears in Children tab

**If invite code generation crashes on second attempt** — TASK from earlier sprint, should be fixed. If it crashes, file a bug.

---

## Final smoke check — the "alpha green light"

If all of the below are ✅, you're cleared for soft launch:

- [ ] Marketing site loads, modal works, blog accessible
- [ ] Email sign-in works, OTP arrives within 30s
- [ ] Full enrollment ceremony completes (or you successfully sign in to an existing identity)
- [ ] LinkedIn OAuth links + verifies → "Owned" badge persists after refresh
- [ ] Content signing completes → verification URL works for a friend in incognito
- [ ] Public identity card displays correctly with badges
- [ ] No console errors during the flow
- [ ] No 500s in the Network tab

Anything not ✅ → write a Cipher brief and fix before soft launch.

---

## What to do after the test

1. **Mark up this file** with anything you noticed — confusing UX, missing copy, broken corners. The notes section below is your scratchpad.
2. **For each issue,** decide: ship-blocker or post-alpha cleanup?
3. **Ship-blockers** → write a Cipher brief, the poller picks it up within 10 min and works it.
4. **Post-alpha cleanup** → add to `tracker.json` known-issues list, address in next sprint.
5. **When all ship-blockers are ✅** → invite your alpha cohort.

---

## Notes (your scratchpad)

_Mark up freely. Anything that becomes a Cipher task gets dispatched separately._

> [your notes here]
