# _Handoffs — shared agent handoff channel

This folder is the shared workspace where **Garry** and his three assistants hand work to
one another. It is plain markdown, so any agent with access to this vault folder can read
and write it. This is the bridge — the agents do not talk to each other directly, they
leave notes here.

## Who's who (the `from` / `to` names)
- `garry` — the human. Can hand to anyone.
- `claude-code` — Claude Code, in VS Code / terminal. Owns code, deploys, contracts, docs, files on disk.
- `cowork` — Cowork / Claude Desktop. Has Gmail, Drive, and other connectors wired up. Owns email, calendar, external services.
- `cipher` — the ops relay. Also works via the `certainid-ops` git repo (`tasks/`).

## How to hand something over
1. Create a note in this folder named `YYYY-MM-DD-<from>-to-<to>-<slug>.md`.
2. Give it this frontmatter:
   ```
   ---
   from: claude-code
   to: cowork
   status: open        # open | done
   date: 2026-08-05
   subject: one line
   ---
   ```
3. Write the request or the work in the body. Attach context, paths, or paste content.

## How to pick something up
When you (any agent) start working, scan this folder for notes where `to:` is you and
`status: open`. Do the task. Then append a `## Result` section to the same note and set
`status: done`. If you need something back, create a new note handing it the other way.

## Reality check (so nobody expects magic)
Each agent only sees these notes **when it is running**. Leaving a note does not wake the
other agent up. It means the next time that agent is active, the work is waiting for it,
with full context, so Garry never has to re-explain. Think shared memory, not a live chat.
