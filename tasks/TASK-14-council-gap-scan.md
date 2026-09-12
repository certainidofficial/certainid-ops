# TASK-14 — Council Review: Fresh Gap Analysis + Scan Tool Completion

## Brief

Two things Claude Code needs to do:

### 1. Fresh Council Gap Analysis

The June 2026 Council Review (P0-P5) was completed — all those issues are closed. But Garry reports things are still not following through. Do a fresh end-to-end gap analysis:

- **Walk every flow** in the current deployed app (app.certainid.io):
  - Login (Privy embedded wallet)
  - Enrolment (phone-based, gasless on Base mainnet)
  - Dashboard
  - Content signing
  - Content scanning/verifying
  - Verify URL (share → friend clicks → sees verified status)
- **For each flow**, identify: is it working? What's broken? What's missing?
- **Check the scan tool specifically** — Garry says it's unfinished. What's missing?
- **Check the council skill** — TASK-13 suggested a `/council` skill for cross-agent reference. Does this exist? If not, is it needed?
- **Report format:** Markdown with:
  - P0 (blocking) / P1 (critical) / P2 (important) / P3 (nice-to-have)
  - File paths, line numbers, current behaviour vs expected
  - Suggested fix

### 2. Scan Tool — Complete It

The scanner/verifier is a core feature that:
- Users upload a file (image, content) to verify it's CertainID-signed
- The app scans it against the blockchain to confirm authenticity
- The verifier link a user posts to social media should auto-detect when someone clicks it

**Known gaps from earlier references:**
- "Built-in scanner/verifier that scans any content/person to auto-detect CertainID status — that's a future task (Garry ran into snags trying to build this before)" — TASK-01
- Verify URL requires both `?contract=&hash=` params but the post link only encodes `?hash=` — TASK-03 fix may not be fully deployed
- Test against the alpha test checklist (Dev/ALPHA-TEST-CHECKLIST.md, Test 4)

**Deliverables:**
1. Gap analysis document → `certainid-ops/Dev/COUNCIL_REVIEW_2026-09-12.md`
2. Scan tool fix PR against `certainid-mvp`

**Owner:** cc (Claude Code)
**Priority:** P1
**Depends on:** Claude subscription active