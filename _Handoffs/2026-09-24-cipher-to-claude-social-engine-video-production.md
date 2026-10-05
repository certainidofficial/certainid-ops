# Handoff → Claude Code — Social media engine + avatar video production

**From:** cipher · **To:** claude-code · **Urgency:** high · **Topic:** Build the social media engine and video production pipeline

---

## 1. Avatar Video Production Pipeline (fal.ai + avatar tool)

Garry has a **fal.ai** API key and wants to produce a **15–30 second avatar video** to introduce CertainID. The video uses an AI avatar (looks real but futuristic) — not Garry's face. He mentioned "Nano Banana" (nanobanana) or similar avatar generation tools that integrate with fal.ai.

### Script (Garry-approved)
```
"Digital ownership is getting harder. Deepfakes, impersonation, platforms
that control your identity.

CertainID took a different approach — putting ownership back in your hands.

Your data never leaves your device. Only a hash hits the blockchain.
You hold the title deed to who you are and what you create.

Digital ownership papers. Not borrowed. Not rented. Yours."
```

### What to build
1. A pipeline that takes a script, generates an avatar video via fal.ai
2. Configurable avatar style ("real but futuristic"), background, length (15s/30s)
3. Output formats for X, LinkedIn, TikTok (optimized for each)
4. Garry should be able to iterate: new script → new video without manual rework

### fal.ai API key
Key: `fal_sk_8bdab2e1df7c4ddfbe806e14b1722d73:0590755041b7154c25b6d9b1c1c87e14`
Garry gave it to Cipher for relay. Set it as a Vercel env var (`FAL_API_KEY` or `FAL_KEY`) so the backend can use it. Tested — key is active, 100+ models available.

### Available fal.ai models for the pipeline
These are confirmed working with the key:

**Base image generation (create the avatar look):**
- `fal-ai/nano-banana-2` or `fal-ai/nano-banana-pro` — text-to-image for generating the avatar/base image
- Style prompt: "realistic professional presenter, futuristic style, clean background, photorealistic"

**Video / avatar animation:**
- `fal-ai/kling-video/ai-avatar/v2/standard` — **Kling AI Avatar v2** → creates avatar videos with realistic humans. Best fit for the "digital avatar" requirement.
- `fal-ai/sync-lipsync/v3` — sync-3 Lipsync → professional quality mouth sync with audio
- `minimax/h3-max/lip-sync/image-to-video` — H3 Max Lip Sync → takes an image + audio, generates talking video
- `fal-ai/bytedance/omnihuman/v1.5` — Omnihuman → video from a human image
- `bytedance/seedance-2.5/image-to-video` — 30-second clips at 720p

**Recommended pipeline:**
1. Nano Banana 2 → generate base avatar image (futuristic presenter)
2. Kling AI Avatar v2 OR H3 Max Lip Sync → animate with TTS audio of the script
3. Output in 9:16 vertical for TikTok/Reels + 16:9 horizontal for X/LinkedIn

---

## 2. Social Calendar Panel (in the admin panel)

Garry wants a **social media calendar view** inside the existing admin panel at `ops.html` or a new section in `admin.html`.

### Requirements
- **Calendar grid view** — posts scheduled across days/weeks, filterable by platform (X, LinkedIn, Instagram)
- **Each row shows**: date/time, platform icon, post copy preview, status (draft/scheduled/published)
- **Approve/decline button per row** — Garry opens the panel in the morning, sees upcoming posts, approves or declines them. Takes 5 minutes.
- **Draggable** — move posts between dates to reschedule
- **Stats overlay** — engagement per post after published (likes, replies, reposts)

### Data source
- Blotato API runs locally at `http://127.0.0.1:18711`
- X account: 18233 (via CertainI82137)
- LinkedIn account: 21164 (via Garry's profile)
- TikTok account: 49476 (certainid)
- We haven't set up Instagram on Blotato yet — note until we do

---

## 3. DM / Engagement Inbox

Garry needs a **unified inbox** in the admin panel that shows DMs, mentions, and replies across platforms, so he can see what's happening without logging into each platform separately.

### MVP
- List of recent DMs and mentions from X and LinkedIn
- Status: unread / read / replied
- Reply from the panel (at least to X, which we have posting access to)
- Later: Instagram and TikTok

---

## 4. Foundational — What's already built at `app.certainid.io`

### Admin panel (`/admin.html`)
- Waitlist signup → approve (auto-sends welcome email via Resend) → block → GDPR delete
- Newsletter broadcast tool (Resend, audience segmented, HMAC unsubscribe)

### Ops dashboard (`/ops.html`)
- 5 cards: Briefing, Action Items, System Health, Social Pulse, Waitlist
- Currently empty — waiting for `OPS_INGEST_SECRET` env var to be set in Vercel so cipher can push data into it

### Blotato integration
- v2 API via local proxy at `127.0.0.1:18711`
- Posting via `POST /v2/posts` with body: `{"post":{"accountId":N, "content":{...}}}`
- Post submission returns `postSubmissionId`

### Social analytics (`/social.html`)
- Per-account analytics display (currently shows zeros — no engagement yet)

---

## What needs to happen

1. **Set OPS_INGEST_SECRET** — Garry needs to run `npx vercel env add OPS_INGEST_SECRET production` once (asks him for the value; he sets it) so cipher's data feed works
2. **Build the social calendar panel** — in admin.html or ops.html
3. **Build the avatar video pipeline** — fal.ai + avatar tool integration
4. **Build the unified DM inbox** — starting with X and LinkedIn
5. **Wire the social calendar** to Blotato's posting API so approvals actually fire posts

---

— cipher · 2026-09-24