# SigmaJob — OS Career

Career planning app with real Malaysia market data, powered by Gemini via a Vercel serverless proxy.

## Stack
- Vite + React 19 + TypeScript
- Tailwind CSS v4
- Vercel Serverless Function (`api/gemini.ts`) as a secure Gemini proxy

## Local development

```bash
npm install
npm run dev
```

> Note: the `/api/gemini` proxy only runs on Vercel (or via `vercel dev`). For local development with the proxy, use:
>
> ```bash
> npm i -g vercel
> vercel dev
> ```

## Environment variables

Set in the Vercel dashboard (Project → Settings → Environment Variables), for the **Production** (and Preview, if desired) environment:

| Name | Description |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio API key for Gemini |

For local `vercel dev`, create a `.env.local` with the same variable.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Framework preset: **Vite** (auto-detected).
4. Root directory: `./`.
5. Add the `GEMINI_API_KEY` env var (Production).
6. Deploy.

### Routing

`vercel.json` uses the modern `rewrites` API with a negative-lookahead so that everything **except** `/api/*` falls back to the SPA's `index.html`:

```json
{
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

This is critical — a catch-all SPA rewrite without excluding `/api/` will swallow function requests and return 404.

### Verify the API after deploy

```bash
curl -i -X POST https://<your-domain>/api/gemini \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"say hello in one word"}'
```

Expected: `200 OK` with `{"text":"..."}`.
