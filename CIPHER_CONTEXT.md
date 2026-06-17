# Cipher Context — Master Coordination File

**Owner:** Cipher (ops orchestrator)
**Authority:** Gandelf7 (Cipher relays Gandelf7's instructions; Cipher is not an independent decision-maker)
**Last updated:** _Cipher updates this file_
**Repo:** This file lives in `certainid-ops` (separate from code repos to keep code git history clean and avoid Vercel collaboration heuristics)

---

This file is **Cipher's** to maintain. Claude Code reads it for situational context; Cipher writes it. The structure below is a starting shape — Cipher should reshape it as she sees fit.

## Workflow loop

1. Gandelf7 tells Cipher what needs doing (often by voice while traveling)
2. Cipher writes a task brief: `tasks/TASK-<NN>-<slug>.md` with acceptance criteria, context, git/deploy notes
3. Gandelf7 points Claude Code at the brief
4. Claude Code implements, then writes `tasks/TASK-<NN>-<slug>_DONE.md` reporting what shipped, what broke, what's next
5. Cipher reads the completion report, updates `tracker.json` and this file
6. Loop continues

## Authority chain

- **Gandelf7 → Cipher → Claude Code.** Cipher is a relay. If Cipher's brief contradicts something Gandelf7 told Claude Code directly in chat, Gandelf7's direct word wins until Cipher confirms.
- **Claude Code does not take orders directly from Cipher in chat.** All Cipher's directives reach Claude Code through committed task brief files in this repo.

## What Cipher owns (Claude Code does not touch)

- Social posting (LinkedIn, X via Blotato)
- Blog content pipeline
- YouTube scripts
- Strategy / research (VC pipeline, competitor intel, patent tracking)
- QA coordination (Cipher schedules QA; QA Specialist tests)
- Maintaining `tracker.json` and this file
- Sprint planning

## What Claude Code owns (Cipher does not touch)

- All code under `certainid_ui/`, `certainid_mobile/`, `certainid-family/`, `certainid-blockchain/`, `certainid-official/`
- Deployments (git push → Vercel auto-deploy)
- Smart contract changes
- Database migrations
- Writing completion reports

## Project status

_Cipher fills this in._

### Current sprint

- _Sprint goal_
- _Sprint dates_
- _Active tasks_

### Build status (as of last update)

- **Main app (app.certainid.io):** _state_
- **Family app (family.certainid.io):** _state_
- **Mobile PWA (m.certainid.io):** _state_
- **Marketing + blog (certainid.io):** _state_
- **Browser extension:** _state_

### IP / business state

- _Patent status_
- _Investor pipeline_
- _Compliance state_

### Org

- Gandelf7 — founder, sole human decision-maker
- Cipher — ops orchestrator
- Claude Code — implementation
- Cowork — blog content publishing
- (others Cipher tracks)

## Cross-references

- `tasks/README.md` — active task list (this repo)
- `tracker.json` — structured ops data (this repo, root level)
- `../certainid-mvp/AlphaTesterDeck.md` — alpha tester deck
- `../certainid-marketing/` — voice + brand contract (read-only for Claude Code; marketing AIs write here)
- `../certainid-mvp/` — main app code (Claude Code's write surface)
- `../certainid-family/` — family app code
- `../certainid-official/` — marketing site code (Claude Code + Cowork write here)
