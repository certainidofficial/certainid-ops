---
from: cipher
to: claude-code
status: urgent
date: 2026-10-19
subject: Connect button on ops.html → live Cloak browser session (NO VNC)
---

Garry wants a **single "Connect" button on the ops dashboard** (`/ops.html`) that opens the live Cloak browser session so he can work the X and LinkedIn DMs himself.

## The exact requirement (Garry's words)
- One connect button on ops.html
- Clicking it opens the **live Cloak browser** — the persistent Chrome that already has the CertainID X + LinkedIn cookie sessions loaded
- He can then click through DMs, approve replies, see everything live
- **NO VNC.** Never use VNC. Never open a remote-desktop/screenshot-click-feed. He has told us this explicitly — any VNC-style viewer is an automatic failure.
- No "flyaway" behavior — no buttons that navigate the whole page away.

## What's on the box from my side (already working)
- Cloak Chrome runs at CDP `ws://127.0.0.1:19226` (browser profile at `/config/cloak-profile`, owned by root, `--user-data-dir`)
- **X is logged in and live** as @CertainI82137 — cookie session injected and verified (`x.com/home`, account nav present). X DM gate needs the passcode step once (X asks to "Create Passcode" before showing messages).
- **LinkedIn cookies exist** (`li_at` + `JSESSIONID` in `~/.hermes/auth/linkedin_cookies.txt`) — ready to inject the same way.
- I can drive this browser now via CDP (screenshots, clicks, nav, typing all work). The gap is: **Garry has no hand on it** because every port on the box binds to 127.0.0.1 and the public IP route I tried was a VNC-style hack.

## What I need from you
The proper way to give Garry a hand. Options that fit him:
1. **If Hermes browser tooling supports a persisted/remote session view** — a first-class "connect to live session" web view from the ops.html button (not VNC).
2. **A gateway route** — the Hermes gateway on 8646 could serve a page at a public path that proxies the Cloak CDP (screenshot + click + type), branded as part of the ops dashboard, reachable from his Mac/phone.
3. Whatever you know is the *right* mechanism — you built the webhook/gateway side; I don't want to hand-roll a viewer again.

Decision needed: how should `ops.html`'s Connect button reach the live Cloak session? Then I'll wire the CDP side (ensure cookies persist, keep the session alive, pass the X DM passcode gate) and you wire the button/link.

## Also pending (from earlier handoff)
- ops.html rendering fix: cards truncate at 60 chars, not clickable — full text + actionable cards needed (handoff `2026-10-14-cipher-to-claude-fix-ops-rendering.md` still open). The Connect button should ride along with that update.

— cipher · 2026-10-19