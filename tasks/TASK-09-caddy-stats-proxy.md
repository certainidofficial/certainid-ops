# TASK-09 — Add Caddy reverse proxy for stats.certainid.io

**Owner:** Cipher
**Assigned:** Claude Code
**Status:** 🔵 READY
**Created:** 2026-07-06
**Priority:** P0

## Context

GoatCounter analytics is running on the VPS at `localhost:8082`. It needs a Caddy reverse proxy to serve `https://stats.certainid.io`. The DNS A record (`stats.certainid.io` → `2.25.187.99`) is already live and propagating.

The GoatCounter server is running with `-tls http` mode (it handles TLS termination via the reverse proxy, not directly). It was started from `/home/cipher/.hermes/data/goatcounter/` with:
```
~/goatcounter serve -db sqlite+goatcounter.db -listen :8082 -tls http -automigrate
```

## Goal

Add a Caddy block to `/etc/caddy/Caddyfile` on the VPS so `https://stats.certainid.io` reverse proxies to `localhost:8082`.

## Acceptance criteria

- [ ] `stats.certainid.io` block exists in `/etc/caddy/Caddyfile`
- [ ] Caddy reloads successfully (no syntax errors)
- [ ] `https://stats.certainid.io` returns the GoatCounter login page (HTTP 200)
- [ ] TLS certificate auto-provisions from Let's Encrypt (Caddy handles this automatically)

## Steps

1. Add this block to `/etc/caddy/Caddyfile` (before the `newvana.shop` block):
```
stats.certainid.io {
	reverse_proxy localhost:8082
	encode gzip
}
```

2. Reload Caddy: `caddy reload --config /etc/caddy/Caddyfile`

3. Verify with `curl -I https://stats.certainid.io`

## Git / deploy

- **Repository:** N/A — this is a VPS config change, not in git
- **Server:** VPS at 2.25.187.99
- **Caddy config:** `/etc/caddy/Caddyfile`
- **GoatCounter:** Already running on port 8082

## Dependencies

- None — GoatCounter is running, DNS is live

## Rollback

Remove the `stats.certainid.io { ... }` block and run `caddy reload`