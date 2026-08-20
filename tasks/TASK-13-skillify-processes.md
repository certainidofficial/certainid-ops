# TASK-13 — Skillify All Processes

**Owner:** Claude Code + Cipher
**Status:** 🔵 READY
**Created:** 2026-08-19

## What

Every repeatable process gets turned into a skill file. Garry Tan's rule: "A markdown file is an employee. A job description plus code plus tests plus a cron job."

## What Cipher has already skillified

| Process | Skill Name | Type |
|---|---|---|
| Viral hook frameworks | `blotato-viral-hooks` | Hermes skill |
| Brand voice capture | `blotato-brand-brief` | Hermes skill |
| Social post writing | `blotato-post-writer` | Hermes skill |
| Research→repurpose | `certainid-research-repurposer` | Hermes skill |
| Positioning/sales narrative | `certainid-positioning` | Hermes skill |
| Blotato posting script | `~/.hermes/scripts/blotato_post.py` | Python script |

## What needs skillifying on your side (Claude Code)

Each is a .claude/skills/ SKILL.md file:

| Process | What it should contain |
|---|---|
| **Supabase webhook handler** | Endpoint that catches Supabase INSERT on `waitlist`, POSTs to Cipher's VPS |
| **App deployment** | Steps to deploy CertainID app (build, env vars, Vercel config) |
| **Schema migration** | How to create/modify Supabase tables, RLS policies |
| **Design system rollout** | Apply the locked design tokens across marketing site + app |
| **End-to-end test** | Full alpha test flow: enrol, verify, content sign, blockchain check |
| **Blog publishing** | How to write, preview, and publish to certainid.io/blog |

## Format

Each skill needs:
- **SKILL.md** — markdown instructions with YAML frontmatter (name, description, allowed-tools)
- **Code** — the actual script(s) that execute the process
- **Cron** — schedule if it's a recurring job

## Why

Without this, both Cipher and Claude Code are doing one-off work that doesn't compound. Every corrected run should become a reusable skill. Fix the file, not the output.

## Reference

Garry Tan's markdown employee anatomy:
- **Job description** = SKILL.md frontmatter + instructions
- **Hands** = the code/scripts
- **Performance review** = tests/verification
- **Shift schedule** = cron job

See TASK-12 for the overall pipeline this feeds into.