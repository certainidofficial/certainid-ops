# TASK-13 — Skillify All Processes — DONE

**Completed:** 2026-08-25
**By:** Claude Code
**Time elapsed:** ~20 minutes from brief to push

## What shipped

6 Claude Code skills created as .claude/skills/<name>/SKILL.md in certainid-mvp (commit `cde12a4`):

| Skill | Description |
|-------|-------------|
| supabase-webhook | Supabase DB webhook or Edge Function to forward waitlist INSERTs to Cipher's VPS (10.35.94.251:8080) |
| app-deploy | Full deploy runbook: typecheck, build, deploy-ui.sh, post-deploy verification, rollback |
| schema-migration | Supabase table/column/RLS creation and modification patterns |
| design-system-rollout | Approved design tokens (light/glassmorphic) with 3-step rollout order from DESIGN-SYSTEM.md |
| e2e-test | Full alpha test flow: connect wallet, enrol, verify social, sign content, scan/verify on-chain |
| blog-publish | Astro content collection workflow for certainid-official blog posts |

All 6 skills are now visible in Claude Code's skill list and invocable via /supabase-webhook, /app-deploy, etc.

## Acceptance criteria — verified?

- [x] Each process has a SKILL.md with YAML frontmatter (name, description, allowed-tools)
- [x] Each skill contains inline code/commands that execute the process
- [x] Cron: none of these 6 are recurring jobs, so no cron needed
- [x] Skills appear in Claude Code's runtime skill list (confirmed by system-reminder output)

## Deployment status

- **Built:** N/A (skills are .md files, no build needed)
- **Typecheck:** ✅ (npx tsc --noEmit passed clean)
- **Deployed to production:** ✅ Pushed to main (commit cde12a4). Skills are local to .claude/ — no Vercel deploy needed.
- **Smoke tested:** ✅ All 6 skills appear in Claude Code's available skills list

## What broke / surprises

None. Clean execution.

## Decisions made

1. **No separate script files.** Each skill is a self-contained SKILL.md with inline code blocks rather than separate .sh/.ts files. This matches the existing skill pattern in the repo (gstack skills are all single SKILL.md files).

2. **Supabase webhook: two options presented.** Option A (Database Webhook via pg_net) is preferred since it requires no code deployment. Option B (Edge Function) is provided as fallback if the VPS's private IP (10.35.94.251) isn't reachable from Supabase's pg_net.

3. **Design system tokens pulled from certainid-ops/Dev/DESIGN-SYSTEM.md.** The rollout order follows the spec: tokens first, marketing site second (lower risk), app third (higher risk, screen-by-screen with flow re-verification).

4. **Blog publish skill references certainid-official repo** with the correct SSH key (id_ed25519_family, not id_ed25519).

## What's next / follow-ups

- The Supabase webhook is documented but not yet wired — requires Cipher's VPS receiver to be running before setup.
- Design system rollout is documented but not executed — this is a separate task per the DESIGN-SYSTEM.md spec.
- Consider adding a /council skill that Cipher can reference for cross-agent coordination.

## Files changed

```
.claude/skills/supabase-webhook/SKILL.md
.claude/skills/app-deploy/SKILL.md
.claude/skills/schema-migration/SKILL.md
.claude/skills/design-system-rollout/SKILL.md
.claude/skills/e2e-test/SKILL.md
.claude/skills/blog-publish/SKILL.md
```
