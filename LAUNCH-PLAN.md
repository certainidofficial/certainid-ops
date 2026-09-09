---
type: launch-plan
updated: 2026-08-20
tags: [launch, plan, roadmap, restructure]
---

# CertainID Launch Plan — Restructured for Proactive Operations

**Owners:** **cc** = Claude Code (build), **ci** = Cipher (strategy/ops/engagement), **cw** = Cowork (comms/drafts), **g** = Garry (decisions/testing).

**Key View Digital** — marketing brand for sovereign data (not parent company). Promotes CertainID.

---

## Agent Architecture (NEW)

```
Cipher (Strategist)
   │
   ├── Engagement Agent (new)
   │       • Reads/answers emails
   │       • Reads/answers DMs
   │       • Likes, reposts, comments
   │       • Sends connection requests
   │       • Auto-engages via webhooks — no waiting
   │
   ├── Posting Pipeline
   │       • Morning research → repurpose top 3 → schedule via Blotato
   │       • Viral hooks + brand brief
   │       • Runs without Garry approval
   │
   ├── Nova (Comms Officer)
   │       • T1: Triages Gmail
   │       • T2: Drafts replies for approval
   │
   └── Claude Code (Build)
           • All code, deployments, Supabase, smart contracts
```

---

## Webhook Chain (NEW — proactive, not reactive)

```
Waitlist Signup (Supabase INSERT)
   │  WEBHOOK
   ▼
Cipher's VPS receiver (port 8080)
   │  Sends welcome email via Gmail API
   ▼
Email sent → Add to Brevo newsletter list
   │  WEBHOOK
   ▼
Brevo subscriber → CRM entry created (vault _CRM/)
   │  CRON
   ▼
Day 3 / Day 7 / Day 14 drip emails auto-sent
   │
   ▼
Engagement Agent (social DMs, likes, comments — auto)
```

---

## Works today (don't re-touch)
- App: gasless enrolment, mobile phone-only, content sign + on-chain verify, scanner. On Base mainnet.
- Supabase consolidated onto **MVP** (single production); CertainID Official = cold backup.
- Waitlist → welcome email + hello@ notification, live via Resend.

---

## Phase 1 — Launch-blocking polish
- [x] **Homepage hero redesign** — APPROVED. Reference: `Dev/reference-hero.html` + `Dev/DESIGN-SYSTEM.md`.
- [ ] **Roll the design system everywhere** — marketing site (dark→light, all sections/blog) then the app screens. — **cc**
- [ ] **Welcome email deliverability** — fix Resend/SPF/DKIM so test didn't bounce. — **cc/g**
- [ ] **DMARC record** in Cloudflare — `_dmarc` TXT. — **g**
- [ ] **Final phone enrolment run on MVP** — last foundation confirm. — **g**

---

## Phase 2 — CRM + Engagement (Cipher's lane)
- [ ] **Webhook receiver** on VPS (port 8080) — catches Supabase INSERT, sends welcome email. — **ci**
- [ ] **Brevo setup** — create list "Waitlist", API key. — **ci**
- [ ] **CRM tracker** — vault `_CRM/` folder, each subscriber = .md file. — **ci**
- [ ] **Follow-up drip** — Day 3/7/14 email copy + cron schedule. — **ci**
- [ ] **Engagement Agent** — auto like, reply, DM, connect on X + LinkedIn. — **ci**
- [ ] **Social media: answer DMs, like posts, connect** runs daily 15min AM + 15min PM. — **ci**
- [ ] Resend click tracking → funnel match (who clicked vs enrolled). — **cc/g**

---

## Phase 3 — Content Engine
- [x] **Blotato API** — 3 X posts scheduled, posting script saved. — **ci**
- [ ] **LinkedIn re-auth** in Blotato UI (OAuth expired). — **g**
- [ ] **Blog pipeline** — 6 topics queued, write + publish weekly. — **ci/cw**
- [ ] **YouTube Shorts** — from the narrative kit. — **ci**
- [ ] **Expand social verifiers** (IG/TikTok/FB). — **cc** (post-launch)

---

## Narrative (Key View Digital → CertainID)

**Updated 2026-08-31:** Patents are backstory, not headline. Financials constrain renewal, not patent value. They still protect us as a timeline shield. Lead with the working product; patents are part of what helped us build it.

**Key View Digital** — "Your data. Your server. Your control. Sovereign data infrastructure."
     ↓
**CertainID** — "Your face verifies you. Not a bank. Not a government server. On-device biometrics, blockchain proof. Live on Base mainnet."
     ↓
**Authentic content** — "Cryptographically signed by the creator. Verifiable by anyone. Permanently on-chain."

**How we talk about the patents:**
- "Built on deep technical foundations including the Atherton/MIKOH patent families. Those patents shaped the architecture. We're in active discussions with the patent holders."
- NOT front and center. Mentioned as backstory, not headline.
- The timeline shield still works — if someone else buys them, they can't retroactively block us.

**Key phrases:**
- "Your face should verify you. Not a bank."
- "The only database that can't be breached is the one that doesn't exist."
- "Sovereign data lives where you control it. Not on a third-party server."
- "Working product. Live on Base mainnet. Built on deep technical foundations."

---

## Ownership Summary

| What | Who | Status |
|---|---|---|
| Design rollout | cc | ❌ Not started |
| Welcome email fix | cc/g | ⚠️ Built, test bounced |
| Webhook receiver | ci | ❌ Not built |
| Brevo + CRM | ci | ❌ Not built |
| Follow-up drip copy | ci | ❌ Not written |
| Engagement (DMs, likes) | ci | ❌ Not built |
| Blotato posting | ci | ✅ 3 posts live |
| LinkedIn re-auth | g | ❌ Expired |
| Blog + YouTube | ci/cw | ❌ Not started |
| DMARC in Cloudflare | g | ❌ Not set |

---

## Skills Created This Session

| Skill | What It Does |
|---|---|
| `blotato-viral-hooks` | 100 hook frameworks, 13 categories |
| `blotato-brand-brief` | Captures brand voice for consistent posts |
| `blotato-post-writer` | Writes posts using brand brief + hooks |
| `certainid-research-repurposer` | Auto repurposes morning research → social posts |
| `certainid-positioning` | Sales narrative for myID/ConnectID comparison |

— cipher · 2026-08-20 · restructured-launch-plan