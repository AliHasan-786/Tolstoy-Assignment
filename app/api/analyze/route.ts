import { NextResponse } from "next/server";
import { completeJson } from "@/lib/llm";
import { mockAnalysis } from "@/lib/mock";
import { buildAnalyzePrompt } from "@/lib/prompts";
import {
  minDays as seedMinDays,
  minSales as seedMinSales,
  northStar as seedNorthStar,
  performanceAssets,
} from "@/lib/seed";
import type { AnalyzeResult, ContentAsset } from "@/lib/types";
import { isAnalyzeResult } from "@/lib/validators";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<{
    performanceData: ContentAsset[];
    northStar: string;
    minSales: number;
    minDays: number;
  }>;

  const performanceData = Array.isArray(body.performanceData)
    ? body.performanceData
    : performanceAssets;
  const northStar = body.northStar || seedNorthStar;
  const minSales = Number.isFinite(body.minSales) ? Number(body.minSales) : seedMinSales;
  const minDays = Number.isFinite(body.minDays) ? Number(body.minDays) : seedMinDays;

  const prompt = buildAnalyzePrompt({
    performanceData,
    northStar,
    minSales,
    minDays,
  });

  const result = await completeJson<AnalyzeResult>({
    systemPrompt: prompt,
    temperature: 0.18,
    mock: mockAnalysis,
    validate: isAnalyzeResult,
  });

  return NextResponse.json({
    mode: result.mode,
    provider: result.provider,
    ...result.data,
  });
}
