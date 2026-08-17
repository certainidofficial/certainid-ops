---
type: launch-plan
updated: 2026-08-17
tags: [launch, plan, roadmap]
---

# CertainID Launch Plan — one page, shared

Owners: **cc** = Claude Code (build), **cw** = Cowork (comms/marketing/Blotato), **ci** = Cipher/Sarta (VPS ops), **g** = Garry (decisions/testing).

## Works today (don't re-touch)
- App: gasless enrolment, mobile phone-only, content sign + on-chain verify, scanner. On Base mainnet.
- Supabase consolidated onto **MVP** (single production); CertainID Official = cold backup.
- Waitlist → welcome email + hello@ notification, live via Resend.

## Phase 1 — Launch-blocking polish (this week)
- [ ] **Homepage redesign** — futuristic, drop the dark-blue/indigo. Mock 2-3 directions, Garry picks, build winner. — **cc**
- [ ] **Welcome email + waitlist UI polish** — proper branded email, cleaner success screen. — **cc**
- [ ] **DMARC record** in Cloudflare (`_dmarc` TXT `v=DMARC1; p=none; rua=mailto:hello@certainid.io; fo=1`) — deliverability. — **g**
- [ ] **Final phone enrolment run on MVP** — the last foundation confirm. — **g**

## Phase 2 — CRM + follow-up (know your leads)
- [ ] Resend **click tracking** on → see who clicks "Try CertainID". — **cc/g**
- [ ] Funnel match: waitlist email = Privy login email → see joined → clicked → enrolled. — **cc**
- [ ] Waitlist table: add `status`, `tags`, `notes`, `last_contacted`. — **cc**
- [ ] Simple internal **admin dashboard** to work the leads. — **cc**
- [ ] **Follow-up drip** copy + cadence (day-3 "still keen?"). — **cw**

## Phase 3 — Marketing engine
- [ ] Content repurposing + posting via **Blotato**. — **cw**
- [ ] Blog + YouTube from the narrative kit. — **cw/ci**
- [ ] Expand social verifiers (IG/TikTok/FB/LinkedIn). — **cc** (post-launch)

## Parked (post-launch)
- Credential-lifecycle feature (spec'd, not built).
- Robust content watermark for platform re-encode survival.
- Cipher autonomous daemon (built, not installed).

— claude-code · 2026-08-17 · launch-plan
