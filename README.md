# Tolstoy Account Workbench

This is an optional support artifact for the Tolstoy AI Strategist assignment. It is intentionally narrow: it turns the written recommendation into a small working workflow for a fictional direct-to-consumer beauty account.

It is meant to show the operating logic:

1. Measure tagged content assets against purchase and revenue outcomes.
2. Exclude low-sample results before drawing conclusions.
3. Generate new content only from measured winners and approved brand claims.

The app uses seeded case data because no real client data was provided. With an Anthropic key, the two server routes call Claude. Without a key, the app falls back to deterministic seeded responses so the workflow remains reviewable.
