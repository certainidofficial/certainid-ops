# Handoff → Cipher & Garry — Pre-Alpha Council Fixes DONE

**From:** claude-code · **Date:** 2026-09-11 · **Topic:** pre-alpha gap closure

Garry convened the Council (5 specialists) to find pre-alpha gaps, then handed me the code fixes and logged off to another user. All my-lane items are **done, deployed, and verified live** on app.certainid.io. Report below so you're both in sync.

## ✅ Shipped & verified (me, this session)
- **Access model = ALLOWLIST (live).** `BetaGate` now calls `checkBetaAccess()` — only emails in the Supabase `beta_access` table get into the app; everyone else sees "You're on the list." Anon RLS read confirmed (no lockout). Seeded Garry's 4 emails: `certainidofficial@gmail.com`, `garry@certainid.io`, `garry@keyview.com.au`, `gjmans@gmail.com`.
- **Load testers from the CRM.** New **"✓ Grant app access"** button on each lead at `app.certainid.io/admin.html` (pw `cid-leads-r4t8k2`). Garry adds his 4–5 testers there → they can log in. (Backed by consolidated `api/admin.js action=grant`.)
- **BIPA geo-block** (`api/geo.js` + Enrollment) — fail-open Illinois block on biometric enrollment. Verified: AU/QLD → not blocked, so Garry's testers are unaffected; only detected US-IL is blocked.
- **Social PII warning** — ProfilesTab now warns that a linked username is written **permanently/publicly on-chain** before you link it.
- **Re-theme misses fixed** — LegalPage (`prose-invert`→`prose-slate`; typography plugin isn't installed so it was cosmetic) and **ScanTab** (was fully skipped — now light).
- **Function consolidation** — merged 4 `admin-*` endpoints into one `api/admin.js` (Hobby plan caps at 12 functions; the extra endpoints broke the first deploy). Now 10 functions.

Commits: `62f9158`, `e494534` (+ earlier design commits `73d829d`, `915b13c`, `e0b179c`). App re-theme + concierge (Base-not-Polygon) also shipped earlier this session.

## 🔴 GARRY MUST DO (config/paid — I can't)
1. **Upgrade Supabase to Pro (~$25/mo)** — #1 risk. Free tier PAUSED on us mid-session; a paused DB = total outage during alpha. Pro removes auto-pause.
2. **Pimlico paymaster** — confirm the policy is scoped (contract allowlist + spend cap) and set a low-balance alert; the key ships client-side and is drainable if unscoped.
3. **Set `ADMIN_API_KEY` in Vercel** — then ping me to remove the hardcoded password fallback in `api/admin.js`.
4. **Check `certainid_ui/.env.production.local.bak.20260813`** (untracked in repo) — make sure no live secrets leak into git later.

## 🟡 DEFERRED (before public/beta, not alpha-blocking)
- Rate-limit gasless endpoints (do properly with Upstash; the allowlist now gates the main drain vector).
- On-chain social usernames are permanent plaintext PII (warning added; real fix = hash or strip, contract-level).
- `certainid_mobile` consent parity (age gate + geo) — this session fixed `certainid_ui` only.
- GDPR delete-my-data endpoint, Supabase DPA, attestor SPOF/KMS, contract circuit-breaker.

## For Cipher
No action needed from you on these — flagging for the shared brain. When Garry loads testers + upgrades Supabase, alpha is a go. n8n switchboard (trigger-based workflows) is still the agreed next infra piece, separate from this.

— claude-code · 2026-09-11 · pre-alpha-council-fixes
