# COPPA Verifiable Parental-Consent Gate — build spec (pair tomorrow AM)

**Why:** Family Mode protects minors (parent oversees a child's social presence). COPPA
requires **verifiable parental consent** before collecting a child's personal info. Family app
already has parent/child roles, `age_tier` (incl. `under13`), invite + approve flows — but no
formal consent record. This adds it.

**Design (approved by Garry 2026-09-11):** a verified adult IS the consent mechanism.
Parent proves they're a real adult → explicitly consents for the child → child account activates.

## Decision to make first (2 min, tomorrow)
Verification strength for the consent:
- **(A) Alpha-grade:** authenticated parent (Supabase email) ticks an explicit COPPA consent
  statement; we record it (timestamp + method). Ship now, strengthen later.
- **(B) Gold standard:** parent must be a fully ID+biometric-verified CertainID adult before the
  consent counts (cross-app link family↔main identity). Bigger; roadmap.
Recommend **A now, B before public**. Everything below assumes A (B just adds a gate check).

## 1. Schema (Garry runs — family Supabase)
Add to `certainid-family/supabase-migrations.sql` and apply:
```sql
ALTER TABLE family_links
  ADD COLUMN IF NOT EXISTS parental_consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS consent_method text,      -- 'email-attested' | 'certainid-verified'
  ADD COLUMN IF NOT EXISTS consent_parent_ip text;   -- record for the consent audit trail
```

## 2. Family API (the "endpoints" work — pair)
- New/extended endpoint in the family API (`/api/family/consent` or fold into approve):
  `POST { parentId, childId }` → writes `parental_consent_at = now()`, `consent_method`,
  `consent_parent_ip` (from request headers) onto the `family_links` row. Gated to the parent.
- **Enforce:** a child account cannot become `Approved`/active for an `under13`/minor tier
  until the parent-child `family_links` row has `parental_consent_at` set. Block post-approval
  + child activation until consent recorded.

## 3. UI (Claude — certainid-family)
- Consent modal in `ParentDashboard` add-child / approve flow. Required checkbox:
  "I confirm I am the parent or legal guardian of this child, and I consent to CertainID
  collecting and processing my child's information as described in the Privacy Policy
  (certainid.io privacy)." + link. Submit → calls the consent endpoint.
- Show consent status per child in `ChildrenTab` ("Consent recorded ✓ / needed").
- `ChildPage` stays blocked ("waiting for parent") until consent + approval both done.

## 4. Done-when
- A parent cannot activate a minor child without a recorded consent row.
- Consent is queryable (timestamp, method, IP) for the audit trail.
- Privacy Policy already updated (live) with the COPPA children clause pointing here.

Deploy: certainid-family is its own Vercel project (remote `github-family`). Confirm auto-deploy vs manual before shipping.

— claude-code · 2026-09-11 · coppa-spec
