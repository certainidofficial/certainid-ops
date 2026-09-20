# CertainID Alpha Flow Review — Fresh Gap Analysis (2026-09-20)

Reviewed against live source in `certainid_ui/src/components/` (post re-theme). Read every named file end-to-end plus `useWallet.ts`, `useContentSigning.ts`, `index.tsx` (Privy config), `BiometricGate.tsx`, `IdentityHologram.tsx`, and cross-referenced with `git log`/`git show` where a fix was suspected to already exist. No code changes made by this review agent (a separate fix was applied to VerifyContent.tsx by claude-code directly afterward — see note at the end).

---

## Verdict on the reported bug: "verify link only encodes ?hash=, not ?contract="

**Not currently present in the primary path. It was real, and was already fixed in commit `9033ce2` ("Fix verification URL to include contract address in shared links").**

Trace of the current code:

- Link generation — `certainid_ui/src/components/ContentTab.tsx:157-159`
  ```
  const captionUrl = (hash: string) => contractAddress
    ? `https://app.certainid.io/#/v/${hash}?contract=${contractAddress}`
    : `https://app.certainid.io/#/v/${hash}`;
  ```
  Used by both "Copy Post Caption" and "Verify Link Only". When `contractAddress` is truthy (the normal case), the generated link includes both hash and `?contract=`.

- Link consumption — `certainid_ui/src/App.tsx:56-68` (`HashVerifyRedirect`, route `/v/:hash`) correctly forwards `contract` from the query string into `/verify-content`.

- Auto-verify — `VerifyContent.tsx:131-139` fires automatically when both params arrive. A friend with no account lands on `/verify-content` and sees the result with zero manual input. **This flow works today.**

**One real residual gap** (same failure mode, different trigger): `captionUrl` falls back to hash-only whenever the `contractAddress` prop passed into `ContentTab` is falsy at the moment of copy/sign. `handleSign` never checks this prop before signing — the on-chain call resolves its own contract address independently via `useContentSigning.ts`. So a signature can succeed on-chain while the UI's copy of `contractAddress` is still `null` (e.g. a slow identity-load race on first dashboard paint), producing a hash-only link for that one item.

- **Severity: P2**
- **Where:** `ContentTab.tsx:157-159` vs. `useContentSigning.ts:58` (two independent sources of truth for "what's my contract address")

**UPDATE (claude-code, same night):** rather than just flag this, closed the actual risk at the root — `VerifyContent.tsx`'s `verify()` now resolves the signer via `findSignedContentByHash()` (a hash-only Supabase lookup that already existed and was already used by `ScanTab.tsx`, but was never wired into the public verify page) whenever `contract` is missing or invalid, before falling back to an error. All three call sites (URL params, manual form submit, file drop) now work even without a pre-known contract address. Deployed and live. This makes the P2 above structurally unreachable as a dead end — even if a hash-only link is ever generated, the verify page now resolves it gracefully instead of hard-erroring with "Invalid contract address."

---

## The actual unfinished part of the scan tool

This is the real "founder says it's unfinished" bug, and it's a P0.

**`ScanTab.tsx:148-176` — "Paste a URL" silently mis-hashes on CORS failure and reports genuine signed content as unverified.**

```js
const scanUrl = async () => {
  const url = urlInput.trim();
  if (!url) return;
  try {
    const parsed = new URL(url);
    const paramHash = parsed.searchParams.get('hash');
    if (paramHash && paramHash.startsWith('0x')) {
      await runScan(paramHash as `0x${string}`, url);
      return;
    }
    const resp = await fetch(url);              // <-- cross-origin fetch, no proxy
    if (!resp.ok) { setError(...); return; }
    const blob = await resp.blob();
    ...
    await runScan(hash, url);
  } catch (err) {
    // If URL is malformed, treat it as raw text to hash
    const hash = await hashString(url);          // <-- silently hashes the URL STRING
    await runScan(hash, url);
  }
};
```

- **Current behavior:** If the pasted URL is a CertainID verify link (`?hash=` param present), it works correctly. For any other URL — an Instagram post, a TikTok link, an X post, any normal webpage, i.e. what a real user actually pastes — the browser calls `fetch(url)` directly, client-side, no CORS proxy. Virtually every social platform and most third-party sites don't set `Access-Control-Allow-Origin` for arbitrary origins, so this throws. The `catch` block does **not** surface that as an error — it silently hashes the **literal URL string** as if it were the content, then runs that meaningless hash through `runScan`. Nothing in Supabase matches a hash of a URL string, so the result is always "No CertainID Signature" — a hard-red, confident-looking "not verified" result for content that may in fact be signed.
- **Compounding issue:** even on a site where the cross-origin fetch succeeds, the tool hashes the fetched **HTML page bytes**, not the embedded image/video the original signer hashed via `hashFile()`. So even a successful fetch essentially never matches for a "paste the post URL" use case.
- **User impact:** A non-technical friend does exactly what the product invites them to do — pastes a link to the post — and is told with high visual confidence that content is unverified, when the tool simply couldn't check it. Actively worse than doing nothing: it produces false distrust in a product whose entire pitch is trust.
- **What actually works in Scan today:** "Upload a file" and "Take a photo" hash local bytes directly — no network fetch — and correctly hit Supabase + on-chain verification. Those two paths are solid. It's specifically "Paste a URL" that's broken for its obvious use case.
- **Severity: P0**
- **Suggested fix:** (1) Distinguish CORS/network failure from "malformed URL" — don't silently hash the URL text; show an explicit error ("We can't check that link directly — download the file and use Upload instead, or ask the poster for their CertainID verify link"). (2) Longer-term: route the fetch through a server-side proxy endpoint to avoid CORS entirely, or drop the "generic URL" scan pathway and keep only "CertainID verify link," "Upload," and "Camera" as advertised methods.

---

## Flow-by-flow findings

### 1. Login (`Login.tsx`, `BetaGate.tsx`)

**Works:** Email login via Privy, clean redirect logic gated on `ready && authenticated` with documented rationale. "Back to certainid.io" escape exists via `BetaGate`'s `PrivateBetaPage` (real "Sign in" link + waitlist CTA).

**P1 — "Already have a crypto wallet?" login path can never pass the beta allowlist.**
- **Where:** `BetaGate.tsx:132-136` vs. `useWallet.ts:96` (`connectWallet` → `privyLogin({ loginMethods: ['wallet'] })`) and `Login.tsx:100-116`.
- **Current:** `BetaGate` allowlists purely by email. A user who authenticates via the wallet-only Privy modal has no `user.email` for that session. Shown "You're on the list" forever, even if genuinely on `beta_access` — no explanation that email login would let them in.
- **Fix:** Check `beta_access` by wallet address as a fallback when no email is present, or require email capture even on the wallet login path.

**P3 — Privy modal appearance is hardcoded dark (`index.tsx:57`: `theme: 'dark'`) while the rest of the app was re-themed to light tonight.** First-time login is the highest-stakes first impression; will visually clash. Trivial fix: flip to `theme: 'light'`.

### 2. Enrollment (`Enrollment.tsx`, `DocumentCapture.tsx`)

**Works well:** Method chooser is clear, consent gate blocks proceeding until checked, BIPA geo-block for Illinois residents is real and user-facing, QR "Use Phone" flow has a genuine 3-minute stuck-session watchdog with an explicit "Restart enrollment" recovery button. Wrong-network banner with a one-tap "Switch" is good. Transaction status banners cover deploying/registering/pending/success/error clearly.

**P0 — The header back arrow silently disconnects and discards all enrollment progress once past step 1.**
- **Where:** `Enrollment.tsx:312-330`
  ```js
  onClick={() => {
    if (step === 1) {
      if (biometricMode === 'local' || biometricMode === 'face' || biometricMode === 'phone') {
        setBiometricMode('choose'); setShowQR(false); closeSession(); return;
      }
    }
    disconnect();
    navigate('/');
  }}
  ```
- **Current:** The "go back one step" guard only applies `if (step === 1)`. On **step 2** (the user has already captured their biometric, held in `pendingBiometric` state) and on **step 3/4** (blockchain registration in progress or complete), tapping the same back arrow instead calls `disconnect()` (logs out the wallet/Privy session) and hard-navigates to `/`. No confirmation. One tap and the captured biometric, in-progress registration, and session are gone. The icon gives no visual signal its behavior changes between steps.
- **Fix:** Make the back button step-aware for all steps (`step > 1` → decrement step, not disconnect); reserve `disconnect()` + navigate-home for an explicit "Exit enrollment" action. If step 3+ is in-flight, disable/hide the back arrow rather than let it abandon a submitted transaction.

**P3 — Dead "help" button.** `Enrollment.tsx:333-335` renders a `help` icon with no `onClick`. Wire to `/faq` (already exists, linked from `Login.tsx:124`) or remove it.

### 3. Dashboard (`Dashboard.tsx`)

**Works:** 15-second loading timeout with retry — not a dead spinner. Stale-contract self-healing logic is careful about not clearing localStorage on transient RPC errors. Family-mode logout path has a clear escape.

**P2 — Family Mode "Connect a Wallet" CTA calls `handleFamilyLogout()` before navigating to `/connect`.** Worth a live check: may be surprising if a family-mode user expects to be upgraded in place rather than logged out first. If intentional, relabel the button ("Sign out & connect a wallet").

### 4. Content signing (`ContentTab.tsx`)

**Works well:** Auto-hash on file/URL/text with visible "Hashing…" states, clear 3-step visual flow, gasless vs. gas-fee copy correctly conditioned on embedded-wallet detection, good empty state with 3-step explainer, revoke requires confirm dialog. Post-sign success screen leads with "Copy Post Caption" — good hierarchy.

Content signing itself is solid; the gap is entirely on the consumption/verification side (see P2 above, now closed, and the P0 scan-tool finding).

### 5. Content scanning/verifying (`ScanTab.tsx`)

Covered in detail above. **Upload and Camera paths work; Paste-a-URL is the broken, unfinished piece (P0)** — and it fails in the worst possible way: confidently, silently, and wrong.

**P2 — No indication in the UI that "Paste a URL" only reliably works for CertainID verify links.** Copy ("A share link, a post, or a file's URL") oversells what the input actually supports. If the fix is "detect and message the failure" rather than "add a real fetch proxy," tighten the copy too.

### 6. Public verify URL flow (`VerifyContent.tsx`, `HashVerifyRedirect`, `PublicIdentityCard.tsx`)

**Works — this flow is in good shape.** A friend with no account clicking a `/#/v/HASH?contract=ADDR` link lands on `/verify-content`, auto-verifies via on-chain read with a Supabase fallback if RPC is unreachable, and sees one of three clear states: Authentic (green), Revoked (amber), or Tampered/Not Found (red, with a plain-English explainer). No wallet connection required, page says so. Manual entry form available as fallback.

