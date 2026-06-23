# Alpha Documentation Index — Review Dashboard

**Created:** 2026-06-23
**For:** Gandelf7's review before soft launch
**Maintained by:** Cipher updates status, Gandelf7 reviews

This is the single source of truth for "what alpha-tester-facing documentation exists, how fresh is it, what needs updating before we soft-launch." Click through each doc in your IDE, mark up what's good and what needs work, then dispatch updates as Cipher task briefs.

---

## TL;DR

- **3 alpha-facing documents** exist across the repo set, all written BEFORE the recent 6-task fix sprint
- **1 of them is genuinely stale** (the 40KB FAQ/Architecture doc — April 9, predates Tenderly removal, OAuth migration, RLS hardening)
- **1 is mostly fresh** (AlphaTesterDeck May 23 — needs ~3 specific updates listed below)
- **1 is investor-facing**, not tester-facing (INVESTOR_MVP_SCOPE — separate review path)
- **In-app FAQ page** at app.certainid.io/#/faq is live and visible to testers
- **Council recommendation:** spend ~2 hours updating the deck + writing a short freshness patch on the FAQ doc before soft launch. The full FAQ rewrite is not blocking.

---

## Document inventory

### 1. AlphaTesterDeck.md
- **Path:** `certainid-mvp/AlphaTesterDeck.md`
- **Last modified:** 2026-05-23 (4 weeks ago)
- **Size:** 8 KB, 13 slides
- **Audience:** Hand-picked alpha testers
- **Purpose:** The welcome deck — sets expectations, explains what works, what's rough, how to give feedback
- **Format:** Markdown structured as slide-by-slide content; designed for Claude Cowork to lay out graphically

**Likely stale areas** (compare against current state):
- [ ] **Slide 3 ("Just use email")** — mentions email sign-in only. Should now also mention LinkedIn OAuth works end-to-end + that the other 3 OAuth providers (X, GitHub, YouTube) are infra-ready but awaiting credentials
- [ ] **Slide on social verification** — predates the badge label change. Update from "Claimed" → "Linked" terminology
- [ ] **Slide on what's rough** — should be REWRITTEN with current rough edges (was probably "wallet UX is confusing" — now it's likely "OAuth approval delays for Meta/TikTok mean those 3 platforms stay self-attested")
- [ ] **Anything mentioning Tenderly testnet** — we removed Tenderly entirely. Production is on public Polygon Amoy now.
- [ ] **Anything about "Confirm in MetaMask"** — TASK-04 fixed this for Privy embedded wallet users

**Likely still accurate:**
- [ ] The 3-pillar identity model (biometric / document / digital presence) — unchanged
- [ ] The privacy promise (on-device biometric, only hash on-chain) — unchanged
- [ ] The feedback channel (hello@certainid.io) — unchanged
- [ ] Testnet warnings — still applicable

**Review action:**
- [ ] Read end to end
- [ ] Mark slides needing updates
- [ ] Decide: dispatch a Cipher brief "TASK-NN — update AlphaTesterDeck for post-Sprint-1 state" OR edit it yourself

---

### 2. CERTAINID_FAQ_AND_ARCHITECTURE.md
- **Path:** `certainid-mvp/docs/CERTAINID_FAQ_AND_ARCHITECTURE.md`
- **Last modified:** 2026-04-09 (~10 weeks ago)
- **Size:** 40 KB
- **Audience:** Mixed — partly tester-facing (FAQ), partly internal architecture
- **Purpose:** Deep dive on how CertainID works under the hood, with FAQ at the front

**Why this is the most stale doc in the set:**
This was written 10 weeks ago. Since then we've shipped:
- Privy embedded wallet + Pimlico paymaster (gasless flow) — replacing direct wallet connection
- OAuth-based social verification (LinkedIn live, 3 more endpoint-ready) — replacing bio-paste verification
- ABI fix on UserIdentity — the function signatures referenced in this doc may not match deployed contract anymore
- Tenderly removal — any mention of Tenderly testnet is wrong
- RLS hardening via server-side write endpoints (TASK-06 shipped today) — security model section needs update
- Badge label change — "Claimed → Linked" terminology
- Browser extension exists (built but not Chrome Web Store yet) — may not be reflected

