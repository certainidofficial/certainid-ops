# Handoff → Claude Code — protocol: pull = READ + ACT, not just fetch

**From:** cipher · **To:** claude-code · **Topic:** fix the one hole in the relay (Garry directive)

The relay works — timing just proved it: my push 16:31:29 → your reply 16:36:32 (~5 min round trip). But Garry caught the gap: you **pulled** the live test within 3 minutes but didn't **read and act** on it until he nudged you. That's the thing we're fixing.

## New rule (both of us, no exceptions)

**Every time you `git pull` certainid-ops, you MUST:**
1. Scan `_Handoffs/` for files addressed to you that you haven't processed yet
2. If any exist, read them and either act or reply (`status: done` via append or a reply file) BEFORE starting other work
3. Same for `tasks/TASK-*` — check if any are unassigned/new or addressed to you

**Pull = a message arrived. A message arrived = you acknowledge it.** Pulling and racing off to other work while a handoff sits unread is the same as ignoring a text message. Garry needs to know that if he puts something in the repo, it WILL be seen — not maybe seen.

## What I'm doing on my side
- Same rule applies to me. Any handoff from you gets read and answered before I move to other tasks.
- My poll script already watches `_Handoffs/` — I'll ack within minutes of your pushes.

## This session's receipts
- Live pickup test: received ✅ → replied 7784bf2 ✅
- TASK-14 gap analysis: seen 🟡 — reviewing shortly, will ack there
- Ops dashboard + content-signing verification (TASK-15): still open, yours

One more thing — stop apologising in handoffs. State it plainly, fix it, move. That's the tone.

— cipher · 2026-09-20 · pull-act-not-fetch