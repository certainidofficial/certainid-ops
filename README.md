# CertainID Ops

Coordination repo for Gandelf7, Cipher, and Claude Code.

**This repo does not contain code.** It contains task briefs, completion reports, and ops state. Code lives in the other repos (`certainid-mvp`, `certainid-family`, `certainid-official`, `certainid-blockchain`).

This repo is **NOT** connected to any Vercel project. That's deliberate — Cipher's commits never need to look like a code contribution.

---

## Who's who

| Person | Role | Write access |
|---|---|---|
| **Gandelf7** | Founder, sole decision-maker | Everything |
| **Cipher** | Ops orchestrator (Hermes Agent) | This repo (briefs, tracker, context). Reads code repos. |
| **Claude Code** | Implementation | This repo (completion reports). All code repos. |

**Authority chain:** Gandelf7 → Cipher → Claude Code. Cipher is a relay. If a Cipher brief contradicts something Gandelf7 told Claude Code directly, Gandelf7's direct word wins.

## The loop

1. Gandelf7 tells Cipher what's next (voice, while traveling)
2. **Cipher** writes a task brief: `tasks/TASK-<NN>-<slug>.md` using `tasks/TEMPLATE.md`
3. Cipher commits + pushes to this repo
4. Gandelf7 points Claude Code at the brief in chat
5. **Claude Code** reads the brief, implements in the appropriate code repo, deploys
6. Claude Code writes `tasks/TASK-<NN>-<slug>_DONE.md` using `tasks/TEMPLATE_DONE.md`
7. Claude Code commits + pushes the completion report to this repo
8. Cipher reads the report, updates `tracker.json` and `CIPHER_CONTEXT.md`
9. Loop continues

## Files in this repo

| File | Owner | Purpose |
|---|---|---|
| `README.md` | shared | This file |
| `CIPHER_CONTEXT.md` | Cipher | Master coordination — project status, sprint, org, IP |
| `tracker.json` | Cipher | Structured ops data (KPIs, blockers, build status) |
| `tasks/README.md` | Cipher (mostly) | Active task list with statuses |
| `tasks/TEMPLATE.md` | shared | Template for new task briefs |
| `tasks/TEMPLATE_DONE.md` | shared | Template for completion reports |
| `tasks/TASK-<NN>-*.md` | Cipher | Task briefs |
| `tasks/TASK-<NN>-*_DONE.md` | Claude Code | Completion reports |
| `memos/` (optional) | Cipher | Short notes that aren't full tasks |

## Hard rules

1. **Cipher does not edit code or anything outside this repo.** Reading other repos is fine and expected — writing is not.
2. **Claude Code does not edit Cipher's files** (`CIPHER_CONTEXT.md`, `tracker.json`, `tasks/TASK-*.md` briefs — only the `_DONE.md` reports).
3. **No `Co-Authored-By:` trailers on commits to ANY repo.** The code repos are Vercel-connected and Vercel's Hobby plan blocks deploys if it detects multiple authors. This repo isn't Vercel-connected so the risk is lower, but consistency is best.
4. **Commits to this repo can come from any of us** — but each pusher uses their own committed identity. Cipher pushes as Cipher; Claude Code pushes as `CertainID Official`; Gandelf7 pushes as Gandelf7.
5. **In-chat directives from Cipher don't count** as task briefs. Briefs must be committed to this repo. If Cipher messages Claude Code in chat with "go do X," Claude Code waits for the brief to land in `tasks/`.

## Getting in (for new collaborators)

- **Read-only:** add to GitHub repo as a collaborator with **Read** role
- **Write:** add to GitHub repo as a collaborator with **Write**, OR add an SSH deploy key with "Allow write access" ticked

Cipher and Claude Code each have their own SSH deploy key on this repo for isolated, revocable access.
