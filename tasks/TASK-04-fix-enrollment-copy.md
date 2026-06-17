# TASK-04 — Fix wrong "MetaMask" copy for Privy embedded wallet users

**Owner:** Cipher
**Assigned:** Claude Code
**Status:** 🔵 READY
**Created:** 2026-06-17
**Priority:** P0

## Context

From the Council Review (COUNCIL_REVIEW_2026-06-17.md, P0-4): `Enrollment.tsx:293` shows **"Step 1/2: Confirm deployment in MetaMask"** to ALL users, including the 90%+ who signed up with email and have a Privy embedded wallet. They will never see a MetaMask popup. They sit at a spinner forever. They email support. Highest-probability "is this broken?" complaint from alpha testers.

## Goal

Show the correct wallet popup instruction based on whether the user is using MetaMask or a Privy embedded wallet.

## Acceptance criteria

- [ ] Enrollment.tsx checks `isGasless` flag (or equivalent wallet type detection) before rendering the step label
- [ ] MetaMask users see "Confirm deployment in MetaMask" (current text — unchanged)
- [ ] Privy embedded wallet users see appropriate text like "Confirm deployment" or "Approve in wallet"
- [ ] No regression on the enrollment flow for either wallet type
- [ ] Text is consistent across any other copy that references MetaMask specifically

## Files / surfaces likely involved

- `certainid_ui/src/components/Enrollment.tsx:293` (and surrounding context)

## Git / deploy

- **Branch:** `main`
- **Deploy:** auto via `git push` → Vercel
- **Special considerations:** None — text-only change, no contract/env/logic changes

## Dependencies

- None

## References

- `COUNCIL_REVIEW_2026-06-17.md` — P0-4 section