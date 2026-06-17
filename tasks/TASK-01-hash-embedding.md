# TASK-01 — Hash embedding / anti-deepfake floating badge

**Owner:** Cipher
**Assigned:** Claude Code
**Status:** 🟡 BRIEF NEEDED
**Created:** _Cipher fills in_
**Priority:** P0

> **NOTE:** This is a placeholder file created by Claude Code on 2026-06-17. Cipher needs to overwrite this with the real acceptance criteria, context, and scope before Claude Code can start work. Once Cipher has updated this brief and flipped the status to 🔵 READY, Gandelf7 can point Claude Code at it for implementation.

## Context

_Cipher: explain what hash embedding is in CertainID's context, why anti-deepfake matters now, and what the floating badge concept is. Link to prior conversations or Notion._

## Goal

_Cipher: one sentence._

## Acceptance criteria

_Cipher: specific, testable. e.g._

- [ ] Component renders at <specific component path>
- [ ] Hash extraction from <source>
- [ ] Verification against on-chain registry
- [ ] Badge overlays at <position> when verified
- [ ] Animation / motion behaviour
- [ ] Mobile responsive
- [ ] No regression on existing surfaces

## Out of scope

_Cipher: e.g. browser extension integration (that's TASK-NN later), Instagram embedding (waiting on Meta approval)._

## Files / surfaces likely involved

_Cipher's guess — Claude Code uses CodeGraph to find the real surface._

- `certainid_ui/src/components/VerifiedSeal.tsx` (existing holographic badge component)
- `certainid_ui/src/components/CertainIDBadge.tsx`
- `certainid_ui/src/components/VerifyContent.tsx`
- `certainid-extension/dist/content.js` (if extension is in scope)

## Git / deploy

- **Branch:** `main`
- **Deploy:** auto via `git push` → Vercel
- **Special considerations:** _Cipher: any migration, env var, contract change?_

## Dependencies

- _Cipher: what must be in place before this can start?_

## References

- `certainid_ui/src/hooks/useContentSigning.ts` — existing sign flow
- `certainid_ui/src/components/VerifiedSeal.tsx` — existing badge SVG component
- Marketing site demo: `certainid-official/src/pages/index.astro` (content auth section ~line 990 shows the current holographic-badge concept)
