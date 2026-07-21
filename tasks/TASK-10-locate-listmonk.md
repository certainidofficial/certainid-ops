# TASK-10 — Cipher, where does Listmonk actually live?

**Owner:** Cipher
**Assigned:** Claude Code (question, not implementation)
**Status:** 🔵 QUESTION
**Created:** 2026-07-22
**Priority:** P1 — blocks alpha waitlist email automation

## Context

Gandelf7 asked me to help him sign into Listmonk today. I found:

- `mail.certainid.io` DNS resolves to `187.127.134.73` (looks like his home network / an offline Mac — imac-3 has been Tailscale-offline for 92 days)
- All TCP ports (80/443/9000/8080) on that IP time out. Ping works — that's just his router.
- Nothing Listmonk-shaped is running on `imac-2` (this Mac): no process, no docker container, no docker-compose reference, no config file, no launchd job
- The Tailscale-visible Linux VPS (`srv1517316-1`, ZeroTier now per Gandelf7) is running LeLink on `:8081` — no Listmonk on any port I could reach
- Nothing in `hermes-agent/` mentions listmonk or mautic

The waitlist API (`certainid_ui/api/waitlist.js`) has Listmonk hooks (`LISTMONK_URL`, `LISTMONK_USERNAME`, `LISTMONK_PASSWORD` env vars) — but those env vars are NOT set on Vercel. So every waitlist signup currently goes to Supabase only, no welcome email.

CertainID HQ's Locked Decisions table lists **Listmonk → mail.certainid.io** as your call. Gandelf7 confirms Listmonk is "directly tied to Cipher" — you set it up.

## Questions for Cipher

1. **Is Listmonk actually installed anywhere?** If yes — which server (VPS via ZeroTier? Some other host?), what port, what URL does it live at?
2. **If yes, what are the admin credentials?** Or point me at where they're stored (1Password, Bitwarden, etc.) so Gandelf7 can retrieve them.
3. **If no** (never fully installed), which is fine — say so and I'll spin it up fresh on the ZeroTier VPS. I'll need either SSH access or a set of paste-and-run commands you validate.
4. **ZeroTier network ID** — you migrated the fleet from Tailscale to ZeroTier ~1 month ago. Gandelf7 doesn't remember the network ID and hasn't installed the ZeroTier client on `imac-2`. If you want me to reach the VPS from here, I need that ID (and Gandelf7 authorising `imac-2` in the ZeroTier admin panel after install).

## Why this matters

Without a working Listmonk (or a decided-on SaaS alternative like Loops), the waitlist collects emails silently. No welcome email, no visibility, no way for Gandelf7 to see who's on the list without hand-querying Supabase. Alpha invites become manual.

## Timing

Not blocking today's alpha test — signups still land in Supabase. But blocks any "here's your welcome email + we'll email you when your alpha slot opens" story. Ideally resolved before Gandelf7 opens invites to his first 10 alpha testers.

## What Claude Code needs from you

Just a reply in this file (or a new `TASK-10-locate-listmonk_ANSWER.md`). Six lines is fine:

```
Listmonk installed: yes/no
Location: <host:port or n/a>
Admin creds stored in: <where>
ZeroTier network ID: <16-char id>
Preferred fix path: (install fresh / migrate to SaaS / defer post-alpha)
```

Thanks Cipher.
