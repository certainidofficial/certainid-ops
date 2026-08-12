---
type: test-checklist
updated: 2026-08-07
tags: [dev, alpha, testing, demo]
---

# Alpha Final-Test Checklist (phone)

Run on a phone, on `app.certainid.io` (NOT m.certainid.io). Reload once or twice first to clear the old build.

## Test 1 — Enrol on phone only (no computer)
- [ ] Sign in with **email**.
- [ ] Step 1 goes straight to **"This Device"** → **Face ID / fingerprint** → approve.
- [ ] **Skip** the optional "Add ID" step.
- [ ] "Register on Chain" completes **gaslessly** (no funds/gas prompt).
- [ ] Lands on the dashboard.
- **Pass = identity created on the phone alone, no gas.**

## Test 2 — Re-login holds the same contract (the bug just fixed)
- [ ] Sign out, then sign back in.
- [ ] Goes **straight to the dashboard** — no enrolment, no Face ID, no new contract.
- [ ] Repeat sign-out / sign-in 2–3 times; same identity every time.
- **Pass = one stable contract, no duplicates.**

## Test 3 — Sign content (gasless)
- [ ] Content tab → upload an image → sign it.
- [ ] Signs with **no gas prompt**, reaches the success screen.
- **Pass = content signed gaslessly. If it errors, capture the exact message.**

## Test 4 — Scan / verify authentic (now confirmed on-chain)
- [ ] Scan tab → upload the **same** file you just signed.
- [ ] Result: **"Authentic — This is Real"**, showing you as signer + the timestamp.
- **Pass = the scanner confirms it against the blockchain, not just the database.**

## Test 5 — Tamper detection
- [ ] Edit the file slightly (crop it, or use a different image) → scan it.
- [ ] Result: **"No CertainID Signature / Not Verified"** (red).
- **Pass = altered/unsigned content is correctly rejected.**

## Known minor edge (not a blocker, don't be alarmed)
If you revoke a signature and the on-chain revoke happens to fail, the dashboard may show it revoked while a scan still shows authentic — because the scan now reads the chain (which is correct), and the local revoke didn't reach the chain. Revoke is not in the core demo path. Flag it if you hit it and I'll harden the revoke to be chain-guaranteed.

## If anything trips
Tell Claude Code the **test number** + the **exact error** (desktop: F12 console; phone: describe what you see).
