# TASK-07 — Fix CertainID Chat Assistant n8n Workflow

**Owner:** Cipher
**Assigned:** Claude Code
**Status:** 🔵 READY
**Created:** 2026-06-28
**Priority:** P0

## Context

The CertainID concierge chatbot on the website (powered by an n8n workflow on Mac 3) is glitchy. It repeats itself, doesn't maintain conversation flow, and pulls in content from the entire Google Drive instead of just the knowledge base. This is blocking alpha testing — users hit a broken chatbot and bounce.

The current workflow lives at the n8n instance on Mac 3 (where Gandelf7 runs n8n). The workflow JSON export is at `certainid-chat-workflow.json` in the CertainID Google Drive (id: `179dsePm6nSqH8fbAIE6JrK9P7OJeLudA`).

## Goal

Fix the n8n chat workflow so it produces coherent, contextual, non-repetitive responses using only the intended knowledge base content.

## Acceptance criteria

- [ ] **Scope Drive search to the knowledge base folder only** — folder id: `1k9ut9u_DUdmSayARijv6O52I1DmkXNwY` ("Certainid Knowledge base"). Currently searches the ENTIRE Drive with `name contains '.md'` which pulls in irrelevant files.
- [ ] **Only include the primary knowledge base file** — `certainid_voice_assistant_knowledge_base.md` (id: `1kaW1P0x5ssU-Y3G9ECL9QAUBbhM0eH5z`). Drop the `Download Files` step that downloads PDFs/docx as base64 noise.
- [ ] **Add conversation memory** — implement session-based chat history. Each request should include a conversation ID (from the webhook) and pass the last N messages back to Claude so it maintains context.
- [ ] **Use proper system prompt + messages structure** — the system prompt should establish the persona ("You are CertainID's helpful concierge..."), with the knowledge base as system context, and user/assistant messages for conversation history.
- [ ] **Test the workflow** — verify at least 3 conversational turns in sequence produce coherent, contextual responses
- [ ] **Update the workflow on n8n** — not just export the JSON, actually deploy it so the live website picks up the fix

## Out of scope

- Do not redesign the frontend chatbot widget UI
- Do not change the Claude model (keep Claude Sonnet 4)
- Do not change the webhook path
- Do not build a dashboard for chatbot analytics

## Files / surfaces likely involved

- n8n instance on Mac 3 (ask Gandelf7 for access or get him to import the updated workflow)
- `certainid-chat-workflow.json` (backup/export — already downloaded to `/tmp/certainid-chat-workflow.json` on the VPS if needed for reference)

## Git / deploy

- **Deploy:** Import the updated workflow JSON into the n8n instance on Mac 3
- **No** code repo changes needed (this is n8n, not code)

## Dependencies

- Access to the n8n instance on Mac 3 (Gandelf7 to grant or import)
- **Warning:** Anthropic API key may be stored in n8n credentials. Do not expose or regenerate unless necessary.

## References

- Knowledge base markdown: downloaded to `/tmp/certainid_knowledge_base.md` on VPS
- Workflow JSON: downloaded to `/tmp/certainid-chat-workflow.json` on VPS
- Knowledge base Drive folder id: `1k9ut9u_DUdmSayARijv6O52I1DmkXNwY`
- Primary KB file id: `1kaW1P0x5ssU-Y3G9ECL9QAUBbhM0eH5z`
