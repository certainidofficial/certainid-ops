# TASK-06 — Fix Supabase RLS — CLARIFICATION NEEDED

**Date:** 2026-06-17
**From:** Claude Code
**To:** Cipher / Gandelf7

## Core issue

The brief asks for **wallet-address ownership scoping** via RLS migration SQL, but this is technically impossible with the current architecture (anon key, no Supabase Auth).

## Questions

### 1. How should wallet ownership be enforced without Supabase Auth?

> Brief: "social_profiles UPDATE policy checks wallet_address matches the requesting user's wallet"
> Brief: "An anon client cannot UPDATE another user's social_profiles or signed_content rows"

**Problem:** All clients use the same Supabase anon key. The JWT contains no user-specific claims. RLS policies can only inspect the JWT (`auth.uid()`, `auth.jwt()`) or the row data itself — there is no way for RLS to know *which wallet* is making the request. Every anon client looks identical to Postgres.

The file `supabase-rls-hardening.sql:157-160` already documents this exact limitation:
> "signed_content / social_profiles updates aren't scoped to the owning wallet — anyone can overwrite. Fix: move writes through a backend API that verifies wallet signature before writing."

**Options — which does Gandelf7 prefer?**

| Option | Scope | What it achieves |
|--------|-------|-----------------|
| **A. Move writes to server-side API** | Large — new API endpoints, refactor client calls | Full fix. Server verifies wallet signature (e.g. EIP-712) before writing. Anon key loses direct UPDATE access. This is the "correct" solution. |
| **B. Restrict UPDATE to specific columns only** | Medium — new RLS + Postgres trigger | Partial mitigation. Prevent changing `wallet_address` column on UPDATE (via trigger). Restrict what anon can set. Doesn't prevent cross-user updates but limits damage. |
| **C. Remove anon UPDATE entirely, use service-role API for all writes** | Medium — move `trackContentRevoked` and `trackProfileUnlinked` to server-side endpoints | Eliminates the attack surface by removing anon UPDATE policies. All mutations go through server endpoints that validate the request. |
| **D. Add wallet-signed JWT custom claims** | Large — requires Supabase Auth or custom JWT minting | Allows RLS to check `auth.jwt()->>'wallet'` against row's `wallet_address`. Requires infrastructure changes. |

### 2. What about the OAuth verification write path?

> Brief: "Normal OAuth flow and content signing still work end-to-end"

Currently, `trackProfileVerified` in `useSocialProfiles.ts:112` calls the Supabase client (anon key) to set `is_verified = true`. The existing `social_update` policy `WITH CHECK (is_verified IS NOT TRUE)` already **blocks** this from anon clients. The proof-of-post server endpoint (`api/verify/proof-of-post.ts`) uses the service role key and works fine.

**Question:** Is the client-side `trackProfileVerified` call (for OAuth flow) currently broken, or is there another server-side path I'm not seeing? If we tighten RLS further, we need to ensure verification writes go through a server-side endpoint.

### 3. Should this task be rescoped?

Given the above, the most pragmatic fix that matches the brief's intent would be **Option C**: remove anon UPDATE policies entirely and route the three client-side update calls (`trackContentRevoked`, `trackProfileUnlinked`, `trackProfileVerified`) through server-side API endpoints that use the service role key after validating the request.

This is a larger change than "commit a SQL migration" but it's the minimum viable fix that actually achieves the acceptance criterion "An anon client cannot UPDATE another user's rows."

**If Gandelf7 just wants a quick partial mitigation** (Option B), I can ship that today — but it should be understood that cross-user row modification remains possible.

## Summary

The brief's acceptance criteria require knowing *which wallet* is making the request. With anon key + no Supabase Auth, RLS cannot distinguish between users. Need Gandelf7's call on which option to pursue before I start writing code.
