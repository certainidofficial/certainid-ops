# TASK-03 — Fix verification URL to include contract address

**Owner:** Cipher
**Assigned:** Claude Code
**Status:** 🔵 READY
**Created:** 2026-06-17
**Priority:** P0

## Context

From the Council Review (COUNCIL_REVIEW_2026-06-17.md, P0-2): The product's central pitch breaks at first contact. `ContentTab.tsx:157` `captionUrl()` encodes only `?hash=` in the verification link the user posts to social media. `VerifyContent.tsx:131-139` requires BOTH `?contract=&hash=` to auto-verify. So the friend who clicks the link sees a form asking for a "Contract Address" they've never heard of. They cannot verify. They leave.

## Goal

Fix `captionUrl()` to include both `contract` and `hash` query parameters so the shared verification link works on first click.

## Acceptance criteria

- [ ] `captionUrl()` in `ContentTab.tsx:157` generates URL with `?contract=${contractAddress}&hash=${hash}`
- [ ] Contract address is already available as a prop — confirm and use it
- [ ] `VerifyContent.tsx:131-139` reads both params and auto-verifies without showing the manual contract address form
- [ ] Shared link opens verification page showing on-chain proof directly (no extra input required)
- [ ] Existing hash-only links still work (backward compatibility)

## Files / surfaces likely involved

- `certainid_ui/src/components/ContentTab.tsx:157`
- `certainid_ui/src/components/VerifyContent.tsx:131-139`

## Git / deploy

- **Branch:** `main`
- **Deploy:** auto via `git push` → Vercel
- **Special considerations:** None — one-line fix in content generation

## Dependencies

- None — contract address is already a prop

## References

- `COUNCIL_REVIEW_2026-06-17.md` — P0-2 section