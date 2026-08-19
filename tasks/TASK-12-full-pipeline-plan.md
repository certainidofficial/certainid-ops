# CertainID — Full Operations Pipeline

**Goal:** Complete every loop from waitlist to VC. One process at a time. Webhooks chain everything.
**Timeline:** 2-3 days
**Owner:** Cipher + Claude Code

---

## Pipeline Overview

```
Waitlist Signup (Supabase)
    │
    ▼
┌────────────────────────────────────────────────────────────┐
│  WEBHOOK 1: Supabase INSERT → Cipher                      │
│  Trigger: New row in `waitlist` table                      │
│  Action: Cipher sends welcome email via Gmail API          │
│  Owner: Claude (webhook) + Cipher (email)                  │
└────────────────────────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────────────────────────┐
│  WEBHOOK 2: Email sent → Brevo subscriber                  │
│  Trigger: Cipher marks email_sent=true in Supabase         │
│  Action: Add to Brevo list "Waitlist"                      │
│  Owner: Claude (Supabase update trigger) + Cipher (Brevo)  │
└────────────────────────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────────────────────────┐
│  WEBHOOK 3: Brevo subscriber → CRM entry                   │
│  Trigger: New subscriber in Brevo list                     │
│  Action: Create CRM record in Notion/vault                 │
│  Owner: Cipher (Brevo webhook → CRM)                       │
└────────────────────────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────────────────────────┐
│  CRON 1: Follow-up drip after signup                       │
│  Schedule: 3 days, 7 days, 14 days post-signup             │
│  Action: Send nurture emails via Gmail API                 │
│  Owner: Cipher (cron + email)                              │
└────────────────────────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────────────────────────┐
│  WEBHOOK 4: Customer reply / support email                 │
│  Trigger: Nova flags email from certainidofficial@gmail.com│
│  Action: Cipher drafts response, sends via Gmail           │
│  Owner: Nova (detect) + Cipher (respond)                   │
└────────────────────────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────────────────────────┐
│  CRON 2: Social media management                           │
│  Schedule: Daily (15 min AM, 15 min PM)                    │
│  Action: Like posts, reply to DMs, engage with ICPs        │
│  Owner: Cipher (via Blotato + X API)                       │
└────────────────────────────────────────────────────────────┘
    │
    ▼
┌────────────────────────────────────────────────────────────┐
│  CRON 3: VC research + outreach                            │
│  Schedule: Daily research, weekly outreach                 │
│  Action: Research investors, draft outreach email          │
│  Owner: Cipher (research + draft) + Garry (approve/send)   │
└────────────────────────────────────────────────────────────┘
```

---

## Day 1: Welcome Email + Brevo

### Step 1 — Welcome Email (Cipher)
- [ ] Write welcome email copy (1hr)
- [ ] Create email template file in vault
- [ ] Test send via Gmail API

### Step 2 — Brevo Setup (Cipher)
- [ ] Create Brevo account (free, 300 emails/day)
- [ ] Create "Waitlist" list
- [ ] Generate API key

### Step 3 — Webhook: Supabase INSERT → Cipher (Claude)
- [ ] Create Supabase Edge Function or Database Webhook on `waitlist` table INSERT
- [ ] POST to Cipher's webhook receiver on VPS (port 8080)
- [ ] Cipher catches it, sends welcome email, marks `email_sent=true`

---

## Day 2: Social + CRM + Retention

### Step 4 — Social Media Management (Cipher)
- [ ] **Daily engagement cadence:** 15 min AM, 15 min PM
  - Like 5-10 posts from ICPs/industry leaders (X + LinkedIn)
  - Reply to DMs (Blotato handles X DMs, LinkedIn via API)
  - Comment on 2-3 relevant posts with value-add
  - Send 3-5 connection requests (LinkedIn, personalized note)
- [ ] Script: `social-engagement.py` runs on cron, surfaces suggested interactions
- [ ] Cipher drafts replies, schedules via Blotato

### Step 5 — CRM (Cipher)
- [ ] Create CRM tracking in vault `_CRM/` folder
- [ ] Each subscriber gets a markdown file: name, email, signup date, status, notes
- [ ] Webhook: Brevo subscriber → CRM entry created

### Step 6 — Follow-up Drip (Cipher)
- [ ] Write Day 3 email: "Try the app"
- [ ] Write Day 7 email: "Alpha features"
- [ ] Write Day 14 email: "Feedback request"
- [ ] Cron job: check signups, send applicable emails

### Step 7 — Customer Service (Cipher + Nova)
- [ ] Nova already scans Gmail inbox every 15 min
- [ ] If email is from a subscriber → flag as "support"
- [ ] Cipher drafts response → Garry approves → sends

---

## Day 3: Sales + VC Outreach

### Step 7 — VC Research (Cipher)
- [ ] Research: Australian VCs funding identity/security/blockchain
- [ ] Research: AU government grants (CSIRO Kick-Start already drafted)
- [ ] Build target list in vault `_Sales/` folder

### Step 8 — VC Outreach Draft (Cipher → Garry)
- [ ] Write intro email template
- [ ] Write one-pager summary
- [ ] Garry reviews and sends

---

## Webhook Architecture

### On VPS (Cipher's box)
- **Receiver:** Simple Python HTTP server on port 8080
- **Endpoints:**
  - `POST /webhook/waitlist` — new signup → send welcome email
  - `POST /webhook/brevo` — new subscriber → CRM entry
  - `POST /webhook/email-sent` — email sent → next step in chain

### What Claude Code builds
- **Supabase Database Webhook** on `waitlist` table INSERT
  - Payload: `{ email, name, signed_up_at }`
  - Target: `http://10.35.94.251:8080/webhook/waitlist`

### What Cipher builds
- **Webhook receiver** on VPS (port 8080)
- **Email sender** via Gmail API
- **Brevo integration** via API
- **CRM tracker** in vault
- **Follow-up cron** for drip emails
- **VC research** + outreach draft

---

## Key Files

| File | Purpose | Location |
|---|---|---|
| `webhook-receiver.py` | Cipher's HTTP server for incoming webhooks | VPS |
| `welcome-email.md` | Welcome email template | vault/Marketing/ |
| `brevo-setup.md` | Brevo config + API key | vault/Marketing/ |
| `crm-tracker.md` | CRM entry format | vault/_CRM/ |
| `drip-emails.md` | Day 3/7/14 email templates | vault/Marketing/ |
| `vc-targets.md` | VC research list | vault/_Sales/ |

---

## Ownership

| Loop | Cipher | Claude Code | Garry |
|---|---|---|---|
| Welcome email | Write copy, send via Gmail | Supabase webhook → VPS | Approve email |
| Newsletter | Brevo setup, API key | — | — |
| Social media | Daily engagement, DMs, likes | — | — |
| CRM | Build tracker, wire webhook | — | — |
| Retention drip | Write emails, cron | — | — |
| Customer service | Draft responses | — | Approve responses |
| VC outreach | Research, draft | — | Approve + send |

**Chain rule:** Each step auto-fires the next. Cipher's webhook receiver is the glue. Claude builds the Supabase trigger. Everything else lives on the VPS.