import { NextResponse } from "next/server";
import { completeJson } from "@/lib/llm";
import { mockGeneration } from "@/lib/mock";
import { buildGeneratePrompt } from "@/lib/prompts";
import { brandSpec as seedBrandSpec, performanceAssets } from "@/lib/seed";
import type { BrandSpec, GenerateResult } from "@/lib/types";
import { isGenerateResult } from "@/lib/validators";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<{
    brandSpec: BrandSpec;
    winningConcept: string;
    winningAttributes: string;
    placement: string;
    format: string;
    length: string;
    n: number;
  }>;

  const topWinner = performanceAssets[0];
  const n = clampVersionCount(body.n);
  const prompt = buildGeneratePrompt({
    brandSpec: body.brandSpec || seedBrandSpec,
    winningConcept: body.winningConcept || topWinner.label,
    winningAttributes:
      body.winningAttributes ||
      `${topWinner.hook_type}, ${topWinner.format}, ${topWinner.length_seconds}s, ${topWinner.person} on camera, ${topWinner.claim}`,
    placement: body.placement || "paid social",
    format: body.format || "UGC video",
    length: body.length || "under 15 seconds",
    n,
  });

  const result = await completeJson<GenerateResult>({
    systemPrompt: prompt,
    temperature: 0.62,
    mock: mockGeneration(n),
    validate: isGenerateResult,
    maxTokens: 2200,
  });

  return NextResponse.json({
    mode: result.mode,
    provider: result.provider,
    ...result.data,
  });
}

function clampVersionCount(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 3;
  return Math.max(1, Math.min(5, Math.round(parsed)));
}
