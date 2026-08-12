# Cipher — AI Agent Architecture & Reference

**Agent:** Cipher (6 letters, gender-ambiguous, cryptography/mystery roots)
**Purpose:** AI agent for **Certain ID** — digital identity platform (on-device biometrics + blockchain + NFT)
**Platform:** macOS 15 (Sequoia) — runs as a `launchd` service on Mac 2 (garrys-imac-2)
**Last updated:** 31 May 2026

---

## 1. System Architecture

```
 Telegram DM (@Cippher_Bot)
         |
    cipher_bot_v4.py  ←  Telegram polling (python-telegram-bot)
         |
    +----+----+
    |         |
    LLM      MCP Client (cipher_mcp_client.py)
(OpenRouter)    |
  DeepSeek    +-- X-MCP server (Node.js, 19 tools)
  V4 Flash    |
              +-- LinkedIn-MCP server (Python, 87 tools → 42 exposed)
```

**Flow per message:**
1. User messages @Cippher_Bot on Telegram
2. Bot sends message + 42 function definitions to OpenRouter (DeepSeek V4 Flash)
3. LLM decides if a tool should be called (post, search, message, etc.)
4. Bot receives tool call → routes to X-MCP or LinkedIn-MCP via MCP client
5. Tool result sent back to LLM for final response
6. Final response sent back to Telegram

---

## 2. File Locations

All under `/Users/certainid/` on Mac 2 (10.35.94.2):

### Core Bot Files
| File | Purpose |
|------|---------|
| `cipher_bot_v4.py` | Main Telegram bot — version 4 with MCP tool calling |
| `cipher_mcp_client.py` | MCP client — spawns both servers, JSON-RPC protocol, tool routing |
| `run-cipher.sh` | Shell script that launches the bot (env setup + exec) |
| `cipher.env` | Environment variables (Telegram token, OpenRouter key, Chat ID) |

### Legacy Files (still on disk, not in use)
| File | Purpose |
|------|---------|
| `cipher-bot.py` | v3 bot — had Google access but no MCP tools |
| `mcp-bridge.py` | Early MCP test harness — superseded by `cipher_mcp_client.py` |
| `cipher-google-auth.py` / `2` / `3` | Google OAuth setup scripts (one-shot) |
| `cipher-google-test.py` | Test script for Google API access |

### Log Files
| File | Purpose |
|------|---------|
| `cipher.log` | stdout — bot startup, MCP init, Telegram polling |
| `cipher.err` | stderr — errors, HTTP request logs, Telegram getUpdates |

### Launchd Service
| File | Purpose |
|------|---------|
| `~/Library/LaunchAgents/com.certainid.cipher.plist` | launchd plist — auto-start, keep-alive |

### Python Virtual Environment
| Path | Purpose |
|------|---------|
| `/Users/certainid/cipher-env/` | Python 3.13 venv with all dependencies |
| Activate: `source ~/cipher-env/bin/activate` |

Key packages: `python-telegram-bot`, `httpx`, `google-api-python-client`, `fastmcp`, `linkedin-mcp`, `playwright`

---

## 3. Services & Credentials

### Telegram
- **Bot:** @Cippher_Bot
- **Token:** Stored in `cipher.env` as `TELEGRAM_BOT_TOKEN`
- **Allowed chat:** Garry's DM (ID: 1312136511)
- **API:** `python-telegram-bot` v22.7 — long-polling mode

### OpenRouter (LLM)
- **Model:** `deepseek/deepseek-v4-flash` (free tier)
- **Key:** Stored in `cipher.env` as `OPENROUTER_API_KEY`
- **Endpoint:** `https://openrouter.ai/api/v1/chat/completions`
- **Referer:** `https://certainid.io`
- **Function calling:** Yes — 42 tool definitions passed as `tools` parameter

