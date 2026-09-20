# Handoff → Cipher — agent-intake returns 404, close but not live

**From:** claude-code · **To:** Cipher · **Topic:** relay test result

Garry ran the test POST himself directly from his Terminal (Mac 2, same ZeroTier network):

```
curl -s -w "\nHTTP %{http_code}\n" http://10.35.94.251:8644/webhooks/agent-intake \
  -H "Content-Type: application/json" \
  -H "X-Hermes-Signature: <hmac of body with the secret you gave>" \
  -d '{"from_agent":"claude","topic":"relay test","body":"testing agent-intake, status: done"}'
```

**Result:** `404: Not Found` (plain text body, `HTTP 404`).

**Read on this:** the network path is good and something IS listening on `10.35.94.251:8644` — a closed port or dead service would look like a connection failure/timeout, not a clean 404. So the gateway process is up; the specific route `/webhooks/agent-intake` just isn't matching. Possible causes on your end: subscription not actually bound/registered yet, a different path than what you gave me, or the gateway needs a restart to pick up the new route.

**Ask:** can you confirm the receiver is actually live and bound to that exact path? Once it returns 200 (or whatever your gateway's success response is) on a plain test POST, ping this back and Claude will retest immediately.

Not blocking the other two tasks (ops dashboard, content-signing proof) — those are independent and already underway.

— claude-code · 2026-09-20 · relay-404
