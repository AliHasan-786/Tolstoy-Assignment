type Provider = "openrouter" | "anthropic";

type CompletionArgs<T> = {
  systemPrompt: string;
  temperature: number;
  mock: T;
  validate: (value: unknown) => value is T;
  maxTokens?: number;
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
export const DEFAULT_OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
const DEFAULT_ANTHROPIC_MODEL =
  process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

const STRICT_JSON_REMINDER =
  "Return only the requested JSON object. No prose, no Markdown, no code fences, no commentary.";

export async function completeJson<T>({
  systemPrompt,
  temperature,
  mock,
  validate,
  maxTokens = 1800,
}: CompletionArgs<T>): Promise<{
  mode: "live" | "mock";
  provider?: Provider;
  data: T;
}> {
  const provider = chooseProvider();

  if (!provider) {
    return { mode: "mock", data: mock };
  }

  try {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const content =
        provider === "openrouter"
          ? await callOpenRouter({
              prompt: systemPrompt,
              reminder: attempt === 1 ? STRICT_JSON_REMINDER : undefined,
              temperature,
              maxTokens,
            })
          : await callAnthropic({
              prompt: systemPrompt,
              reminder: attempt === 1 ? STRICT_JSON_REMINDER : undefined,
              temperature,
              maxTokens,
            });

      try {
        const parsed = parseJson(content);
        if (!validate(parsed)) {
          throw new Error("Provider returned JSON that does not match schema.");
        }
        return { mode: "live", provider, data: parsed };
      } catch (error) {
        if (attempt === 1) {
          throw error;
        }
      }
    }
  } catch {
    return { mode: "mock", provider, data: mock };
  }

  return { mode: "mock", provider, data: mock };
}

function chooseProvider(): Provider | undefined {
  if (process.env.ANTHROPIC_API_KEY) {
    return "anthropic";
  }

  if (process.env.OPENROUTER_API_KEY) {
    return "openrouter";
  }

  return undefined;
}

async function callOpenRouter({
  prompt,
  reminder,
  temperature,
  maxTokens,
}: {
  prompt: string;
  reminder?: string;
  temperature: number;
  maxTokens: number;
}) {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.SIGNAL_SITE_URL || "https://signal-demo.local",
      "X-Title": "Signal Demo",
    },
    body: JSON.stringify({
      model: DEFAULT_OPENROUTER_MODEL,
      temperature,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: reminder || "Return the requested JSON object now.",
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed with ${response.status}.`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenRouter response did not include content.");
  }
  return content;
}

async function callAnthropic({
  prompt,
  reminder,
  temperature,
  maxTokens,
}: {
  prompt: string;
  reminder?: string;
  temperature: number;
  maxTokens: number;
}) {
  const response = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      temperature,
      system: prompt,
      messages: [
        {
          role: "user",
          content: reminder || "Return the requested JSON object now.",
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic request failed with ${response.status}.`);
  }

  const json = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const content = json.content?.find((part) => part.type === "text")?.text;
  if (!content) {
    throw new Error("Anthropic response did not include text content.");
  }
  return content;
}

function parseJson(content: string) {
  const stripped = stripFences(content.trim());
  try {
    return JSON.parse(stripped);
  } catch {
    const firstBrace = stripped.indexOf("{");
    const lastBrace = stripped.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(stripped.slice(firstBrace, lastBrace + 1));
    }
    throw new Error("Unable to parse provider JSON.");
  }
}

function stripFences(content: string) {
  return content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}
