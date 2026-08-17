# CertainID Content Engine — Three Channels, One Schedule

**Owner:** Cipher
**Status:** 🔵 READY — waiting on Garry's go
**Updated:** 2026-08-18

## The Three Channels

### 1. SOCIAL — X + LinkedIn (Blotato)
**Goal:** Brand awareness, waitlist growth, thought leadership

**Weekly cadence (5 posts):**

| Day | Format | Topic | Hook Category |
|---|---|---|---|
| Mon | **Hormozi Hook** | Identity problem | Contrarian |
| Tue | **3 Tips** | Biometrics/security | Listicle |
| Wed | **PAS** | Deepfakes use case | Problem-Agitate-Solve |
| Thu | **Lessons Learned** | Founder/building story | Transformation |
| Fri | **Top Mistakes** | Identity security | Negative Frame |

**Where:** X Mon-Wed, LinkedIn Thu-Fri (LinkedIn needs Blotato reconnected)

### 2. BLOG — certainid.io blog
**Goal:** SEO, authority, long-form explanations

**Weekly cadence (1 post):**
- Sunday — publish blog post
- Monday-Thursday — repurpose blog snippets into social posts

**Blog topic pipeline:**
1. "Why Your Biometrics Should Never Leave Your Phone" (on-device privacy)
2. "The Problem With Centralized Identity" (the wedge)
3. "How Blockchain Verification Actually Works" (technical but accessible)
4. "Deepfakes Are an Identity Problem, Not a Content Problem" (positioning)
5. "Three Granted Patents: What They Mean for Your Privacy" (trust)
6. "Identity Sovereignty: What It Is and Why You Should Care" (philosophical)

### 3. REPURPOSE — Research → Content
**Goal:** Turn external research/scraping into CertainID-selling content

**Workflow:**
```
Find article/research → Extract key insight → 
Frame as identity problem → Add CertainID solution →
Adapt to post format → Schedule via Blotato
```

**Sources to watch:** identity theft stats, deepfake incidents, data breach news, KYC regulation changes, blockchain identity developments

**Example:**
- Source: "5.7M identity fraud cases in 2025"
- Repurpose: Contrarian hook → "Everyone says identity theft is inevitable. It's not. Here's why 5.7M cases happened and how on-device biometrics stops it."

## Weekly Schedule

| Time | Mon | Tue | Wed | Thu | Fri | Sat | Sun |
|---|---|---|---|---|---|---|---|
| Morning | **X: Hormozi** | **X: 3 Tips** | **X: PAS** | **LI: Lessons** | **LI: Mistakes** | Research | **BLOG** |
| Afternoon | Research | Research | Draft blog | Blog edit | Blog final | Repurpose | — |
| Notes | Blotato | Blotato | Blotato | Manual/Blotato* | Manual/Blotato* | Prep next week | Publish |

*LinkedIn needs Blotato reconnected first

## Process

**For EACH post:**
1. Load `blotato-viral-hooks` → pick hook format for the day
2. Load `blotato-post-writer` → draft post with brand voice
3. Adapt for platform (280 chars for X, 3,000 for LI)
4. Show Garry for approval → schedule via Blotato API

**For EACH blog:**
1. Select topic from pipeline
2. Write 800-1,200 words with technical depth + brand voice
3. Include: hook, problem, solution (PAS structure), CTA
4. Publish to certainid.io blog
5. Chop into 3-5 social posts for the following week

**For repurposing:**
1. Scan research (identity news, data breaches, regulation changes)
2. Find the angle that connects to CertainID's solution
3. Frame as social post using the day's format
4. Add to content bank

## Files

- Brand brief: `/Cipher/brand-brief.md`
- Content bank: Google Sheets (link TBD — Garry's preference)
- Drafts: `/Marketing/` folder in vault
- Published: certainid.io/blog (Claude Code deploys)

## Ready State

| Channel | Status | Blockers |
|---|---|---|
| X posts | ✅ Ready — Blotato connected | None |
| LinkedIn posts | ⏸️ Paused | Blotato LinkedIn needs reconnect |
| Blog | ✅ Ready | Need Garry to approve first topic |
| Repurposing | ✅ Ready | Need to define RSS/news sources |

**To go live:** Garry says "go" → I start Monday with the first Hormozi hook post.