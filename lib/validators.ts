import type { AnalyzeResult, GenerateResult } from "@/lib/types";

export function isAnalyzeResult(value: unknown): value is AnalyzeResult {
  if (!isRecord(value)) return false;
  return (
    Array.isArray(value.left_out_low_data) &&
    Array.isArray(value.winning_elements) &&
    Array.isArray(value.next_priorities) &&
    Array.isArray(value.open_questions)
  );
}

export function isGenerateResult(value: unknown): value is GenerateResult {
  if (!isRecord(value)) return false;
  return (
    Array.isArray(value.versions) &&
    Array.isArray(value.needs_approval) &&
    Array.isArray(value.needs_more_info)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
