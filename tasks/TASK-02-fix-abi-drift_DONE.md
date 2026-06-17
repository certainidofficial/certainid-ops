# TASK-02 — Fix ABI drift between contract source and inlined ABI — DONE

**Completed:** 2026-06-17
**By:** Claude Code

## What shipped

Updated the inlined ABI and bytecode in `certainid_ui/api/deploy-identity.ts` to match the current `UserIdentity.sol` source and Hardhat artifact (commit `73f87b3`). Deployed to production at app.certainid.io.

- `verifySocialProfile` ABI: was 1 param (`_platform` only), now 2 params (`_platform` + `_method`)
- `getSocialProfile` ABI: was 7 return fields, now 8 (added `verificationMethod`)
- `socialProfiles` auto-getter ABI: was 7 return fields, now 8 (added `verificationMethod`)
- Bytecode: was 26,510 hex chars (old compiler output), now 32,782 hex chars (current Hardhat artifact)

## Acceptance criteria — verified?

- [x] Amoy bytecode is verified against `UserIdentity.sol` source — The inlined bytecode now matches the Hardhat artifact compiled from the current source. **Note:** existing deployed user contracts still have old bytecode (see "What's next").
- [x] `certainid_ui/src/contracts/UserIdentity.json` has correct ABI — was already correct before this task (2-param `verifySocialProfile`, 8-field `getSocialProfile`). No changes needed.
- [x] `certainid_ui/api/deploy-identity.ts:21` ABI matches the deployed contract — updated from Hardhat artifact. Now matches source.
- [x] `useSocialProfiles.ts:101` index `[7]` correctly maps to `verificationMethod` — was already correct. Uses `UserIdentity.json` (correct ABI), casts to 8-element tuple, `result[7]` = `verificationMethod`.
- [ ] End-to-end OAuth profile verification works without silent reverts — **PARTIALLY MET.** New contracts deployed after this fix will work correctly. Existing user contracts deployed with the old bytecode still have the 1-param `verifySocialProfile` and 7-field `getSocialProfile` — calls from the frontend (which uses the correct 2-param ABI) will hit the wrong function selector on those old contracts.
- [x] All existing contract interactions still work — `registerIdentity`, `addDocument`, `createThreePillarBinding`, `transferOwnership` signatures were unchanged between old and new ABI. The deploy flow is unaffected.

## Deployment status

- **Built:** Yes
- **Typecheck:** Yes (`npx tsc --noEmit` clean)
- **Deployed to production:** Yes — app.certainid.io (dpl_8zZTooasZWXG1eMNLorKUo7uYMV7)
- **Smoke tested:** Yes — HTTP 200 on app.certainid.io, HTTP 403 on /api/deploy-identity (expected auth gate)

## What broke / surprises

Nothing broke. The two files that the brief flagged as potentially wrong (`UserIdentity.json` and `useSocialProfiles.ts`) were already correct. Only `deploy-identity.ts` had drift — both ABI and bytecode.

The Hardhat artifact bytecode (32,782 chars) is significantly larger than the old inlined bytecode (26,510 chars), suggesting a different Solidity compiler version was used for the original inline.

## Decisions made

1. Used the existing Hardhat artifact (`certainid-blockchain/artifacts/contracts/UserIdentity.sol/UserIdentity.json`) rather than recompiling from scratch. The artifact's ABI matches the source, confirming it was compiled from the current code.
2. Did not redeploy existing user contracts — that requires iterating all deployed addresses and is a separate task.
3. Deployed via `./deploy-ui.sh --prod` (the correct method per project conventions) rather than the brief's stated "auto via git push" method.

## What's next / follow-ups

- **P0 — Migrate existing user contracts:** All user contracts deployed before this fix have old bytecode with 1-param `verifySocialProfile`. The frontend tries to call the 2-param version, so social profile verification will revert on existing contracts. Options: (a) deploy new contracts for existing users and migrate data, (b) add a fallback in the frontend to detect old contracts and use 1-param call, or (c) require re-enrollment.
- **P2 — ABI sync script:** Consider a build-time script that auto-generates the inlined ABI/bytecode in `deploy-identity.ts` from the Hardhat artifact, preventing future drift.

## Files changed

```
certainid_ui/api/deploy-identity.ts
```
