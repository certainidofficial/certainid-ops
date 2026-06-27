# TASK-07 — Fix CertainID Chat Assistant n8n Workflow — CLARIFY

**Date:** 2026-06-28
**By:** Claude Code

## Blockers requiring clarification

### 1. I cannot access the n8n instance or the workflow files

The brief states:

> "The workflow JSON export is at `certainid-chat-workflow.json` in the CertainID Google Drive"
> "downloaded to `/tmp/certainid-chat-workflow.json` on VPS"

The files do not exist on this machine (`/tmp/certainid-chat-workflow.json` and `/tmp/certainid_knowledge_base.md` are both missing). I run on the local dev machine, not the VPS.

**Question:** Can Cipher or Gandelf7 copy the workflow JSON and knowledge base file to a path I can access? For example:
- `/Users/certainid/Documents/App_dev/CertainID/certainid-ops/tasks/certainid-chat-workflow.json`
- `/Users/certainid/Documents/App_dev/CertainID/certainid-ops/tasks/certainid_knowledge_base.md`

**If I had the files:** I could redesign the workflow JSON with the fixes (scoped Drive search, conversation memory, proper system prompt structure) and produce an updated JSON for import.

### 2. I cannot deploy to n8n

The brief states:

> "Deploy: Import the updated workflow JSON into the n8n instance on Mac 3"
> "n8n instance on Mac 3 (ask Gandelf7 for access or get him to import the updated workflow)"

I have no network access to Mac 3's n8n instance. Deploying requires either API access to n8n or manual import by Gandelf7.

**Question:** Should I:
- **(A)** Produce the corrected workflow JSON file and leave it for Gandelf7 to import manually into n8n on Mac 3?
- **(B)** Be given n8n API credentials (URL + API key) so I can deploy via the n8n REST API?

**If A:** I can do everything except the final import and live testing. Gandelf7 would need to import and verify.
**If B:** I would need the n8n base URL and an API key added to an accessible location.

### 3. I cannot test the live workflow

The brief states:

> "Test the workflow — verify at least 3 conversational turns in sequence produce coherent, contextual responses"

Without access to the n8n instance or the live chatbot endpoint, I cannot perform this acceptance criterion.

**Question:** Should I skip live testing and leave it to Gandelf7 after import, or is there a webhook URL I can hit directly?

### 4. Brief says "No code repo changes needed" — confirm scope

The brief states:

> "No code repo changes needed (this is n8n, not code)"

**Question:** Confirmed — I should NOT touch any code in certainid-mvp, certainid-official, or any other repo? The entire deliverable is a corrected n8n workflow JSON file?

## Summary

I need at minimum:
1. The current workflow JSON file placed on a path I can read
2. Confirmation on how deployment happens (me via API, or Gandelf7 manual import)
3. Clarification on who tests the live workflow

Once those are answered, I can proceed.
