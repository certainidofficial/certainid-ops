# TASK-02 — Fix ABI drift between contract source and inlined ABI

**Owner:** Cipher
**Assigned:** Claude Code
**Status:** 🔵 READY
**Created:** 2026-06-17
**Priority:** P0

## Context

From the Council Review (COUNCIL_REVIEW_2026-06-17.md, P0-1): The contract ABI is out of sync with the deployed Solidity source. `UserIdentity.sol:543` declares `verifySocialProfile(string _platform, VerificationMethod _method)` with two params, but the inlined ABI in `certainid_ui/api/deploy-identity.ts:21` and `certainid_ui/src/contracts/UserIdentity.json` declare the same function with one param (`_platform` only). `getSocialProfile` returns 7 fields in the ABI but 8 fields in source (missing `verificationMethod`). Every OAuth profile verification call either reverts silently or hits the wrong function selector.

## Goal

Verify the Amoy bytecode matches the Solidity source. If it doesn't, redeploy the contract and regenerate all ABI references. Ensure deployed contract, source code, and inlined ABI are in sync.

## Acceptance criteria

- [ ] Amoy bytecode is verified against `UserIdentity.sol` source — either confirmed matching or redeployed
- [ ] `certainid_ui/src/contracts/UserIdentity.json` has correct ABI matching the deployed contract
- [ ] `certainid_ui/api/deploy-identity.ts:21` ABI matches the deployed contract
- [ ] `useSocialProfiles.ts:101` index `[7]` correctly maps to `verificationMethod`
- [ ] End-to-end OAuth profile verification works (sign content, share, verify) without silent reverts
- [ ] All existing contract interactions still work (no regression from redeployment)

## Files / surfaces likely involved

- `certainid-blockchain/contracts/UserIdentity.sol:506-543`
- `certainid_ui/api/deploy-identity.ts:21`
- `certainid_ui/src/contracts/UserIdentity.json`
- `certainid_ui/src/hooks/useSocialProfiles.ts:101`
- `certainid_ui/src/api/verify/**`

## Git / deploy

- **Branch:** `main`
- **Deploy:** auto via `git push` → Vercel
- **Special considerations:** May require contract redeployment on Amoy testnet. If redeploying, existing enrolled users will need to re-enroll. Note this in the DONE report.

## Dependencies

- Council Review (read `COUNCIL_REVIEW_2026-06-17.md` for full context)
- Need access to relayer wallet for contract deployment

## References

- `COUNCIL_REVIEW_2026-06-17.md` — P0-1 section
- Amoy testnet explorer for bytecode verification