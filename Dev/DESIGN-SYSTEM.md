---
type: design-system
updated: 2026-08-18
tags: [dev, design, brand, launch]
---

# CertainID Design System (approved 2026-08-18)

Reference implementation: `Dev/reference-hero.html` (the hero Garry signed off). Match everything to it.
Direction: **light, futuristic, glassmorphic, with real depth** — replaces the old dark #06080f + indigo/emerald.

## Tokens
**Background** (light aurora, must not blow out on phones/sunlight):
`linear-gradient(165deg,#eef6fb 0%,#e6f3f1 52%,#e9f0f7 100%)` + soft radial glows: blue `rgba(47,142,247,.20)` top-left, teal `rgba(20,210,189,.22)` top-right, violet `rgba(123,108,240,.14)` bottom.

**Text (dark ink on light):** ink `#0c2233` · muted `#42596b` · faint `#7c8ea0`
**Accents:** teal `#0bb3a3` · teal-bright `#14d2bd` · blue `#2f8ef7` · blue-deep `#1e6fd6` · violet `#7b6cf0`
**Glass:** fill `rgba(255,255,255,.60)`–`.80`, border `rgba(255,255,255,.9)`, `backdrop-filter:blur(16–20px) saturate(130%)`, inset top highlight `inset 0 1px 0 rgba(255,255,255,.9)`.
**Shadows (dark navy, layered = floats on light):**
- base: `0 4px 10px rgba(9,42,68,.12), 0 26px 50px -12px rgba(9,42,68,.42)`
- large: `0 8px 18px rgba(9,42,68,.16), 0 44px 78px -14px rgba(9,42,68,.55)`
**Radius:** cards 20px · buttons 14px · pills 999px
**Type:** `system-ui, "SF Pro Display", "Helvetica Neue"`; headings weight 800, `letter-spacing:-.03em`, `text-wrap:balance`; gradient text on highlight words = teal→blue→violet.
**Motion (subtle, reduced-motion aware):** blurred aurora orbs float; badge sheen sweep; hover-lift on cards/buttons; protective aura glow behind hero.

## Brand
- Wordmark **CertainID** with **ID** in the teal→blue gradient.
- Logo (navy C + fingerprint + blue ID + check) is **boxless** — floats directly with a soft teal/blue glow + drop shadow. No dark container.
- Primary button = teal→blue gradient, white text, glow shadow. Ghost button = white glass.

## Rollout order (do NOT hand-hack per page — apply the tokens)
1. **Design tokens** — a shared `:root` (marketing site) + Tailwind theme colors/utilities (app) so it's one system.
2. **Marketing site** (`certainid-official/src/pages/index.astro` full dark→light inversion, then blog/legal). Lower risk.
3. **App** (`certainid_ui`) screen by screen — Login → Enrolment → Dashboard → Content/Scan/Verify. HIGHER RISK: it's live on Base. Change presentation only, keep logic; **re-verify enrol + content-sign + verify flows after each screen.**

## Status
Hero approved + built (`reference-hero.html`). Rollout NOT started — execute in the fresh post-restart session (updates + frontend-design skill active). Marketing site first, app second with flow verification.
