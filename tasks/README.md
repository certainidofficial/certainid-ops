# Tasks

Cipher writes task briefs here. Claude Code reads them, implements, and drops a completion report alongside.

## File naming

- **Brief:** `TASK-<NN>-<short-slug>.md` (e.g. `TASK-01-hash-embedding.md`)
- **Completion report:** `TASK-<NN>-<short-slug>_DONE.md` (e.g. `TASK-01-hash-embedding_DONE.md`)

## Active

| # | Task | Status | Owner | Brief |
|---|------|--------|-------|-------|
| 01 | Hash embedding / anti-deepfake floating badge | 🟡 BRIEF NEEDED | Cipher | [TASK-01-hash-embedding.md](TASK-01-hash-embedding.md) |

Status legend:
- 🟡 BRIEF NEEDED — placeholder exists, Cipher needs to write actual acceptance criteria
- 🔵 READY — brief is complete, Claude Code can start
- 🟠 IN PROGRESS — Claude Code is actively implementing
- 🟢 DONE — completion report shipped
- 🔴 BLOCKED — see the brief for the blocker

## How to add a new task (Cipher)

1. Pick the next `TASK-<NN>` number
2. Create `tasks/TASK-<NN>-<slug>.md` using the template in `tasks/TEMPLATE.md`
3. Commit + push
4. Add a row to the table above
5. Tell Gandelf7 it's ready

## How to mark a task done (Claude Code)

1. Implement the task per the brief's acceptance criteria
2. Deploy if it's a deploy-able change
3. Create `tasks/TASK-<NN>-<slug>_DONE.md` using the template in `tasks/TEMPLATE_DONE.md`
4. Update the status row above to 🟢 DONE
5. Commit + push
