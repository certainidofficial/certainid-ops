---
type: code-map
repo: certainid-mvp
updated: 2026-08-07
tags: [dev, code-map, architecture]
---

# CODE MAP — CertainID

> Read this for orientation instead of exploring the tree. Keep it updated when architecture changes.
> Human: query dev notes via Obsidian Bases/Dataview on `type` and `tags`. Agent: grep by tag / read the relevant file only.

## Repos (monorepo at `~/Documents/App_dev/CertainID/certainid-mvp/`)
- `certainid_ui/` — main web app, **app.certainid.io** (React 18 + Vite + TS + Tailwind). Where most work happens.
- `certainid_ui/api/` — Vercel serverless functions (relayer, OAuth callback, attestor).
- `certainid_mobile/` — QR-companion PWA, **m.certainid.io** (biometric/photo capture for the desktop→phone handoff ONLY).
- `certainid-blockchain/` — Solidity/Hardhat contracts (not deployed to Vercel).
- Siblings: `certainid-official/` (Astro marketing site), `certainid-family/`, `certainid-ops/` (Cipher task repo).

## Chain / deployment facts (CURRENT)
- **Base mainnet, chain ID 8453.** (Migrated off Polygon Amoy/Tenderly — old docs still say Polygon; scrub pending.)
- Attested **IdentityRegistry**: `0xc78A6D2A28ca28edf55B26278a3D7Ee5e7915C09`.
- Relayer wallet: `0x9DF7Ccc1A560303520D138e14ef6bDD15f364249`.
- RPC: Alchemy Base + `https://mainnet.base.org`. **Never publicnode** (it rejects eth_getTransactionReceipt).
- Deploy: `./deploy-ui.sh` (builds locally, deploys prebuilt). **Vercel never builds remotely.** git push = version control only.
- Identity is owned by a per-user **ERC-4337 smart account** (Pimlico paymaster, gasless), not the bare EOA. Contract is **Ownable2Step**.

## Key files — certainid_ui/src
- `components/Enrollment.tsx` — enrolment flow. Steps: 1 Verify Identity (biometric), 2 Add ID (optional), 3 Register on Chain. On mobile it auto-selects "This Device" (inline WebAuthn); QR/"Use Phone" is for a SECOND device only.
- `components/Login.tsx` — Privy email auth; redirect gated on `ready && authenticated`.
- `components/Dashboard.tsx`, `components/IdentityHologram.tsx` — dashboard + identity card (pillar icons: fingerprint/badge/face).
- `components/ContentTab.tsx` + `components/VerifyContent.tsx` — content signing UI + public verify page (drop file → hashFile → verifyContent).
- `lib/smartWallet.ts` — `buildSmartAccountClient(signer)` (ERC-4337 + Pimlico). `lib/constants.ts` — `BASE_RPC_URL`. `config/wagmi.config.ts` — RPC fallback list.
- `hooks/useSmartAccount.ts` — gasless smart account (embedded OR MetaMask wallet). `hooks/useDemoRelayer.ts` — gasless enrol (deploy + acceptOwnership). `hooks/useSocialProfiles.ts` — `verifyOnChainWithAttestation` (attested social verify). `hooks/useContentSigning.ts` — signContent/revokeContent via smart account.
- `lib/imageHash.ts` — `hashFile` (used by BOTH sign and verify — must match).

## Key files — certainid_ui/api
- `deploy-identity.ts` — relayer: deploys UserIdentity, registers, transfers ownership to smart account, mints NFT.
- `auth/[provider]/callback.ts` — OAuth; signs EIP-712 attestation after confirming account control.
- `_lib/attestor.ts` — EIP-712 attestor signer (ATTESTOR_PRIVATE_KEY, chainId 8453).

## Contracts — certainid-blockchain/contracts
- `UserIdentity.sol` — per-user identity: register, addDocument, 3-pillar binding, social profiles (attested `verifySocialProfile`), `signContent`/`verifyContent`. onlyOwner = smart account.
- `IdentityRegistry.sol` — registry + `attestor` key. `IdentityNFT.sol` — soulbound ERC-721.

## Env vars (Vercel + local .env.production.local)
- Client: `VITE_IDENTITY_REGISTRY_ADDRESS`, `VITE_PIMLICO_API_KEY`, `VITE_ALCHEMY_BASE_URL`, `VITE_SUPABASE_URL/ANON_KEY`, `VITE_FAMILY_API_URL`.
- Server: `ALCHEMY_BASE_URL`, `ATTESTOR_PRIVATE_KEY`, relayer key.

## Gotchas
- Mobile prod build once baked PLACEHOLDER Supabase env → blank screen; fix via `.env.production.local` + prebuilt deploy; verify render every deploy.
- Self-destroying service worker is active (VitePWA `selfDestroying:true`) so stale caches clear.
- NEVER change git commit author (canonical `CertainID Official <certainIDofficial@gmail.com>`) — Vercel Hobby blocks non-canonical.
