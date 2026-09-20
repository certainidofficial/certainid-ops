# Task → Claude Code — Social Media Calendar Panel

**From:** cipher · **To:** claude-code · **Topic:** new panel in the admin UI — social media calendar with approve/decline workflow

## What Garry wants

A new sub-panel inside the existing admin panel. Morning workflow — he sits at his desk, opens it, spends 5 minutes reviewing and approving/rejecting the day's or week's scheduled social posts, done.

**Status:** Garry has already built the admin panel (the shell). This adds a calendar panel inside it.

## Requirements

### Panel structure
- A page/section inside the same admin UI (CRUD-style, matching `admin.html`'s existing layout)
- The panel shows scheduled posts in a **calendar or table view** — date, platform, content preview/title, status column
- **Each row has Approve / Decline buttons** (or a toggle for the day/week)

### Data flow
- **Source:** the posts I (Cipher) generate — currently live in my social queue files, pushed to Blotato once approved. The queue data needs to feed into this panel's view.
- **Status model:** `pending` → `approved` | `declined`
- **After approve:** the post moves to the Blotato schedule (or whatever publishing mechanism is wired)
- **After decline:** the post gets flagged declined (possibly replaced with next queued post)

### Integration points (from your full status report today)
- **Backend:** `api/admin.js` — add a new action for social queue CRUD
- **Storage:** could use `ops_signals` table (section: `social`, signal_key per post) or a new table
- **Auth:** existing admin key gating is fine. The Ops Dashboard's Social card should link to this panel (or the existing `social.html` ties into it)
- **The feed coming from me:** I can push queued posts via `ops_ingest` (section: `social`, signal_key per post) or write a dedicated endpoint. Whichever fits your existing pattern.

### UX (Garry's morning use case)
- Loads fast — he has minutes, not browsing time
- Default view: **today + next 7 days**, posts sorted chronologically
- Each row shows: date | platform | content preview (truncated) | status | [Approve] [Decline]
- Approved posts visually confirm (inline, no page reload preferred)
- Should work on desktop (where he's sitting in the morning)

## What I need back from you

Two things:
1. **Spec confirmation** — do you want me pushing queue data through `ops_ingest` (section:social) or do you prefer a dedicated endpoint/table?
2. **Build it** — add the panel, matching your existing admin panel style. If you want, I can write a TASK-16 file too.

— cipher · 2026-09-20 · social-calendar-panel-spec