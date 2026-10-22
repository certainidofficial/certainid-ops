# CertainID — Biometric Blockchain Sovereign Authenticator
## Research Document & Roadmap

**Classification:** Confidential — CertainID Internal
**Date:** 2026-10-19
**Status:** Research / Pre-Build

---

## 1. Product Concept

A **biometric, blockchain-verifiable authenticator** that replaces passwords and platform-bound passkeys. The user authenticates with face + fingerprint on their device — biometrics never leave the device — and the credential cross-reference lives on a smart contract. Self-sovereign by architecture, compatible with existing web standards by design.

---

## 2. Two-Market Positioning

### Market 1: Enterprise / Government (CertainID core)

**Entry point:** Workforce identity credential management.

- Government agencies and enterprises need to issue and manage credentials across hundreds of employees and contractors
- Current solutions: PKI smart cards (CAC, PIV), hardware tokens (YubiKey), MDM-enrolled certificates — all expensive, supply-chain dependent, and friction-heavy
- CertainID's authenticator: an employee uses their face + fingerprint on their own phone or laptop → blockchain-attested credential → access provisioning. No hardware token to issue, no password to rotate, no shared secrets to leak. Full audit trail on-chain.
- **Revenue model:** Per-seat licensing, integration with existing IAM (Okta, Azure AD, Ping), government panel contracts

| Detail | Value |
|---|---|
| Current spend per employee/yr on MFA + credential management | $50-200 |
| Global workforce identity market | ~$20B (2025) |
| CertainID differentiator | Sovereign by architecture, not compliance checkbox. Gov-grade liveness + blockchain audit trail that meets AUSTRAC/DVS/IRAP requirements natively |

### Market 2: Consumer / Developer (Volume play)

**Entry point:** Biometric blockchain password manager.

- Every developer who pushes to GitHub has leaked a credential at some point. Every person who signs up for a service has their password on yet another server. The pattern is broken.
- CertainID authenticator: no vault server, no master password to lose, no iCloud syncing your private keys to Apple. Your face + smart contract is the credential.
- **Revenue model:** Freemium tier (personal use, unlimited credentials, 1 device), Paid tier (cross-device, family sharing, credential inheritance via smart contract), Enterprise tier (workforce)
- Distribution path: browser extension + mobile app → FIDO2/WebAuthn compatible → works on any site that supports passkeys

| Detail | Value |
|---|---|
| Consumer password manager TAM | $10B by 2030 |
| Current penetration of password managers | ~25-30% of internet users |
| Key adoption barrier | Trust in cloud vaults / platform lock-in — your model removes both |
| CertainID differentiator | No vault to breach. No platform vendor to trust. Your biometric is your key, blockchain is your proof, your device is your sovereignty |

### Why both markets, not one

Enterprise pays first (higher willingness to pay, compliance-driven). Consumer builds brand, network effects, and ubiquity that makes enterprise sales easier. The same technology, two sales motions.

---

## 3. Architecture: CertainID SDK (top) → FIDO2 (bottom)

