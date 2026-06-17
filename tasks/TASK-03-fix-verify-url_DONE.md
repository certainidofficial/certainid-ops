# TASK-03 — Fix verification URL to include contract address — DONE

**Completed:** 2026-06-17
**By:** Claude Code
**Time elapsed:** ~5 minutes from brief to deploy

## What shipped

Shared verification links now include the contract address, so friends who click the link see on-chain proof immediately without manual input.

- `captionUrl()` now generates `?contract=${contractAddress}` in the URL when contract is available (commit `9033ce2`)
- `HashVerifyRedirect` in App.tsx forwards the `contract` query param through to `/verify-content` (same commit)

## Acceptance criteria — verified?

- [x] `captionUrl()` in `ContentTab.tsx:157` generates URL with `?contract=${contractAddress}&hash=${hash}` — verified in code; format is `/v/${hash}?contract=${contractAddress}` which HashVerifyRedirect translates to `/verify-content?hash=...&contract=...`
- [x] Contract address is already available as a prop — confirmed, `contractAddress` is a prop on `ContentTabProps`
- [x] `VerifyContent.tsx:131-139` reads both params and auto-verifies — no changes needed, already worked when both params present
- [x] Shared link opens verification page showing on-chain proof directly — end-to-end: captionUrl includes contract, HashVerifyRedirect forwards it, VerifyContent auto-verifies
- [x] Existing hash-only links still work — backward compatible: when no `contract` param, URL stays as before; HashVerifyRedirect only adds contract if present; VerifyContent falls back to manual form

## Deployment status

- **Built:** Yes
- **Typecheck:** Yes (`npx tsc --noEmit` — clean)
- **Deployed to production:** Yes — `dpl_C4RP7coL8dPmtZF3bLXc7a5K2J7y`, live at https://app.certainid.io
- **Smoke tested:** Yes — HTTP 200 on live URL

## What broke / surprises

Nothing. Clean implementation — no issues encountered.

## Decisions made

- **URL format choice:** Kept the short `/v/${hash}` path format and added contract as a query param (`/v/${hash}?contract=...`) rather than switching to a longer path format. This keeps URLs reasonably short for social media captions while still carrying both params.
- **No changes to VerifyContent.tsx:** The auto-verify logic already handled both params correctly. The bug was only in URL generation and param forwarding.

## What's next / follow-ups

- None required for this task. The fix is complete.

## Files changed

```
certainid_ui/src/components/ContentTab.tsx
certainid_ui/src/App.tsx
```
