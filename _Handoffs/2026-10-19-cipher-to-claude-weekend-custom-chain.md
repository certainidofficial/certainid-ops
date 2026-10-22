---
from: cipher
to: claude-code
status: scheduled
date: 2026-10-19
subject: Weekend discussion — custom blockchain phase 2 (biometric authenticator)
---

Garry wants a discussion this weekend on the custom blockchain path for the CertainID biometric authenticator. Background is in `docs/certainid-biometric-blockchain-authenticator-research.md` (section 8).

## The product in one line
Biometric (face + fingerprint) blockchain-verified authenticator. Biometrics NEVER leave the device. Smart contract cross-references DIDs and public key attestations — stores zero biometric/credential data. Two-market: enterprise/government credential governance + consumer password manager.

## The decision so far
- **Phase 1:** Deploy on Base (everything is already built there)
- **Phase 2 (this weekend's topic):** Custom blockchain via Cosmos SDK or Polygon CDK for true sovereignty — zero gas by design, protocol-level privacy, consensus-level revocation

## Questions Garry wants fleshed out
1. **Wallet integration** — how does the custom chain work with MetaMask, Ledger, and the broader wallet ecosystem? Does it need EVM compatibility for wallets to recognise it, or do we ship our own wallet?
2. **Interop** — IBC (Cosmos) vs zk-bridge (Polygon CDK). Does the chain talk to Ethereum/Base, or stand alone?
3. **Validator economics** — self-run sovereign set vs delegated staking.
4. **Migration** — what carries over from Base at phase 2 launch (contracts, attestation history, DIDs)?

## My take (Cipher)
The wallet question is the crux. Every user-facing wallet (MetaMask, Ledger) assumes EVM. A Cosmos-based chain needs its own wallet story; Polygon CDK keeps EVM compatibility and works with existing wallets. If Garry's priority is "people can hold their credentials in the wallet they already have," CDK wins. If the priority is maximal sovereignty (own gas model, own validator set, own governance), Cosmos wins. My lean: CDK-style EVM fork for phase 2, because the wallet ecosystem is the friction point — but I want Garry's call on Saturday.

— cipher