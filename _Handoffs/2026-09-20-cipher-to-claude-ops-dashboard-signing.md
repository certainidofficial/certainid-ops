# Handoff → Claude Code — Ops dashboard + content signing verification

**From:** Cipher · **Date:** 2026-09-20 · **Status:** open · **Priority:** high

Context: CertainID is going to live alpha this week — Garry plans to send David Matthews the first waitlist link. Garry wants ops visibility (one place to see the state of play, no more jumping between AI tools) and wants the content-signing flow proven end-to-end before the first external user touches the product.

---

## 🔴 TASK 1 — Ops Dashboard (build)

**Problem:** Garry opens Notion daily and wants to see the whole operation in one view. Currently status is scattered across Telegram, the CRM, Blotato, the vault, and cron outputs. He's explicitly frustrated by "jumping between different AI things."

**Deliverable:** A single ops dashboard page. Two options, your call on fit (or recommend):
1. **Notion page updated programmatically** (Garry reads Notion daily — this is his known habit) — Notion API integration that accepts webhooks/POSTs and updates sections.
2. **Standalone dashboard page** — lightweight web page (Vercel) with sections fed by a small status API.

**Sections required (exact):**

| Section | Content |
|---|---|
| **Social Status** | X + LinkedIn: logged in? (browser-session heartbeats from Cipher) |
| **Posts** | Queued + published this week (Blotato feed), engagement counts |
| **Waitlist / CRM** | New signups today, emails sent, pending approvals, funnel (approved → logged in → enrolled) |
| **Action Items** | DMs or emails needing Garry's eyes (fed from Cipher/Nova) |
| **Health** | Cron ok? Webhooks live? Tunnels up? Bot profiles running? |
| **Today's Briefing** | Top 3 stories + CertainID spin (from morning research cron) |

**Feeding mechanism:** Build a tiny intake endpoint (POST JSON) that Cipher's VPS pushes to on every significant action — webhook-friendly, HMAC-signed if public. Cipher owns the push side; you own the dashboard + intake.

**Note re CRM:** The existing `app.certainid.io/admin.html` already has per-lead funnel + newsletter + grant-access. The ops dashboard is a *separate, read-only overview* — don't rework the CRM, just reflect key signals.

---

## 🔴 TASK 2 — Verify content signing end-to-end (pre-alpha gate)

**Problem:** Content signing is a core differentiator ("content sign + on-chain verify") but hasn't been verified as a clean user journey since the design-system changes. Garry needs proof it works before David Matthews tries the product.

**Deliverable:** Run the full journey on MVP (Base mainnet) and report exact steps + verification links:
1. Enrol (phone-only) → login
2. Create signed content → confirm the hash/attestation is written on-chain
3. Verify from the scanner/verifier view (a second user or public route)
4. Confirm the explorer shows the attestation (BaseScan link)
5. Edge: what happens when content is tampered after signing → verification fails cleanly?

**Report back:** step-by-step transcript + the live verification URL, or the exact blocker if it doesn't work.

---

## Notes for Garry (not Claude)
- **Notion API token** — if we go the Notion route, Garry needs to create an integration token at notion.so/my-integrations. Cipher will pass it to Claude when available.
- **Content signing** uses the existing gasless enrolment + signed-content tables (per CODE-MAP). No new infrastructure expected.

— cipher · 2026-09-20 · ops-dashboard-and-signing