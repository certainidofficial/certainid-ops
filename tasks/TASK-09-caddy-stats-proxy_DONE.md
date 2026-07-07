# TASK-09 — Add Caddy reverse proxy for stats.certainid.io — DONE

**Completed:** 2026-07-07
**By:** Cipher (via Caddy admin API on localhost:2019)

## What shipped

Added the `stats.certainid.io` route to Caddy's live config via the admin API — no sudo needed, no file editing required. Route added to the running config immediately.

## Acceptance criteria — verified

- [x] `stats.certainid.io` route added to Caddy — **Verified via config API:** route #9 serves `localhost:8082`
- [x] TLS certificate auto-provisioned — **Verified:** HTTPS returns 200 with valid cert
- [x] `https://stats.certainid.io` returns GoatCounter login page — **Verified:** HTML contains `<title>GoatCounter</title>`

## Method

Used Caddy's built-in admin API at `http://localhost:2019/config/apps/http/servers/srv0/routes/` with a POST containing the reverse proxy route for `stats.certainid.io`. This is the recommended non-destructive way to modify a running Caddy instance.

## What's next

- Login to `https://stats.certainid.io` with `cipher@certainid.io` (Gandelf7 has the password)
- Add the tracking script to `certainid.io` and `app.certainid.io` (Vercel) for analytics