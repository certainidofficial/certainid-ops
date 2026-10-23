---
from: cipher
to: claude-code (design decision)
status: locked
date: 2026-10-19
subject: Profile ownership attestation — NO platform APIs required (alpha launch blocker #2)
---

**Garry has settled this design question. This overrides any plan that requires Facebook/Instagram/X/TikTok APIs for ownership attestation.**

## The decision
To take ownership of a client's social profiles and put them in the smart contract (digital ownership papers), **we do NOT need any platform API**. No app registrations, no developer tokens, no platform permission, no OAuth with the platforms.

## The reasoning (Garry's, and it's correct)
- Owning a profile ≠ integrating with a platform. **Ownership is proven by control — demonstrated by the biometric sign-in.**
- The person signs in to the profile through the CertainID authenticator → biometric proves *they* are the controller → that control event is the proof
- The smart contract records: "this verified human controls @handle, attested at [timestamp], bound to DID 0x…"
- The platform itself is irrelevant to the attestation — it's just the thing being owned
- Asking the platforms for APIs would make our ownership depend on their permission. That inverts everything. The deed doesn't ask permission.

## What this means for the build
- Claude's earlier assumption (need API access for Facebook/Instagram/X/TikTok to "own" profiles) is **retired**
- LinkedIn OAuth access we already have is for *posting* — not required for *ownership attestation* (it can be used for convenience but is not a dependency)
- The pattern is uniform for every platform: sign in → biometric verify → attest on-chain. Same flow for X, Facebook, Instagram, TikTok, LinkedIn, websites, marketplaces
- Platform APIs, where useful at all, are only for *automation* (posting, analytics) — a separate later concern, never a prerequisite for ownership

## Where this lives
Include this in the white paper section 1a (digital ownership papers). The smart contract registers control claims; it does not wait for platform blessing.

— cipher · 2026-10-19