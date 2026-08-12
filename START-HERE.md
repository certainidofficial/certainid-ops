# START HERE — Shared Agent Memory (read this first)

This vault is the **shared second brain** for Garry's assistants. It is how you pick up
where another assistant left off. Plain markdown, so any assistant with access to this
folder can read and write it. There is no live link between assistants — this vault IS the
link.

## The three rules (every assistant follows these)

1. **READ FIRST.** At the very start of a session, before you answer Garry, read:
   - this file,
   - the latest entries in `_Journal/JOURNAL.md` (newest is at the top),
   - any `status: open` notes in `_Handoffs/`.
   Pick up the context, then continue the conversation as if you already knew it.

2. **JOURNAL LAST.** At the end of a session, or whenever you finish a real chunk of work,
   append a short entry to the **top** of `_Journal/JOURNAL.md`: what you did, any decisions
   made, and what's next. Keep it factual and brief.

3. **SIGN ALWAYS.** End every journal entry and every handoff with a signature line, so
   Garry has traceability of who said what:
   ```
   — <agent-id> · <YYYY-MM-DD> · <one-word topic>
   ```
   Example: `— claude-code · 2026-08-05 · whitepaper`

## Who's who (agent-ids)
- `garry` — the human. The boss. Can write anywhere.
- `claude-code` — Claude Code in VS Code / terminal. Owns code, deploys, smart contracts, docs, local files.
- `cowork` — Cowork / Claude Desktop. Has Gmail, Drive, calendar, external connectors. Owns email + external services.
- `cipher` — the ops relay (also called **Sarta**). Also works via the `certainid-ops` git repo (`tasks/`).
- `chat` — the CertainID chatbot.
- (add more as they join — just pick a lowercase id and sign with it.)

## Where things live
- `_Journal/JOURNAL.md` — the shared session log. The running story. Read it first, add to it last.
- `_Handoffs/` — task handoffs. If you need a tool you don't have (e.g. Gmail), leave a
  note here addressed to the assistant that does, and set `status: open`.
- `SecondBrain/`, `Dev/`, `Marketing/`, `Research/`, `Resources/` — Garry's knowledge base.

## The vault IS the database (no graph DB needed)
This vault, with note properties, is the queryable memory — so we skip Neo4j / Graphiti.
- **You** query it in Obsidian via **Bases / Dataview** on the frontmatter (e.g. all handoffs where `status: open`, all dev notes where `type: code-map`).
- **An assistant** queries the same structure by grepping the frontmatter and reading only the matching note — that is the token saving: read one relevant note, not the whole codebase or the whole journal.
- Convention: give notes frontmatter with `type:` and `tags:` so both query methods work. Handoffs already carry `from/to/status`. Journal entries carry a `tags:` line.
- **Orientation before code:** read `Dev/CODE-MAP.md` (key files, contract addresses, chain facts) instead of exploring the repo tree.

## Reality check (so nobody promises magic)
You only read this vault **when you are running**. Writing here does not wake another
assistant. It means the next time that assistant is active, the context is waiting for it,
with your signature on it. Shared memory, not a live group chat.

---

## Prompt to onboard another assistant
Paste this to any new assistant (Cipher/Sarta, Cowork, Chat, etc.) to make it part of the brain:

> You share an Obsidian vault at `~/Documents/CertainID-Vault/` as a common memory with
> Garry's other assistants. Your name here is **`<pick your agent-id>`**.
> BEFORE you answer me at the start of any session, read `START-HERE.md` at the vault root,
> then the latest entries in `_Journal/JOURNAL.md`, then any `status: open` notes in
> `_Handoffs/`, and pick up the context. AT THE END of our session (or when we finish a
> chunk of work), append a short entry to the TOP of `_Journal/JOURNAL.md` covering what we
> did, decisions made, and what's next. SIGN every entry with `— <your-id> · <date> ·
> <topic>` so Garry knows who wrote it. If a task needs a tool you don't have, leave a note
> in `_Handoffs/` addressed to the assistant that has it. Keep everything short and factual.
> Confirm you can read the vault, then tell me the latest journal entry so I know it worked.

## Where this lives (cross-machine) — READ THIS
The assistants are on different machines, so a local folder is NOT shared. This brain lives
in the **certainid-ops git repo** (the one Cipher already has on the VPS). Git is the shared substrate.
- **Cipher** = VPS → its local `certainid-ops` clone.
- **Claude Code** = Mac 2 → its local `certainid-ops` clone.
- **Obsidian** = on the Macs → open the local `certainid-ops` clone as a vault (or use the Obsidian Git plugin to auto-sync).
ALWAYS `git pull` before reading and `git add -A && git commit && git push` after writing, so everyone sees the same state.
