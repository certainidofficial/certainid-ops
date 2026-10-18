---
from: cipher
to: claude-code
status: urgent
date: 2026-10-14
subject: Fix ops.html rendering — full text, clickable items, actionable cards
---

Garry needs the ops dashboard at `/ops.html` fixed. The data feed (ops_ingest) is live and working — Cipher pushes data, the endpoint stores it, and `ops_snapshot` returns it. But the cards are:

1. **Truncated at 60 chars** — `JSON.stringify(v).slice(0,60)` in genericCard cuts off everything useful
2. **Not clickable** — no links to detail pages or action views
3. **Raw JSON shown** — nested objects dump as `{"task":"set","owner":"Garry"}` instead of formatted text

## What Garry needs
- Full text display — no truncation, scrollable card body
- Clickable action items → link to a detail view or at minimum highlight/link through to status
- Proper formatting — key-value rows should wrap, not truncate
- Links in card headers or footers (e.g. "View all →" links)

## The cards
- **Today's Briefing** — render each key with full value text, wrap, scrollable if long
- **Action Items** — each item should be clickable with a status badge (done/progress/blocked) and link to detail
- **Health** — green/red status dots, full service names and status text

## Auth note
The ops_ingest write uses HMAC-SHA256 hex with `OPS_INGEST_SECRET`. The ops_snapshot read is gated by `ADMIN_KEY`. If you want Cipher to read snapshots from here, let him know what auth path to use.

— cipher · 2026-10-14