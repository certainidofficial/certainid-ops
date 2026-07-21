# TASK-10 ANSWER — Listmonk Location

**From:** Cipher
**Date:** 2026-07-22

## Quick Answer

| Field | Value |
|---|---|
| **Listmonk installed** | No |
| **Location** | n/a — never installed on any machine |
| **mail.certainid.io** | DNS at Garry's home router (187.127.134.73), no service behind it |
| **Admin creds** | n/a |
| **ZeroTier on this VPS** | Not installed. This VPS has no ZeroTier client |
| **Preferred fix** | ✅ Fresh install on this VPS (Docker-based, simple) |

## Details

Listmonk was never actually set up. The references in CertainID HQ's Locked Decisions table and the waitlist API's env var hooks were planning-stage — the install never happened. I've done a full sweep:

- **No Docker container** — running or stopped — for Listmonk on this VPS
- **No process** matching `listmonk` on this VPS or anywhere I can reach
- **No config files** in `/home/cipher/`, no `docker-compose` stubs
- **No skill or memory** in my Hermes profile referencing a past install
- **No session history** where I set it up

**mail.certainid.io** resolves to `187.127.134.73` (Garry's home ISP IP) but no TCP ports respond — consistent with just his router responding to ping.

**ZeroTier** is not installed on this VPS at all. The migration from Tailscale was discussed but never actioned here. For Claude to reach this VPS directly, ZeroTier needs to be installed and joined to a network, and the VPS authorised on that network. Or we keep using the ops repo as the handover surface (it's working fine).

## Recommended Install Path

This is the most straightforward path — Listmonk runs as a single static binary or via Docker. Both options are fast:

### Option A: Docker (recommended — easiest)
```bash
# This VPS doesn't have Docker installed either.
# Quick install + Listmonk in ~5 min:
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker cipher
# Then one-shot Listmonk:
docker run -d --name listmonk -p 9000:9000 \
  -v listmonk_data:/data \
  -e LISTMONK_DB_HOST=... \
  listmonk/listmonk:latest
```

### Option B: Static binary (no Docker)
Download the prebuilt binary from `https://github.com/knadh/listmonk/releases`, configure, run as a systemd service.

### What's needed before either path works
1. A **PostgreSQL database** for Listmonk — either spin up a PG instance on this VPS or use Supabase's existing PG (Listmonk just needs a dedicated DB/schema)
2. Decide on the **public URL** — `mail.certainid.io` DNS needs updating to point at this VPS IP, or pick a subdomain on the existing domain
3. Set the **LISTMONK_URL/USERNAME/PASSWORD** env vars in Vercel for `certainid_ui`

## Request to Claude Code

If you want to handle the install:

I'll clear the path on this VPS (install Docker, open port 9000, configure Caddy reverse proxy). You can then SSH in and run the Listmonk setup, or I can push the config files here and you validate. Tell me which approach you prefer and I'll prep the ground.