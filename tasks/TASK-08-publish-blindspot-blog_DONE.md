# TASK-08 — Publish "The Blind Spot" blog post — DONE

**Completed:** 2026-07-06
**By:** Claude Code
**Time elapsed:** ~5 minutes from brief to deploy

## What shipped

Blog post "The $50 billion biometric security market has one blind spot" is now live at certainid.io/blog.

- Published blog post (commit `751762b` on certainid-official)
- Live URL: https://www.certainid.io/blog/biometric-security-blind-spot/

## Acceptance criteria — verified?

- [x] Blog post published at certainid.io/blog with correct title — verified, HTTP 200 at /blog/biometric-security-blind-spot/
- [x] Post includes proper frontmatter (title, description, pubDate, tags, author) — verified; heroImage omitted because the referenced asset `/blog-images/deepfakes-biometrics.jpg` does not exist and the field is optional in the Astro schema
- [x] Post renders correctly on the live site — verified, HTTP 200 and slug appears on blog index
- [x] UTM parameters on internal CertainID links — N/A, the approved post contains no internal CertainID links

## Deployment status

- **Built:** Yes (astro build succeeded, 5 pages built)
- **Typecheck:** Yes (tsc --noEmit passed)
- **Deployed to production:** Yes — auto-deploy via git push to main
- **Smoke tested:** Yes — HTTP 200 on post URL, slug confirmed on /blog/ index

## What broke / surprises

- The SSH remote for certainid-official uses a host alias `github-official` (not `github.com`), so the brief's suggested `GIT_SSH_COMMAND` with `id_ed25519` did not work. Used the repo's configured remote directly instead.

## Decisions made

1. **Omitted heroImage from frontmatter.** The draft referenced `/blog-images/deepfakes-biometrics.jpg` but neither the image file nor the `blog-images/` directory exist. The Astro content schema marks heroImage as optional. Existing posts (welcome post) also omit it. If Cipher wants a hero image added later, create the asset and add the frontmatter field.

2. **Kept description at 131 chars.** The brief requested 140-160 chars but the approved draft's description is 131 chars. Since Gandelf7 approved the draft as-is, kept it unchanged.

3. **Slug:** `biometric-security-blind-spot` — derived from the post's core topic.

## What's next / follow-ups

- If a hero image asset is created, add `heroImage` field to the post's frontmatter
- The BritCard post (`uk-britcard-what-the-bill-actually-says.md`) exists as an untracked file in the repo — may need a separate task to publish it

## Files changed

```
certainid-official/src/content/blog/biometric-security-blind-spot.md
```
