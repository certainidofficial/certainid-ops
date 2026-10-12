# CertainID — Product Architecture & Financial Model

**Author:** Cipher · **Date:** 2026-10-13 · **Purpose:** Master reference for pitch deck, product build, and investor positioning

---

## 1. Dual-Track Identity Architecture

CertainID serves two distinct user groups with the same underlying infrastructure:

### Track A: Regulated (Government / Enterprise / KYC)
| Step | Who does it | Where data lives |
|---|---|---|
| ID document (passport/license) | Accredited third-party provider | Provider's infrastructure (discarded after check) |
| Biometric (face scan / liveness) | On-device, never leaves | Only hash on-chain |
| Device attestation (hardware TPM / secure enclave) | On-device | Only hash on-chain |
| Smart contract records | `document: verified_by_[PROVIDER]` | Public chain |

### Track B: Self-Sovereign (Off-grid / Privacy-first / Content owners)
| Step | Who does it | Where data lives |
|---|---|---|
| ID document (passport/license) | Self-attested on-device | Never leaves device |
| Biometric (face scan / liveness) | On-device, never leaves | Only hash on-chain |
| Device attestation (hardware TPM / secure enclave) | On-device | Only hash on-chain |
| Smart contract records | `document: self_attested` | Public chain |

**The smart contract doesn't care which track** — it records:
```
attestation {
  biometric_hash: 0x...           (on-device, signed at capture)
  device_attestation: 0x...       (hardware-bound, signed)
  document_verified_by: "provider_x" | "self_attested"
  timestamp: block_number
}
```

### AI Agent Mitigation
- Agents cannot present a hardware-anchored biometric (no camera, no secure enclave)
- Agents are forced into a separate verification path: API keys, code signing, wallet signatures
- Product differentiation: **"Verified Human"** vs **"Verified Agent"** as separate credential tiers

---

## 2. Operational Cost Stack

| Cost Category | Item | Unit Cost | Scale Notes |
|---|---|---|---|
| **Blockchain attestation** | L2 transaction (Base/Optimism) | $0.0002-0.02 | 0.11¢ median Sep 2026, falling 33% YoY |
| **ID document verification** | Third-party provider (Veriff/Sumsub/partner) | $0.80-2.00 per check | Only for Track A; zero for Track B |
| **Hosting** | Vercel Pro | $20-40/month | Covers MVP: 10M edge req, 1M func invocations |
| **Hosting scale-up** | Vercel at 100K+ verifications/mo | $100-300/month | $0.60/M additional invocations |
| **Phone app CDN** | Blob/image delivery | $0.40/1M reads | Negligible at MVP scale |
| **Third-party ID provider** | Annual minimum (Veriff Essential) | $588/year ($49/mo × 12) | 61 verifications/month minimum |

### Key insight
Per-verification cost (excluding third-party document check):
- Track B (self-sovereign): **$0.0002-0.02** per attestation (just blockchain gas)
- Track A (regulated): **$0.80-2.02** per verification ($0.80-2.00 provider + $0.0002-0.02 chain)
- CertainID's margin at $2.00/check pricing: **85%+** on Track B, **~50-60%** on Track A

Traditional vendors (Veriff/Onfido) pay 60-75% of revenue to third-party data sources. CertainID only pays that cost on Track A verifications.

---

## 3. Financial Scenarios

### Scenario A: Conservative — $600K raise
*"Prove the model, organic growth, AU-first"*

| | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Monthly verifications | 500 | 5,000 | 25,000 |
| Average price/check | $2.50 | $2.00 | $1.50 |
| Monthly revenue | $1,250 | $10,000 | $37,500 |
| ARR | $15K | $120K | $450K |
| Team | 2-3 | 4-5 | 8-10 |

**Use of funds:**
- Product dev & blockchain: $200K
- Legal, patents, IP Australia: $100K
- Compliance (AUSTRAC, DVS, IVS): $100K
- Marketing & content: $100K
- Runway: $100K

### Scenario B: Aggressive — $1.5M raise
*"Multi-vector launch, enterprise sales, global"*

| | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Monthly verifications | 2,000 | 25,000 | 150,000 |
| Average price/check | $2.00 | $1.50 | $1.00 |
| Monthly revenue | $4,000 | $37,500 | $150,000 |
| ARR | $48K | $450K | $1.8M |
| Team | 7-9 | 12-15 | 20-25 |

**Use of funds:**
- Engineering (5 devs, 18 months): $675K
- Sales & BD (2 enterprise, 18 months): $300K
- Compliance & legal: $175K
- Marketing, video, PR: $175K
- Infrastructure: $100K
- Founder salary: $75K

---

## 4. Industry Comparables

| Company | Revenue | Valuation | Funding | Multiple |
|---|---|---|---|---|
| ID.me | $200M ARR | $2B (2025) | $500M+ | 10× ARR |
| Trulioo | $150M | $1.8B | $477M | 12× |
| Persona | undisclosed | $2B | $200M (Series D) | — |
| Onfido | £50-100M | $400-650M (acquired) | $214M | ~10× |
| Veriff | $42M | $1.5B | $192M | 35× (high-growth premium) |
| Vouched | $10M+ ARR | undisclosed | $22M | — |

**CertainID's structural advantage:**
- Patents = zero-marginal-cost IP (no licensing fees)
- On-device processing = no third-party data costs for biometrics
- Dual-track = captures both regulated AND self-sovereign markets
- Hardware-anchored attestation = harder to spoof than server-side checks

---

## 5. Pitch Deck Recommendations

### Key slides
1. **The problem** — digital ownership is broken, deepfakes, platforms own your identity
2. **The dual-track solution** — regulated AND self-sovereign on the same infrastructure
3. **The technical moat** — patents, on-device biometrics, hardware attestation, L2 blockchain
4. **The market** — $13.75B → $50B by 2034, +166% funding boom in IDV
5. **The ask** — $1.5M (show $600K as alternative in appendix)
6. **Use of funds** — engineering-led, 18-month runway
7. **Projections** — conservative and aggressive tracks
8. **The team** — patented biometric identity + blockchain execution

### Investor narrative
*"Every identity vendor today makes you choose: trust a corporation with your data (Veriff/Onfido/ID.me) or have no verifiable identity at all. CertainID is the first system where you don't have to choose — your identity lives on your device, proves itself through your hardware, and leaves nothing behind but a hash. Two tracks, one infrastructure, zero compromise."*

---

## 6. Next Actions

| Priority | Item | Owner |
|---|---|---|
| P0 | Finalize the three identity processes (capture, verify, sign) | Garry |
| P0 | Content-signing phone test (prove the chain works) | Garry + phone |
| P1 | Set OPS_INGEST_SECRET in Vercel (enable ops dashboard) | Garry (15 sec) |
| P1 | Build avatar video via fal.ai (intro video for X) | Claude Code |
| P2 | Rework pitch deck with financial model + dual-track | Claude Cowork + Garry |
| P2 | Social calendar + DM inbox in admin panel | Claude Code |
| P3 | Gmail token watchdog (re-enable Nova email triage) | Cipher |

---

— cipher · 2026-10-13 · Sources: growthepie L2 fees (Sep 2026), Vercel pricing (2026), Spotsaas IDV pricing, Sacra/GetLatka company data, Reuters, Fortune Business Insights