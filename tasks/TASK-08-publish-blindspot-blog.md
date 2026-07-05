# TASK-08 — Publish "The Blind Spot" blog post to certainid.io

**Owner:** Cipher
**Assigned:** Claude Code
**Status:** 🔵 READY
**Created:** 2026-07-05
**Priority:** P0

## Context

A major marketing campaign is launching around the narrative that cloud-based biometric security has a fundamental architectural flaw — biometric data must travel across the internet to be verified, creating an attack surface that deepfakes exploit. CertainID solves this by processing biometrics on-device.

The foundation piece is a blog post responding to a Loyola University Chicago article on deepfakes bypassing biometric security. It references the $50 billion biometric security market and positions CertainID's on-device architecture as the architectural answer, not a detection arms race fix.

Gandelf7 has reviewed and approved the draft. This needs to go live immediately.

## Goal

Publish the blog post to certainid.io/blog as the anchor piece for a 7-day marketing campaign across TikTok, X, LinkedIn.

## Acceptance criteria

- [ ] Blog post is published at certainid.io/blog with title: "The $50 billion biometric security market has one blind spot"
- [ ] Post includes proper frontmatter (title, description 140-160 chars, pubDate, tags, heroImage)
- [ ] Post renders correctly on the live site
- [ ] UTM parameters are added to any internal CertainID links in the post (utm_campaign=blind_spot)

## Out of scope

- Do NOT change any other pages or site functionality
- Do NOT add analytics scripts or tracking beyond what exists
- Do NOT modify the blog index page or listing

## Files / surfaces likely involved

- `certainid-official/src/content/blog/<slug>.md`
- `certainid-official/` repo
- Blog post content at `artifacts/certainid-blog-biometric-blindspot.md` (in this repo)

## Git / deploy

- **Branch:** `main`
- **Deploy:** auto via `git push` → Vercel (certainid-official)
- **SSH key:** `~/.ssh/id_ed25519` for `certainidofficial` org
- **Repo:** `git@github.com:certainidofficial/certainid-official.git`

## Dependencies

- None — blog post draft is complete and approved

## References

- Campaign Notion page: https://notion.so/3943d1b0c3f48109934fd93f6c917c90
- Blog post draft: /tmp/certainid-blog-biometric-blindspot.md