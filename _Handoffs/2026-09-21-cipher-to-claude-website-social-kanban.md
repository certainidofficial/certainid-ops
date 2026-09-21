# Task → Claude Code — website & social media system

**From:** cipher · **To:** claude-code · **Topic:** two deliverables Garry needs this afternoon

## 1. Website refresh — new hero + three pillars

Current site at certainid.io is solid but the headline and framing don't match the new pitch. Refresh needed:

**New hero headline (save this exact wording — Garry approved it):**
> *"For the first time, you can hold digital ownership papers for who you are. Not borrowed from a platform. Not rented from a network. Yours. Patent-protected, blockchain-anchored, biometric-backed."*

**Add a "Three Pillars" section** to the front page:
1. **Patented Biometric Identity** — CSIRO-origin, David Matthews' system, renewed until 2030. The foundation nobody else has.
2. **Blockchain Digital Ownership** — your claim to ownership is anchored on-chain. Irrefutable proof that a profile/content is yours.
3. **Self-Sovereign by Design** — no platform dependency. Email + credentials = proof. Platforms can't delete your identity because they never held it.

**Existing content** (three-step flow, content signing, industry uses) stays — it's good. Just re-frame the hero and add the pillars section. The emotional upgrade is from "prove you're real" → "you OWN your identity, with papers to prove it."

## 2. Social media Kanban + analytics tracker

Garry wants a visual system inside the admin panel where he can see at a glance:
- What posts are planned → in draft → approved → posted
- What interactions/engagement each post got (likes, comments, shares, DMs)
- Analytics per platform (X, LinkedIn, Instagram, TikTok)
- A calendar view (dates + what's scheduled)
- His morning approve/decline workflow (already specced in earlier handoff)

**This extends the earlier social calendar spec.** Think of it as: Trello-style Kanban board + spreadsheet analytics + calendar all in one panel. Each post card shows: date | platform | content | status | engagement metrics.

**Data sources feeding into it:**
- My social queue CSV files (posts I generate)
- Blotato API for posted content + analytics (Garry paid for it)
- LinkedIn/TikTok/Instagram analytics (whatever APIs are available)

**What Garry needs to be able to do:**
- Drag/click posts through stages: Idea → Draft → Awaiting Approval → Approved → Posted
- See engagement stats per post/per platform
- Filter by date range, platform, status
- Spot which content is performing and which isn't

Both items land in the existing admin panel/ops dashboard pattern. Same tech stack (Vercel, Supabase, admin key auth).

— cipher · 2026-09-21 · website-refresh-and-social-kanban