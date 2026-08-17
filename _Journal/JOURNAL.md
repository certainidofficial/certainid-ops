# Shared Session Journal

Newest entry at the top. Every assistant appends here at the end of a session and signs.
Read [[START-HERE]] first.

---

## 2026-08-18 — Homepage hero redesigned + approved; design system locked for rollout

- New brand direction **approved**: light teal/blue, glassmorphic, real depth (glows, layered navy drop shadows, boxless floating logo, protective aura). Replaces the old dark `#06080f` + indigo/emerald. Iterated hard (3 wrong flat mockups → elevated Garry's actual hero → lightened bg for phone/sunlight legibility → boxless bigger logo → flex-centered + balanced chips).
- **Locked** as `Dev/DESIGN-SYSTEM.md` (tokens) + `Dev/reference-hero.html` (the approved reference). Garry installed the `frontend-design` skill.
- **Next (post-restart):** roll the system across the **marketing site** (dark→light, all sections/blog) then the **app** screens (Login → Enrol → Dashboard → Content/Scan/Verify) — presentation only, keep logic, re-verify enrol/content/verify after each screen. NOT started; Garry restarting for updates, fresh session executes it with the design system as guide.
- **Webhooks me↔Cipher** (real-time trigger on inbound) = this-afternoon topic. Honest: Claude Code doesn't run 24/7, so "a webhook triggers me" needs a receiver on the VPS (Cipher's box) that catches the event and spins up a headless Claude Code run — same shape as the [[project_cipher_daemon]] daemon.

— claude-code · 2026-08-18 · design-system+rollout

---

## 2026-08-13 — Consolidated Supabase onto MVP (one production), verified green

- Root problem found: **TWO Supabase projects, crossed.** The live app used "CertainID Official" (`odszybuhotefjnafdbob`); Garry's schema + RLS work was all in "MVP" (`rapjczkdnnkhgrebrron`). So his edits never reached the running app — explains the old RLS-fix frustration and the waitlist confusion.
- Decision (Garry): standardize on **MVP** (his full 13-table maintained schema; admin/service_role available). Keep CertainID Official as a **cold backup** (redundancy, not live-crossed).
- Executed: repointed client `.env.production.local` + all 5 Vercel Supabase vars → MVP; redeployed. Backup of old env at `.env.production.local.bak.*`.
- **VERIFIED green against MVP (not assumed):** bundle now uses MVP, old ref gone; waitlist signup via live API lands in MVP DB (read back with admin key); full enrolment session round-trip works with anon key (create → poll → phone update → desktop read → delete); RLS probe OK on all app write tables (only `beta_access` blocks anon insert, which is correct, and the gate is permissive anyway — "any authenticated user approved").
- garry@keyview.com.au is NOT in MVP's waitlist → Garry gets his clean signup test. His old row stays orphaned in the retired CertainID Official.
- **Open:** Garry to run a real phone enrolment on MVP as the final confirm. Welcome-email/CRM still to build (transactional email + verified domain). CertainID Official = cold backup, can delete later.

— claude-code · 2026-08-13 · supabase-consolidation

---

## 2026-08-13 — Shared brain moved into git (certainid-ops) for cross-machine sync

- Topology realized: **Cipher = VPS**, **Claude Code = Mac 2**, **original Obsidian vault = Mac 1**. A local Mac folder can't be seen by the VPS or the other Mac, so the local-vault approach could never reach Cipher. **Git is the only shared substrate.**
- Fix: copied `START-HERE.md` + `_Handoffs/` + `_Journal/` + `Dev/` into the **certainid-ops git repo** (which Cipher already has on the VPS) and pushed. Rule: `git pull` before reading, `git add -A && git commit && git push` after writing.
- Seam still open (afternoon task): the Mac-local `CertainID-Vault` (where Cowork + Garry's Obsidian write) is still a SEPARATE store from the git repo; hand-synced for now. Proper fix = make the Mac vault git-backed (Obsidian Git plugin auto pull/push to the same repo) so all four read/write ONE git store, no manual sync.

— claude-code · 2026-08-13 · cross-machine-brain

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

## 2026-08-13 — Waitlist pipeline planned; Brevo chosen for newsletters

- Waitlist currently collects emails in Supabase only — no welcome email, no newsletter.
- Decided on Brevo (Sendinblue) as the newsletter platform. Listmonk needs PostgreSQL (no sudo on VPS). Mautic admin panel locked.
- Claude Code gets TASK-11: modify certainid_ui/api/waitlist.js to POST new signups to Brevo API.
- Cipher to set up Brevo account, create welcome email template, provide API key.
- CSIRO Kick-Start grant application drafted in Google Drive Grants folder.
- X Week 1 social posts live/scheduled. LinkedIn Blotato connection expired.
- Vault access established via ZeroTier SSH to Mac 2 (garrys-imac-2).

— cipher · 2026-08-13 · waitlist-pipeline
\nEOF
## 2026-08-13 — Brand direction created; moved away from generic navy/indigo

- Audited current brand: dark navy (#06080f), indigo accent, emerald secondary — Garry flagged as "AI slop" and he's right
- Created Brand Direction with new palette: warm charcoal + signature gold (#A0926B) + Instrument Serif + Instrument Sans
- Gold is distinctive in the identity/security space — signals premium trust, sovereign quality
- Brand voice principles defined: warm, authoritative, clear, sovereign
- Created brand direction doc + HTML visual reference in Drive (Brand folder)
- Full brand guidelines with colors, typography, voice, imagery direction, words to use/avoid
- Next: lock palette, create sigil mark, build Figma, apply to website

— cipher · 2026-08-13 · brand-direction
\nEOF
## 2026-08-13 — Brand palette LOCKED: Deep Slate + Amber (Option C)

- Garry reviewed 6 palette options side by side in a visual HTML mockup
- Chose Option C: Deep slate (#0F111A) background + amber (#F59E0B) accent
- Rationale: technical, precise, warm — sits in Stripe/Plaid territory
- Brand guidelines v1 written and saved to Drive Brand folder
- Next: sigil mark, Figma design system, website redesign, social templates
- Also: TASK-11 pushed to git (waitlist pipeline), Brevo chosen for newsletters, Listmonk abandoned

— cipher · 2026-08-13 · brand-locked
\nEOF