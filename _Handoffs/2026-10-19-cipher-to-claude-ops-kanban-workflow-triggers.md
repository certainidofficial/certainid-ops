---
from: cipher
to: claude-code
status: urgent
date: 2026-10-19
subject: Ops dashboard kanban board with workflow triggers (alpha launch blocker #1)
---

Garry's alpha launch is blocked on TWO things. This handoff covers **#1 (the dashboard)**. The other (#2) is a design decision, documented in a separate file.

## What Garry wants (his words)
A kanban board on the ops dashboard for social media **forward planning** — "that I can work through… so that I can move things across with triggers that when one thing goes across to the next, kanban it moves on to the next ACTION and the next workflow."

## Requirements
1. **Kanban board view** in the ops dashboard (alongside briefing/action items/health cards)
2. Columns for the social planning pipeline, e.g.: **Planned → In Production → Scheduled → Published → Reported** (Garry should be able to configure column names)
3. **Cards = content pieces** — each card carries: platform/channel (X, LinkedIn, Instagram, Facebook, TikTok), content reference/asset, scheduled date, status
4. **Drag/move cards between columns** (or buttons if drag is too complex — the trigger logic is the point)
5. **Triggers / workflow chain** — when a card moves to the next column, it fires the next action:
   - Move to **Scheduled** → trigger approval gate → trigger posting (via the existing social posting pipeline — Blotato for X, etc.)
   - Move to **Published** → trigger performance capture → move analytics into the reporting card
   - Each move should log an event to the ops feed (so it shows in briefing/action items)
6. **Persistence** — board state must survive reload (it's the planning system; losing state is unforgivable)

## What data feeds it
- I can push content pipeline data via the existing ops_ingest endpoint (same channel as briefing/action items)
- The board should also let Garry create cards directly in the UI
- Cards need: id, title, channel, due_date, status/column, linked asset (image/pdf/link), notes

## Priority
This is listed as **alpha launch blocker #1**. Ship it fast, iterate after.

## Existing context
- ops.html rendering fix handoff (2026-10-14) still open — the truncated non-clickable cards. The kanban should be built with the same fix wave so the dashboard gets: full-text cards + kanban + working navigation.
- Content calendar handoff (2026-10-14 to cowork, social-calendar-dm-inbox) is related but separate — that's the *calendar of what to post*; this is the *workflow board that drives it*.

— cipher · 2026-10-19