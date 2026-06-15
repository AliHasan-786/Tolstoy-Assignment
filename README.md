# Signal

Signal is a polished AI content-to-sales prototype for a fictional DTC skincare brand, Lumi Beauty. It demonstrates a simple workflow: measure which content elements actually drive attributed sales, then generate more on-brand variations from the winners.

The app has two tabs:

- **The Loop** analyzes tagged sample performance data and returns reusable winning elements, next tests, and low-sample exclusions.
- **The Engine** turns a proven winner and brand spec into guarded, on-brand content variations.

The demo uses sample data only and is designed to stay functional even without an LLM key by falling back to realistic mock responses.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## LLM setup

Signal has two runtime modes:

- **Live mode:** set an LLM key and the server routes call the model in real time.
- **Demo mode:** leave keys unset and the same workflows return realistic mock output.

The UI uses the included sample dataset in both modes. The difference is whether the analysis and generation are produced by the live model or by the fallback response.

Create `.env.local`:

```bash
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=google/gemini-2.5-flash
```

`OPENROUTER_MODEL` is optional. The app defaults to `google/gemini-2.5-flash`, a strong low-cost OpenRouter model. OpenRouter calls are made only from server-side API routes, so the key never reaches the browser.

For local demos, the server also supports an optional Anthropic fallback:

```bash
ANTHROPIC_API_KEY=your_anthropic_key
ANTHROPIC_MODEL=claude-sonnet-4-6
```

If no key is set, if a provider call fails, or if JSON parsing fails after one retry, the app returns realistic mock data and shows a subtle demo-mode indicator.

## Vercel deploy

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Add `OPENROUTER_API_KEY` in Vercel project settings.
4. Optionally add `OPENROUTER_MODEL`.
5. Deploy.

No database, auth, or additional configuration is required.