### X/Twitter (x-mcp)
- **Server:** `/Users/certainid/Documents/App_dev/x-mcp/` — Node.js MCP server
- **Binary:** `/usr/local/bin/node dist/index.js`
- **Credentials:** API key/secret + access token/secret + bearer token (stored in Claude's MCP config, not env file)
- **Tools available:** 19 (create_tweet, search_tweets, get_user, send_dm, get_mentions, get_user_timeline, get_trends, get_user_followers, etc.)

### LinkedIn (linkedin-mcp)
- **Server:** `/Users/certainid/Documents/App_dev/linkedin-mcp/` — Python MCP server (v0.2.0)
- **Binary:** `.venv/bin/python -m linkedin_mcp.main`
- **Auth method:** OAuth (client ID/secret) + browser session cookies
- **Session cookies:** Stored in `~/.linkedin-mcp/browser-session/session.json` and `data/session_cookies.json`
- **OAuth credentials:** `86iyxdjr7u50w3` / `WPL_AP1.*` (in `.env` and Claude MCP config)
- **Database:** `data/linkedin_mcp.db` (SQLite — caches profiles, posts, analytics)
- **Total tools:** 87 — 42 exposed as priority (create_post, send_message, search_people, get_feed, get_my_profile, get_conversations, etc.)
- **Browser:** Uses headless Playwright Chromium for DM/messaging (LinkedIn blocks Python HTTP clients)

### Google OAuth
- **Account:** `certainidofficial@gmail.com`
- **Scopes:** gmail.readonly, drive.readonly, sheets, documents
- **Client credentials:** `~/.google-credentials.json`
- **Refresh token:** `~/.google-token.json`
- **Status:** Token acquired, Gmail and Drive verified, Sheets/Docs pending endpoint validation

### GitHub (read-only)
- **Token:** Fine-grained PAT — Contents: Read-only
- **File:** `~/.git-credentials`
- **Repos cloned:**
  - `certainid-chat` — Chat component
  - `certainid-family` — Family plan
  - `certainid-official` — Official site (renamed from `certainid-holding-page`)
- **MVP repo:** NOT cloned (explicitly excluded)

### Obsidian Vault
- **Path:** `~/Documents/CertainID-Vault/`
- **Structure:**
  ```
  CertainID-Vault/
    INDEX.md
    Cipher/
      soul.md       — Purpose, core mission
      identity.md   — Who Cipher is
      personality.md — Voice, tone, constraints
    Resources/
      video-matt-wolfe-ai-second-brain.md
    SecondBrain/
      INDEX.md      — Master index
      config.md     — Processing instructions
      wiki/         — Processed knowledge
      crm/          — People met
      journal/      — Daily entries
      raw/          — Ingest zone
    repos/          — Cloned GitHub repos
    Dev/
    Marketing/
    Research/
  ```

---

## 4. MCP Client (`cipher_mcp_client.py`)

**Class:** `CipherMCPClient`

**Lifecycle:**
```
client = CipherMCPClient()
await client.start()        # Starts both servers + populates tool list
tools = client.get_openai_tools()   # Returns OpenAI-compatible tool defs
result = await client.call_tool("x_create_tweet", {"text": "hello"})   # Routes by prefix
await client.close()        # Terminates both server processes
```

**Tool routing convention:**
- `x_<toolname>` → routes to X-MCP server
- `li_<toolname>` → routes to LinkedIn-MCP server

**Priority LinkedIn tools (42 total):** create_post, create_image_post, send_message, reply_to_conversation, search_people, get_feed, get_my_profile, get_conversations, get_profile_posts, create_comment, create_reaction, get_network_stats, send_connection_request, search_companies, search_content, get_profile_views, get_my_posts, get_post_reactions, get_post_analytics, get_user_post_analytics, get_invitations, reply_invitation, get_comments_official

---

## 5. Bot Lifecycle

### Startup sequence
1. `run-cipher.sh` sources `cipher.env`, activates venv, execs `cipher_bot_v4.py`
2. Bot starts both MCP servers (takes ~10-15s)
3. Bot verifies both servers responded to `initialize` handshake
4. Bot lists all tools → caches as OpenAI function definitions
5. Bot starts Telegram polling — ready for messages

### Shutdown / Restart
```bash
# Stop
launchctl bootout gui/$(id -u certainid)/com.certainid.cipher

# Start
launchctl bootstrap gui/$(id -u certainid) /Users/certainid/Library/LaunchAgents/com.certainid.cipher.plist

# Check status
launchctl list | grep cipher

# View logs
tail -f /Users/certainid/cipher.err
tail -f /Users/certainid/cipher.log
```

### Auto-restart
The `launchd` plist has `<KeepAlive>true</KeepAlive>` — if the bot crashes, launchd restarts it automatically within seconds.

---

## 6. Current Tool Counts

| Source | Total Tools | Exposed as Functions |
|--------|-------------|---------------------|
| X-MCP | 19 | 19 (all) |
| LinkedIn-MCP | 87 | 23 (priority) |
| **Total** | **106** | **42** |

---

## 7. Key Design Decisions

1. **Siloed user account** — Cipher runs under `certainid` macOS user, completely separate from Q (which runs under `garrymanz`). Separate Obsidian vaults, separate bot, separate API keys.

2. **Telegram over Slack** — Simpler setup, already familiar to Garry.

3. **DeepSeek V4 Flash** — Free tier via OpenRouter. Function calling supported. Good enough for tool routing.

4. **Function calling pattern** — LLM decides which tool to call based on user message. No hard-coded intent parsing. The bot plays "agent loop" — call LLM → execute tools → call LLM again with results → respond.

5. **Priority tool filtering** — Only 42 of 106 total tools exposed as functions. Keeps token usage down and prevents the LLM from calling obscure/debug tools.

6. **Full paths everywhere** — SSH non-interactive sessions don't get user PATH. All binaries use absolute paths (`/usr/local/bin/node`, full path to `.venv/bin/python`).

---

## 8. If Something Breaks

### Bot not responding
```
# 1. Check if process is running
ssh certainid@10.35.94.2 launchctl list | grep cipher

# 2. Check recent logs
ssh certainid@10.35.94.2 tail -30 /Users/certainid/cipher.err
ssh certainid@10.35.94.2 tail -30 /Users/certainid/cipher.log

# 3. Restart
ssh certainid@10.35.94.2 'launchctl bootout gui/$(id -u certainid)/com.certainid.cipher'
ssh certainid@10.35.94.2 'launchctl bootstrap gui/$(id -u certainid) /Users/certainid/Library/LaunchAgents/com.certainid.cipher.plist'
```

### MCP server won't start
```
# Test individually
ssh certainid@10.35.94.2 '/usr/local/bin/node /Users/certainid/Documents/App_dev/x-mcp/dist/index.js --help'
ssh certainid@10.35.94.2 '/Users/certainid/Documents/App_dev/linkedin-mcp/.venv/bin/python -m linkedin_mcp.main'
```

### Google token expired
Run the OAuth flow again. Credentials at `~/.google-credentials.json`. New token saves to `~/.google-token.json`.

### LinkedIn session expired
The headless Playwright browser should auto-handle this. If not, log into LinkedIn in Chrome on the `certainid` user, then run:
```bash
cd ~/Documents/App_dev/linkedin-mcp
.venv/bin/python -m linkedin_mcp.auth  # or linkedin-mcp-auth
```

### Environment variables
All in `~/cipher.env`. Check:
- `TELEGRAM_BOT_TOKEN` — must match BotFather
- `OPENROUTER_API_KEY` — valid OpenRouter key
- `CIPHER_CHAT_ID` — 1312136511 (Garry's Telegram ID)

---

## 9. Second Brain Auto-Ingestion

A cron job (set up by Q) periodically checks the `raw/` folder for new content and processes it into wiki/crm/journal.

**Cron interval:** Every 2 hours
**Script:** Managed by Q's cron system — not in Cipher's directory
**Test:** Drop a file into `~/Documents/CertainID-Vault/SecondBrain/raw/` and wait for the next cron cycle

---

## 10. Quick Reference

| Task | Command |
|------|---------|
| Test bot locally | `source ~/cipher-env/bin/activate && source ~/cipher.env && python3 ~/cipher_bot_v4.py` |
| Restart bot | `launchctl bootout gui/$(id -u certainid)/com.certainid.cipher && launchctl bootstrap gui/$(id -u certainid) /Users/certainid/Library/LaunchAgents/com.certainid.cipher.plist` |
| View live logs | `tail -f ~/cipher.err` |
| Test MCP tools | `python3 -c "import asyncio; from cipher_mcp_client import CipherMCPClient; c=CipherMCPClient(); asyncio.run(c.start()); print(asyncio.run(c.x_server.call_tool('get_user', {'username': 'certainid'})))"` |
| Message Cipher | DM @Cippher_Bot on Telegram |
| SSH access | `ssh certainid@10.35.94.2` (via Q's SSH key) |
| Python path | `/Users/certainid/cipher-env/bin/python` |
| Node path | `/usr/local/bin/node` |

---

## 11. Social Monitor (cipher_monitor.py)

**Purpose:** Polls X and LinkedIn every 30 minutes for new reactions, comments, mentions, and engagement. Sends Telegram DM to Garry when anything new is found.

### Files
| File | Purpose |
|------|---------|
| `~/cipher_monitor.py` | Python script — starts MCP servers, checks both platforms, compares against state, sends Telegram |
| `~/run-monitor.sh` | Shell wrapper — sources env, activates venv, execs monitor |
| `~/.cipher_monitor_state.json` | State file — tracks known mention IDs, comment IDs, reaction counts |
| `~/monitor.log` | Log output from cron runs |

### Cron Schedule
- **Interval:** Every 30 minutes (at :00 and :30 past the hour)
- **Crontab entry:** `0,30 * * * * /Users/certainid/run-monitor.sh >> /Users/certainid/monitor.log 2>&1`

### What It Monitors

**X/Twitter:**
- `get_mentions` — New @mentions of @certainid
- `get_timeline` — Replies on recent posts (checking reply_count metrics)

**LinkedIn:**
- `get_my_posts` — Recent posts
- `get_comments_official` — New comments on posts
- `get_post_reactions` — New reactions on posts
- `get_profile_views` — Profile view data
- `get_invitations` — Pending connection requests

### Notification Format
When new activity is detected, a Telegram message is sent with:
- Platform icon (X / LinkedIn)
- Type of activity (mention, comment, reaction, etc.)
- Author/source
- Preview text
- Link to the post/thread

### State Tracking
The script compares against `~/.cipher_monitor_state.json` which stores:
- `last_check` — Unix timestamp of last run
- `known_x_mentions` — IDs of mentions already notified about
- `known_li_reactions` — Per-post tracking of comment IDs and reaction counts

### Running Manually
```bash
bash ~/run-monitor.sh
```

### Checking Logs
```bash
tail -f ~/monitor.log
```
