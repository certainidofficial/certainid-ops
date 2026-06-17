# TASK-01 — Hash embedding / anti-deepfake floating badge

**Owner:** Cipher
**Assigned:** Claude Code
**Status:** 🔵 READY
**Created:** 2026-06-17
**Priority:** P0

## Context

CertainID needs the final feature before alpha: a **transparent holographic badge** that floats on signed content proving it's human-made and unmodified. Gandelf7 has been working on this with Claude Code — the components are partially built but need to be finished and wired together.

The badge is a transparent holographic overlay with a **checkmark (✓) in the middle**. The checkmark changes color to indicate verification state (verified / not verified / pending). It's a see-through holographic effect — not opaque, not in-your-face.

## Goal

Ship a working floating badge that a CertainID user can embed on signed content (images, videos, text, URLs) showing a transparent holographic overlay with a color-changing tick. Clicking the badge opens a verification page showing on-chain proof.

## Acceptance criteria

- [ ] Signed content displays a transparent holographic floating badge overlay
- [ ] Badge has a checkmark (✓) in the center that changes color based on verification state
- [ ] Badge is transparent/see-through — holographic effect, not opaque
- [ ] Clicking the badge opens the verify page showing on-chain proof
- [ ] Modified/unsigned content shows "Not Verified" state (different color tick)
- [ ] User can sign content (image/video/text/URL) on app.certainid.io
- [ ] After signing, user gets a working embed code or share link
- [ ] Badge is mobile-responsive
- [ ] No regression on existing surfaces (dashboard, enrollment, profiles)

## Out of scope

- **Built-in scanner/verifier** that scans any content/person to auto-detect CertainID status — that's a future task (Gandelf7 ran into snags trying to build this before)
- **Browser extension** integration
- **Vercel/git author concerns** — this repo is NOT connected to Vercel, so commits here don't trigger builds or trigger collaboration heuristics. Code changes still go through `certainid-mvp`.

## Files / surfaces likely involved

- `certainid_ui/src/components/VerifiedSeal.tsx` — existing holographic badge SVG component
- `certainid_ui/src/components/CertainIDBadge.tsx` — existing floating badge component (C logo + fingerprint, hover card)
- `certainid_ui/src/components/VerifyContent.tsx` — verification page
- `certainid_ui/src/components/ContentTab.tsx` — UI for signing content
- `certainid_ui/src/hooks/useContentSigning.ts` — existing sign flow
- `certainid_ui/src/lib/imageHash.ts` — SHA-256 hashing on-device
- `api/verify/content-hash.ts` — verification endpoint

## Git / deploy

- **Branch:** `main`
- **Deploy:** auto via `git push` → Vercel
- **Special considerations:** No env var changes or contract deployments needed for this task. All code lives under `certainid-mvp`.

## Dependencies

- None — the signing infrastructure already exists. This is finishing and polishing existing components.

## References

- Gandelf7 (voice): "Badge is a tick in the middle, tick changes color. Hologram — you look through it. Transparent, not in your face."
- `certainid-official/src/pages/index.astro` — marketing site demo showing the holographic-badge concept (~line 990)