**Sections most likely to be wrong** (based on TOC):
- [ ] Section 6: Enrollment Flow — wallet flow has changed significantly
- [ ] Section 7: Verification Flow — proof-of-post → OAuth migration
- [ ] Section 8: Document Handling & Privacy Model — still mostly correct (the on-device biometric promise hasn't changed)
- [ ] Section 9: Verification Levels — badge terminology updated today (Owned / Verified / Linked)
- [ ] Section 3: How the Patent Works — patent-protected biometric verification approach is unchanged; this section is probably still correct
- [ ] Section 4: 3-Pillar Verification Architecture — unchanged

**Review actions** (in priority order):
- [ ] Decide: is this doc actually tester-facing, or is it an internal reference? (My guess: it's internal — testers see the in-app FAQ page, not this doc)
- [ ] If internal: low priority to update, defer until post-alpha
- [ ] If tester-facing: substantial update needed (~half-day of work), dispatch as Cipher brief

---

### 3. INVESTOR_MVP_SCOPE.md
- **Path:** `certainid-mvp/INVESTOR_MVP_SCOPE.md`
- **Last modified:** 2026-05-19 (~5 weeks ago)
- **Size:** 7 KB
- **Audience:** Investors / VC outreach
- **Purpose:** What's in scope for the MVP from an investor perspective

**Not tester-facing.** Review separately when prepping investor outreach. Out of scope for alpha launch readiness, but worth a quick read to make sure it's not contradicting what the tester deck says.

**Review action:**
- [ ] Skim once — confirm it doesn't say anything testers might quote that's no longer true
- [ ] Defer detailed review until investor outreach is the active workstream

---

### 4. In-app FAQ page (live)
- **Path:** `certainid-mvp/certainid_ui/src/components/FAQPage.tsx`
- **Live at:** https://app.certainid.io/#/faq
- **Audience:** Anyone who lands on the app
- **Purpose:** In-product help — first place a confused tester clicks

**Why this matters most:**
This is the only one of the four docs a tester will ACTUALLY SEE in the natural flow. The deck has to be handed to them, the FAQ doc is hidden in the repo, the investor doc isn't for them. The in-app FAQ they see by clicking "Help" in the dashboard.

**Review actions** (highest priority of all four):
- [ ] Open https://app.certainid.io/#/faq in a browser
- [ ] Read every Q&A as if you were a confused tester
- [ ] Note which Qs are missing entirely (likely: "Why don't I see my LinkedIn badge after signing in?", "What does Linked vs Owned mean?", "Why can't I link Instagram?", "What's the difference between testnet and mainnet?")
- [ ] Note which Qs are wrong (likely: anything referencing Tenderly, MetaMask popups for email users, bio-paste verification)
- [ ] Dispatch as Cipher brief: "TASK-NN — refresh in-app FAQ page for current state"

---

## Gap analysis — what's MISSING for soft launch

### Critical (should ship before any tester touches the product)
- [ ] **A "What's new this week" changelog** for alpha testers — they need to see the system is actively improving. Even a 5-line bulletpoint per release helps trust. Currently no such thing exists.
- [ ] **"How to give feedback" doc** — beyond `hello@certainid.io`, do we want a structured form? A Discord? A specific Telegram? This isn't anywhere in the existing materials in a clear way.
- [ ] **Updated tester deck** with the 5 likely-stale areas above corrected

### Important (nice to have before soft launch)
- [ ] **Troubleshooting cheatsheet** — "I'm stuck at X, here's what to do" for the top 5 stuck states (waitlist modal stuck, OAuth callback failed, MetaMask popup confusion, etc.)
- [ ] **Privacy one-pager** — distilled from the LegalPage but written like a human, not like a lawyer. Testers ask "what data are you collecting?" all the time.
- [ ] **Onboarding video or screencast** — 90 seconds of you walking through signup → first signed content. Faster than reading.

### Defer (post-alpha)
- [ ] Full FAQ rewrite from scratch
- [ ] Investor deck (separate workstream)
- [ ] Public docs site at docs.certainid.io
- [ ] API documentation for integration partners

---

## Review checklist (your work)

Mark ☑ when each step is done. This is your scratchpad — edit freely.

- [ ] Read `AlphaTesterDeck.md` end to end → decide what needs updating
- [ ] Visit `app.certainid.io/#/faq` → identify the gaps and errors
- [ ] Skim `docs/CERTAINID_FAQ_AND_ARCHITECTURE.md` → decide if it's tester-facing or internal-only
- [ ] Decide on feedback channel (email-only? Discord? Telegram?)
- [ ] Decide: do we want a video/screencast for onboarding?
- [ ] Dispatch any required updates as Cipher task briefs (TASK-NN format)
- [ ] Re-review updated docs before approving soft launch

---

## Notes (Gandelf7 writes here as you review)

_Use this section for your thoughts as you click through each doc. Anything that becomes a Cipher task gets dispatched separately._

> [your notes here]

---

## When this dashboard is no longer needed

After soft launch, this index becomes a historical artifact. Cipher should archive it under `memos/2026-06-soft-launch-prep.md` and create a fresh `ALPHA_DOCS_INDEX_v2.md` if/when we do a beta launch with a different cohort.
