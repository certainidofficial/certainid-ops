# Handoff → Cipher — full status report (everything live tonight)

**From:** claude-code · **Topic:** consolidated state — Garry's about to change how we work together and wants you fully briefed first.

Ack on the new pull-act-not-fetch rule: agreed, adopted. Every pull from here gets scanned for unread handoffs before anything else starts.

## 1. Ops Dashboard — the thing to build on

**Live at `app.certainid.io/ops.html`.** This is the shared read-only overview Garry asked for — one page instead of jumping between tools. Architecture, since you'll be pushing into it:

- **Backend:** `api/admin.js`, two new actions —
  - `GET ?action=ops_snapshot` — returns the full read model (admin-key gated)
  - `POST {action:'ops_ingest', section, signal_key, payload, source}` — your push endpoint. **Separate auth from the admin key** — HMAC-SHA256 of the raw JSON body using `OPS_INGEST_SECRET` (env var, Garry needs to set it in Vercel — flagged to him, not yet confirmed done), sent as `X-Ops-Signature` header.
  - Valid `section` values: `social`, `posts`, `action_items`, `health`, `briefing`, `waitlist` (waitlist is computed live from Supabase, not pushable — you own the other five).
- **Storage:** new `ops_signals` table (`section`, `signal_key`, `payload` jsonb, `source`, `updated_at`) — upsert on `(section, signal_key)`.
- **Frontend:** `public/ops.html` (grid, 5 cards) + `public/social.html` (spreadsheet drill-down — accounts + per-post analytics, linked from the Social card).

**Layout, per Garry's direction tonight:** Today's Briefing (top-left) → Action Items → Health → Social → Waitlist. Waitlist card links through to the CRM (`admin.html`); Social card links through to `social.html`.

**Currently populated (by me, one-time manual pull, not automated yet):**
- Waitlist/CRM funnel — live-computed, always current (total/new-today/pending/approved/enrolled).
- Social + Posts — pulled once from Blotato tonight (4 CertainID-branded accounts only — I initially included unrelated accounts from the same Blotato workspace and Garry corrected that; fixed). Real finding surfaced: every synced post shows **zero engagement** (0 impressions/likes across the board) — flagged on the page, not hidden.

**Awaiting your feed:** Action Items, Health, Briefing sections are empty placeholders ("awaiting data") — that's your lane per the original task split (you own the push, I own the display). Same for keeping Social/Posts fresh going forward instead of my one-time pull.

## 2. CRM (`admin.html`) — unchanged shape, some additions tonight
Still the lead-approval tool: waitlist → approve (auto-sends onboarding email) → revoke & block (with recorded reason, refuses re-approval until unblocked) → delete-my-data (GDPR/CCPA, type-to-confirm). Added tonight: back-link to `/ops.html`.

## 3. Newsletter/broadcast — built, not yet fired
In-house broadcast tool (no 3rd-party cost) — Resend batch send, audience-segmented (all/approved/pending), real unsubscribe (HMAC link, honored on future sends). Compose panel lives in the CRM. The actual send is gated on Garry's explicit go — built and tested up to (not including) a live blast.

## 4. Relay — confirmed working both directions tonight
Port 8646, HMAC signature, `event_type: agent.handoff` — verified independently on my end, HTTP 202. Full history in the other handoffs from tonight if you need the blow-by-blow (port collision → schema mismatch → resolved).

## 5. TASK-14 gap scan + fixes — done
Full report at `Dev/COUNCIL_REVIEW_2026-09-12.md`. Headline: found a real P0 in the Scan tool ("Paste a URL" silently hashes the URL text on CORS failure, confidently telling users real signed content is "Not Verified" — actively worse than no scan at all). Also fixed three things live tonight:
- Enrollment back-arrow was silently disconnecting + discarding captured biometric on steps 2-4 — now step-aware, and the in-flight/complete steps hide the back arrow entirely.
- Wallet-only login was a silent dead end against the email-only allowlist — now tells the user plainly to switch to email.
- WebAuthn failure on the installed PWA had no way out — added "continue in browser" + support email.

## 6. Important context for anything you build next: positioning pivot
Garry's decided **not to lead with content-scanning/verification this phase** — the Scan P0 above is deprioritized, not forgotten. The go-to-market message right now is **digital ownership**: biometric-backed, smart-contract-logged proof that a profile is genuinely yours, no platform authority needed. Scanning/verification is phase two. Worth keeping in mind for anything marketing-facing you're drafting.

## Where things stand
Content-signing end-to-end proof (your TASK-15 ask) is still waiting on Garry running the phone test himself — can't fake a real biometric signature. Ops dashboard live-push is the natural next thing once `OPS_INGEST_SECRET` is confirmed set.

— claude-code · 2026-09-20 · full-status-report
