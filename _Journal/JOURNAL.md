# Shared Session Journal

Newest entry at the top. Every assistant appends here at the end of a session and signs.
Read [[START-HERE]] first.

---

## 2026-08-12 — Cowork onboarded to vault; Michael-email handoff closed (already sent, not drafted)

- Cowork (me) is now wired into the shared vault: read `START-HERE.md`, journal, and `_Handoffs/` at session start; will journal + sign at session end going forward, per Garry's instruction.
- Actioned the open handoff `2026-08-05-claude-code-to-cowork-email-michael.md`. Before drafting, checked Gmail — found the white paper email to Michael (michael@kadoury.com) was **already sent** same-day (2026-08-05, thread `19fd09003fd9d730`), attachment included, signed "Garry." So the ask was already fulfilled through a different path than the handoff described (direct send, not a draft). Did not create a duplicate draft. Set `status: done`, appended `## Result`.
- Nothing else open in `_Handoffs/` right now (only the one note existed).

— cowork · 2026-08-12 · vault-onboarding+email-michael

---

## 2026-08-12 — Waitlist join was failing (stale Vercel Supabase env); fixed + verified end-to-end

- Garry got "Failed to join waitlist" (garry@keyview.com.au). **Root cause:** the serverless `/api/waitlist` reads Supabase creds from Vercel RUNTIME env, and those were **85 days stale** (old project/key). The client works because it bakes the CURRENT creds from local `.env.production.local` at build; serverless functions don't. So client Supabase = current, API Supabase = stale → insert 500.
- **Fix:** synced Vercel `VITE_SUPABASE_URL/ANON_KEY` + `SUPABASE_URL/ANON_KEY` to the current project (`odszybuhotefjnafdbob`), redeployed. Also fixes any other serverless fn that reads Supabase at runtime.
- **Verified END TO END:** POST fresh email → "on the list" (insert ok); re-POST same email → "already on the list" (unique constraint fired = row truly persisted); garry@keyview.com.au → now on the list.
- **Process note (Garry, fair hit):** "test end to end" means actually submit data and confirm it lands in the DB, not just review code. My content/scan review + checklist didn't include the waitlist path — that's how it slipped. Banked as [[feedback_verify_end_to_end]].

— claude-code · 2026-08-12 · waitlist-fix

---

## 2026-08-07 (later) — Pre-alpha review: fixed scanner to verify on-chain

- Garry considered a cleanup refactor + switching model to Fable 5 before final testing. Advised against refactor-before-test (churn risk near the demo) and against paying more for a model just to re-read working code. Did a focused review of the demo-critical flows instead.
- **Real bug found + fixed:** the in-app **Scanner (ScanTab)** was trusting **Supabase** for authentic/revoked, which undermines the "verified on-chain, no central authority" pitch (a VC's engineers would catch it). Fixed: Supabase is now only the discovery index (which contract signed it); the **blockchain is the source of truth** (calls `verifyContent` on-chain), with a Supabase fallback only if RPC is unreachable. Deployed.
- Reviewed and cleared: content signing (ContentTab surfaces errors, useContentSigning uses the gasless smart account), the /verify page (already on-chain), the re-login fix.
- Wrote `Dev/ALPHA-TEST-CHECKLIST.md` (5 phone tests: enrol, re-login holds contract, sign, scan-authentic, tamper-detect). Garry to run it.
- Minor known edge (not fixed, flagged): revoke has a Supabase-only fallback if the chain write fails → dashboard could show revoked while chain/scan shows authentic. Not in core demo path.

— claude-code · 2026-08-07 · pre-alpha-review

---

## 2026-08-07 — Mobile phone-only confirmed (code); vault set up as the queryable database

- **Mobile:** phone-only enrolment CONFIRMED WORKING end to end on Garry's phone (email sign-in → inline Face ID → gasless registration → dashboard, no computer). Uses `app.certainid.io`, not m.certainid.io.
- **Bug found + fixed same session:** on re-login the app was re-enrolling and creating a NEW contract every time. Cause: the "already enrolled?" pre-check compared the identity contract's `owner()` against the EOA, but the contract is owned by the user's SMART ACCOUNT (Ownable2Step) — so it always thought the saved contract was stale, wiped localStorage, and re-enrolled. Fixed: compare owner against the derived smart-account address (accept EOA for legacy too), and stop clearing localStorage on transient RPC errors. Deployed. Existing duplicate contracts from the repeated re-enrol are orphaned/harmless; going forward it holds the saved contract.
- **Memory / token decision:** NOT standing up Graphiti/Neo4j (too much infra + an LLM call per write, and it's episodic-fact memory, not a codebase tool). Instead the **Obsidian vault + note frontmatter IS the database** — Garry queries via Bases/Dataview, assistants query via grep. Added `Dev/CODE-MAP.md` (read for orientation instead of exploring the repo tree) and a retrieval/tags convention in `START-HERE.md`.
- **Still open:** Garry to phone-test enrolment; Cowork email handoff still `open`; Polygon→Base doc scrub still pending; Cipher daemon still not installed.

— claude-code · 2026-08-07 · mobile+vault-db

---

## 2026-08-05 — CertainID state, whitepaper, JV doc, agent memory set up

**Where things stand right now:**

- **White paper for Prof. Jian Yang** (Macquarie Uni; trust / data / misinformation / content-authenticity researcher — a lady, NOT the male NJUST face-recognition Jian Yang). Built as a letterheaded `.docx`, tailored to her field, with the patent-portfolio mapping and 7 review questions. Files: `~/Desktop/CertainID_WhitePaper_Verification_Brief.docx` and `certainid-mvp/docs/`. Purpose: Michael (IP lawyer) presents it to her for independent verification that the tech is sound and the patents reinforce it.
- **Email to Michael** is written and handed to **cowork** in `_Handoffs/` (Claude Code has no Gmail; Cowork does). Cowork to create the Gmail draft; Garry attaches + sends.
- **JV agreement** located in `~/Downloads/`: `CertainID_JV_Agreement_Branded.gdoc` (Google Doc) and `DRAFT - CertainID_JV_Agreement_DM Mark Up 14.07.26.docx` (David Matthews mark-up). David Matthews = CEO of Kollakorn (the patent holder). Garry still needs to send this.
- **Product state:** real attested verification is LIVE on **Base mainnet** and founder-tested via MetaMask. Gasless smart-account enrolment, server-attested social verification, and **content ownership signing** all working. Content-auth model decided: **sign-on-import** (not in-app capture), prove ownership of the published artifact, anti-deepfake by **attribution not detection**, on-chain timestamp priority. Security lives in the content-bound signature + chain, not watermark secrecy.
- **Cipher daemon** (auto-poll `certainid-ops` and work briefs unattended, `autonomy: 1`=ship / `2`=hold) is BUILT; Garry has a one-paste Terminal install command. Not yet installed/tested.

**Open items / what's next:**
- Garry: paste the Cipher daemon install command; then live-test it.
- Polygon → Base **documentation scrub** still pending on current-facing docs (INVESTOR_MVP_SCOPE, AlphaTesterDeck, PRODUCT_BRIEF, MARKETING_CONTEXT, architecture FAQ, `.claude/agents/*`, 30-day content calendar). Code is already on Base.
- Cowork: draft the Michael email (see `_Handoffs/`).
- Test content sign + verify in the live app; restart marketing (say "blockchain", not "Polygon").

— claude-code · 2026-08-05 · session-state
