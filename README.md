# Tolstoy Account Workbench

This is an optional support artifact for the Tolstoy AI Strategist assignment. It is intentionally narrow: it turns the written recommendation into a small working workflow for a fictional direct-to-consumer beauty account.

It is not meant to look like a finished Tolstoy product. It is meant to show the operating logic:

1. Measure tagged content assets against purchase and revenue outcomes.
2. Exclude low-sample results before drawing conclusions.
3. Generate new content only from measured winners and approved brand claims.

The app uses seeded case data because no real client data was provided. With an Anthropic key, the two server routes call Claude. Without a key, the app falls back to deterministic seeded responses so the workflow remains reviewable.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## LLM setup

Create `.env.local`:

```bash
ANTHROPIC_API_KEY=your_anthropic_key
ANTHROPIC_MODEL=claude-sonnet-4-6
```

`ANTHROPIC_MODEL` is optional. The app defaults to `claude-sonnet-4-6`. Anthropic calls are made only from server-side API routes, so the key never reaches the browser.

The server also supports OpenRouter as an optional fallback provider when no Anthropic key is set:

```bash
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=google/gemini-2.5-flash
```

If both keys are set, Anthropic is used first.

## Vercel deploy

In the Vercel project settings, add:

```bash
ANTHROPIC_API_KEY=your_anthropic_key
ANTHROPIC_MODEL=claude-sonnet-4-6
```

Then redeploy the latest commit. No database, authentication, or additional configuration is required.
