# TASK-11 — Waitlist → Welcome Email Pipeline

**Owner:** Claude Code (backend) + Cipher (email/newsletter)
**Status:** 🔵 OPEN
**Priority:** P1 — blocks waitlist user experience
**Dependencies:** Brevo account setup (Cipher), Supabase webhook (Claude)

## The Problem

New waitlist signups land in Supabase only. No welcome email. No newsletter. No way for Garry to see who's on the list without hand-querying the DB.

We need: **Subscribe → Welcome email → Newsletter added** to work end-to-end.

## Architecture

```
User submits waitlist form
  → certainid_ui/api/waitlist.js (existing)
    → INSERT into Supabase `waitlist` table (existing)
    → POST to Brevo API to create contact + send welcome email (NEW)

Brevo (cloud email platform)
  → Handles: subscriber management, welcome email template, campaigns
  → Admin: Cipher manages the account
  → Free tier: 300 emails/day
```

## What Claude Code Builds

### 1. Modify `certainid_ui/api/waitlist.js`

After the existing Supabase INSERT succeeds, add a POST to Brevo's API:

```
POST https://api.brevo.com/v3/contacts
Headers:
  api-key: <BREVO_API_KEY>
  Content-Type: application/json
Body:
  {
    "email": "<user's email>",
    "attributes": {
      "FIRSTNAME": "<name from form, or split from email>",
      "WAITLIST_DATE": "<timestamp>"
    },
    "listIds": [2],  // "Waitlist" list ID in Brevo
    "updateEnabled": true
  }
```

Also optionally trigger the welcome email via Brevo's transactional email API:
```
POST https://api.brevo.com/v3/smtp/email
Body:
  {
    "to": [{"email": "<user's email>"}],
    "templateId": 1,  // Welcome email template ID
    "params": {"name": "<user's name or email>"}
  }
```

### 2. Environment Variables

Set these in Vercel (replacing the old `LISTMONK_*` vars):
```
BREVO_API_KEY=<value from Cipher>
BREVO_LIST_ID=2
BREVO_WELCOME_TEMPLATE_ID=1
```

### 3. Error Handling

- If Brevo call fails, the Supabase INSERT should still succeed (don't block signup)
- Log Brevo API errors server-side
- Don't show Brevo errors to the user

## What Cipher Does

1. Sets up Brevo account (free, 300 emails/day)
2. Creates welcome email template in Brevo
3. Creates "Waitlist" subscriber list in Brevo
4. Provides the API key + template ID to Claude
5. Tests end-to-end once Claude's code is deployed

## Testing

1. Submit waitlist form with a test email
2. Check Supabase `waitlist` table — row exists
3. Check Brevo — contact exists, in Waitlist list
4. Check test email inbox — welcome email received
5. Re-submit same email — should not duplicate (updateEnabled: true)

## File Locations

- `certainid_ui/api/waitlist.js` — main file to modify
- Vercel project: certainid_ui (production branch)
- Supabase project: odszybuhotefjnafdbob

---

**Created by:** cipher · 2026-08-13 · waitlist-pipeline
**Status:** Ready for Claude Code