**P3 — `/u/:contractAddress` renders a full-looking identity card for any syntactically-plausible address, even one that was never a real CertainID contract.** Only sets `notFound` on a Supabase *query error*; a valid query returning zero rows still renders `IdentityHologram` at "Level 0 · Registered." Low priority (requires hand-editing the URL), worth a cheap on-chain existence check before rendering.

**P1 (adjacent) — `BiometricGate.tsx` (wraps `/dashboard` for installed-PWA users) has no escape hatch on failure.** On WebAuthn failure the only options are "Try again" and "Re-enroll this device" — both retry the same platform authenticator. No "Sign out," no "Open in browser instead," no support contact. If a user's platform authenticator is in a bad state (common after an OS update, a cleared secure enclave, or a shared device), they're fully locked out of the installed app with no way out except uninstalling the PWA. Given `Enrollment.tsx:842-856` actively pushes users to install this PWA at the end of enrollment, this is a real risk for exactly the alpha testers who just successfully onboarded.
- **Fix:** Add a visible "Sign out" or "Continue in browser" action on the failed state, plus a support email.

---

## Summary punch list

| # | Severity | Where | Issue | Status |
|---|----------|-------|-------|--------|
| 1 | P0 | `ScanTab.tsx:148-176` | "Paste a URL" silently hashes the URL string on CORS/fetch failure, producing confident-but-wrong "not verified" for real signed content. | **Deprioritized** — Garry's pivoted go-to-market to "digital ownership," not scanning, this phase. Still open, not urgent. |
| 2 | P0 | `Enrollment.tsx:312-330` | Header back arrow only steps back on step 1; on steps 2-4 it silently disconnects and discards all enrollment progress. | **Fixed** — deployed live. Step 2 now steps back cleanly; steps 3-4 hide the back arrow (in-flight/complete tx can't be abandoned). |
| 3 | P1 | `BetaGate.tsx:132-136` + `useWallet.ts:96` | Wallet-only Privy login never has an email, so allowlist check permanently shows "You're on the list" for that path regardless of actual status. | **Fixed** — deployed live. Distinct message now tells the user to sign out and use email instead. |
| 4 | P1 | `BiometricGate.tsx:174-194` | No escape hatch (sign out / open in browser) when WebAuthn unlock fails on the installed PWA. | **Fixed** — deployed live. "Continue in browser instead" (bypasses standalone-mode enforcement) + support email added. |
| 5 | P2 | `ContentTab.tsx:157-159` vs. `useContentSigning.ts:58` | `captionUrl` and the sign transaction can read different contract-address sources, producing a hash-only link. | **Fixed** (VerifyContent.tsx now resolves hash-only links via Supabase; structurally closed) |
| 6 | P2 | `ScanTab.tsx:239-241` | Copy oversells "Paste a URL" support beyond what the tool can resolve. | Open |
| 7 | P2 | `DocumentCapture.tsx:106-117` | Front+back ID docs via phone QR path only bind front-image hash; desktop path hashes both. Inconsistent. | Open |
| 8 | P2 | `Dashboard.tsx:609-615` | Family-mode "Connect a Wallet" logs out before navigating — confirm intentional, relabel if so. | Open |
| 9 | P3 | `PublicIdentityCard.tsx:32-56`, `IdentityHologram.tsx:36-42` | Garbage/non-existent contract address in `/u/:contractAddress` still renders a plausible identity card. | Open |
| 10 | P3 | `Enrollment.tsx:333-335` | Dead "help" button — no `onClick`. | Open |
| 11 | P3 | `index.tsx:57` | Privy login modal hardcoded dark against the now-light app. | Open |

## What's genuinely solid (no action needed)
- The shared-verify-link flow (sign → copy caption → friend clicks → sees Authentic/Revoked/Tampered with no account) works correctly end-to-end.
- Content signing UX (auto-hash, clear steps, gasless copy correctly conditioned on wallet type) is well-built.
- QR-based phone biometric handoff during enrollment has a real stuck-session watchdog with recovery.
- Dashboard loading has a bounded timeout with retry, not an infinite spinner.

— qa-ux agent (fresh gap scan) + claude-code (VerifyContent fix) · 2026-09-20