```
┌──────────────────────────────────────────┐
│         CertainID SDK Layer               │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Face     │  │ Finger   │  │ Other  │ │
│  │ Capture  │  │ Scan     │  │ Biometric │ │
│  └────┬─────┘  └────┬─────┘  └───┬────┘ │
│       │             │             │       │
│  ┌────▼─────────────▼─────────────▼────┐ │
│  │     Liveness Detection Engine       │ │
│  │  (anti-spoof, depth, liveness)      │ │
│  └────────────────┬────────────────────┘  │
│                   │                         │
│  ┌────────────────▼────────────────────┐  │
│  │  Biometric Matcher (on-device)     │  │
│  │  Template never exported           │  │
│  └────────────────┬────────────────────┘  │
│                   │                         │
│  ┌────────────────▼────────────────────┐  │
│  │  Sovereign Identity Boundary       │  │
│  │  ←── DATA NEVER LEAVES THIS ──→   │  │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│       FIDO2/WebAuthn Transport Layer     │
│  ┌──────────────┐  ┌──────────────────┐  │
│  │ WebAuthn API │  │  CTAP2 Protocol  │  │
│  │ (browser)    │  │  (native app)    │  │
│  └──────┬───────┘  └───────┬──────────┘  │
│         │                  │               │
│  ┌──────▼──────────────────▼──────────┐  │
│  │  Private Key Store (device-bound) │  │
│  │  Key unlocked BY biometric match  │  │
│  └────────────────┬───────────────────┘  │
│                   │                         │
│  ┌────────────────▼───────────────────┐  │
│  │  Authenticator Attestation        │  │
│  │  (proves: "this is a CertainID    │  │
│  │   authenticator, attested at      │  │
│  │   contract 0x...")                 │  │
│  └────────────────┬───────────────────┘  │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│         Blockchain / Smart Contract      │
│  ┌────────────────────────────────────┐  │
│  │ Verifiable Data Registry (VDR)    │  │
│  │ Stores: attested DIDs, public     │  │
│  │ keys, revocation status, issuer   │  │
│  │ claims — but NOT biometric data   │  │
│  └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Key architectural decisions

| Layer | Role | Sovereignty boundary |
|---|---|---|
| CertainID SDK | Biometric capture + liveness + matching | **Inside** — biometric data never leaves SDK boundary |
| FIDO2/WebAuthn | Transport + key exchange + browser compatibility | **Underneath** — handles the cryptographic protocol, receives an "unlocked" signal from SDK |
| Smart contract | Public attestation + DID registry + revocation | **Outside** — only public key material and verifiable claims on-chain; zero biometric data |

### Why CertainID SDK on top of FIDO2

- FIDO2 is the **existing standard** — every browser supports it, every major site has a passkey field now. We don't rebuild the wheel.
- But FIDO2's authenticator layer is **owned by OS vendors** (Apple, Google, Microsoft). Our SDK **replaces** the OS authenticator with our own — same plumbing, different trust anchor.
- The SDK owns the sovereign data boundary. FIDO2 never sees the biometric — it only receives "user verified" from the SDK after liveness + match passes.
- The smart contract sits **below** FIDO2 in the attestation flow — the authenticator proves it's a genuine CertainID device by signing with a key whose public attestation lives on-chain.

---

## 4. What Exists vs. What's Open

### Existing (that validates the model)

| Technology | Alignment with our model | Gap |
|---|---|---|
| FIDO2 / WebAuthn | On-device biometric, private key never leaves, phishing-resistant | Keys synced by OS vendors (iCloud, Google) — not sovereign. No blockchain attestation. No multi-modal biometric |
| Passkeys (Apple/Google) | Mass adoption, consumer-validated | Platform-bound. If you leave Apple/Google, you lose your keys. No way to recover without the OS. No enterprise audit trail |
| DIDs + Verifiable Credentials (W3C) | Self-sovereign identity standard, verifiable data registry | No biometric component in the spec. No liveness. No standard integration with FIDO2 |
| Hyperledger Indy/Sovrin | Permissioned blockchain for identity, revocation registries | Heavy. Needs Sovrin network. No biometric capture. Enterprise-only |
| Hardware security keys (YubiKey, Google Titan) | FIDO2-compatible, hardware-bound private keys | Not biometric (PIN at best). Supply chain dependency. Can't prove liveness. No recovery without backup keys |
| SIBERIA (research paper) | SSI + voice biometric + blockchain | Research only. Single-modality (voice). Private EOSIO chain. Not commercial |

### Open space (nobody owns this)

| Position | Why it's open |
|---|---|
| **Biometric multi-modal FIDO2 authenticator** with face + liveness + fingerprint | Every FIDO2 authenticator today is single-factor biometric (fingerprint OR face) and platform-bound. No independent multi-modal provider exists |
| **Blockchain-attested authenticator** | FIDO2 has no blockchain component. Your authenticator can prove "I am a genuine CertainID device, attested at contract 0x..." — this doesn't exist today |
| **Cross-platform sovereign authenticator** (not iCloud, not Google) | Passkeys are locked to OS ecosystems. A sovereign authenticator that works identically on any device with a camera + sensor is unoccupied |
| **Self-sovereign credential inheritance via smart contract** | No password manager handles digital estate planning on-chain. Smart contract permissions for credential inheritance = completely new |

---

## 5. Research Roadmap — What We Still Need to Validate

### R1. FIDO2 Integration Depth
- Can a custom platform authenticator register via WebAuthn on all major browsers (Chrome, Safari, Firefox, Edge)?
- What's the WebAuthn extension API for custom attestation statements? Can CertainID's attestation include a smart contract address?
- **Output requirement:** A FIDO2 conformance test report against all major platforms.

### R2. Biometric SDK → FIDO2 Bridge
- Does WebAuthn support user verification with a **third-party authenticator** (non-OS) on mobile + desktop?
- How does CTAP2 handle the "user verified" flag — can our SDK set this after liveness check?
- **Output requirement:** A technical bridge spec — how the SDK signals "verified" to the FIDO2 stack.

### R3. Smart Contract Attestation Architecture
- What blockchain (existing CertainID chain, or a new credential chain)?
- Cost per attestation per login — smart contract transactions on mainnet are expensive. Do we need a Layer 2?
- How does revocation work? (if a device is lost, the user must revoke the attestation — the smart contract is the authority)
- Can a DID method be defined for CertainID authenticators? (`did:certainid:0x...`)
- **Output requirement:** A smart contract architecture document with cost modelling at scale.

### R4. Recovery Model
- What happens when a user loses their device?
- No password to reset. No recovery codes. The private key is bound to the device + biometric.
- Options:
  - **Social recovery** — N-of-M trusted parties sign a recovery transaction on the contract
  - **Hardware backup** — seed phrase or backup key stored offline
  - **Federated recovery** — CertainID acts as a recovery oracle (requires trust, but works)
- **Output requirement:** A recovery mechanism white paper with threat model analysis.

### R5. Competitive IP / Patent Landscape
- Do any existing patents cover "biometric multi-modal FIDO2 authenticator with blockchain attestation"?
- What do the Atherton/MIKOH patents (David Matthews, renewed to 2030) specifically cover, and do they map here?
- What do we need to file?
- **Output requirement:** A freedom-to-operate analysis.

### R6. Two-Market Go-to-Market Friction Analysis
- Enterprise: which government / enterprise IAM integrations are needed first? (Okta, Azure AD, Ping, ForgeRock, Keycloak)
- Consumer: what's the minimum viable product? (browser extension alone? mobile app first?)
- Which market has the shorter sales cycle and lower cost of customer acquisition?
- **Output requirement:** A GTM roadmap with milestones and cost estimates.

### R7. X Passcode Gate (Immediate Blockage)
- X requires a "Create Passcode" step before DMs work — this is a roadblock for the Cloak session right now.
- Needs investigation: can this be bypassed programmatically? Requires a phone number? Can be done via the API vs the web UI?
- **Output requirement:** A one-page analysis of the X DM access requirements.

---

## 6. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| FIDO2 doesn't support third-party platform authenticators on some browsers | Medium | High | Build CTAP2 companion app for unsupported platforms; fall back to WebAuthn via extension |
| Smart contract gas costs make per-login attestations uneconomical | Medium | Medium | Layer 2 (Arbitrum/Optimism/Polygon); batch attestations; zero-knowledge rollups for verification |
| Biometric template stored on-device can be extracted if device is compromised | Low | High | TEE/secure enclave binding; the SDK must use hardware-backed key storage (Android TEE, iOS Secure Enclave) |
| Users don't trust "face as password" | Medium | Medium | Market to developers first (they understand the architecture); offer PIN fallback |
| Government procurement cycles are 12-24 months | High | Low revenue risk | Bootstrap with consumer market; enterprise is secondary revenue |

---

## 7. Immediate Next Steps (Post-Review)

1. **White paper** (this document → Garry review → iterate)
2. **R1 & R2 research** — FIDO2 conformance testing and SDK bridge spec (Cipher + technical research)
3. **R5 patent analysis** — Atherton/MIKOH mapping (Michael Kadoury)
4. **R3 smart contract architecture** — existing CertainID blockchain capability assessment
5. **Go-to-market friction analysis** — enterprise vs consumer, cost of acquisition

---

*This document is a research frame, not a build spec. Each R1-R7 item needs its own deep-dive before we commit to architecture. The goal of the research phase is to validate the feasibility and identify the critical path to a minimal shippable authenticator.*