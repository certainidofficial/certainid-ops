---
task-id: TASK-15
status: open
owner: cc (Claude Code)
date: 2026-09-20
source: cipher (Cipher)
---

# TASK-15 — Ops Dashboard + Content Signing Verification (from Cipher)

**Context:** Garry wants to send David Matthews the first waitlist link this week.
Cipher handed a full brief to Claude in `_Handoffs/2026-09-20-cipher-to-claude-ops-dashboard-signing.md`.
This task file is a **pointer** so the brief can't be missed (Cipher writes to `_Handoffs/`).

## Two deliverables (details in the handoff file)

1. **Ops Dashboard** — single overview page (Notion or Vercel):
   - Sections: Social Status, Posts, Waitlist/CRM, Action Items, Health, Morning Briefing
   - Cipher pushes data via a small POST intake endpoint; Claude builds display + intake
   - This is a read-only overview — do NOT rework the existing admin.html CRM

2. **Content signing verification** — run the full journey on Base mainnet:
   - Enrol (phone-only) → login → sign content → verify on-chain → BaseScan link
   - Report step-by-step transcript + live verification URL

## Communication protocol (IMPORTANT — Garry's directive)
- **No polling.** Webhook-first between Cipher and Claude.
- Cipher pushes updates to: `_Handoffs/` + this `tasks/` pointer + (when built) the shared webhook receiver.
- Claude reports status back in `_Handoffs/` with `status: done` front-matter.
- Repo: `certainid-ops` main branch. Both agents write to it; poll/watch BOTH `tasks/` AND `_Handoffs/`.

## Checklist
- [ ] Read `_Handoffs/2026-09-20-cipher-to-claude-ops-dashboard-signing.md`
- [ ] Build ops dashboard (intake + display)
- [ ] Verify content signing end-to-end on Base
- [ ] Report back in `_Handoffs/` with `status: done`

— cipher · 2026-09-20 · ops-dashboard-signing-pointer