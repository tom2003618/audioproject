# audioproject

加拿大聯邦選舉與移民研究（長者易讀版）dashboard。

Open `index.html` in a browser, or from this folder run:

```bash
python -m http.server
```

Then visit http://localhost:8000

## Use Claude Code with the DeepSeek API

Claude Code talks to an Anthropic-shaped HTTP API. Point it at DeepSeek’s Anthropic-compatible endpoint so **token usage is billed to your DeepSeek API key**, not to a Claude Code / Anthropic subscription.

Official docs: [Integrate with Claude Code](https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code)

### 1. Get a DeepSeek API key

Create a key at [DeepSeek Platform](https://platform.deepseek.com/). Do not commit the key into this repo.

### 2. Install Claude Code (if needed)

Install [Node.js 18+](https://nodejs.org/). On Windows, also install [Git for Windows](https://git-scm.com/download/win).

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

### 3. Point Claude Code at DeepSeek

Use this base URL exactly: `https://api.deepseek.com/anthropic`  
Do **not** add `/v1` (Claude Code already appends `/v1/messages`).

**Windows PowerShell** (this session only):

```powershell
$env:ANTHROPIC_BASE_URL = "https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN = "<your DeepSeek API Key>"
$env:ANTHROPIC_MODEL = "deepseek-v4-pro"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL = "deepseek-v4-pro"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL = "deepseek-v4-pro"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "deepseek-v4-flash"
$env:CLAUDE_CODE_SUBAGENT_MODEL = "deepseek-v4-flash"
$env:CLAUDE_CODE_EFFORT_LEVEL = "max"
```

**macOS / Linux:**

```bash
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_AUTH_TOKEN="<your DeepSeek API Key>"
export ANTHROPIC_MODEL=deepseek-v4-pro
export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro
export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro
export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash
export CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash
export CLAUDE_CODE_EFFORT_LEVEL=max
```

If Claude Code still asks for an Anthropic key, also set `ANTHROPIC_API_KEY` to the same DeepSeek key.

### 4. Run it in this project

From this repo folder:

```bash
claude
```

Claude Code should now call DeepSeek (`deepseek-v4-pro` / `deepseek-v4-flash`) instead of Anthropic. Check usage on the [DeepSeek Platform](https://platform.deepseek.com/), not Claude Code billing.

To keep the settings after you close the terminal, add the same variables to your user environment (Windows) or shell profile (macOS / Linux). Unset `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN` when you want Claude Code to use Anthropic again.

## Source

| Path | What it is |
| --- | --- |
| `index.html` | Page structure and copy |
| `css/styles.css` | Layout and theme |
| `js/app.js` | Section navigation, font size, Cantonese read-aloud |
| `images/` | Chart PNGs used by the dashboard |
