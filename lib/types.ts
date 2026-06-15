export type ContentFormat =
  | "UGC video"
  | "studio video"
  | "static image"
  | "carousel";

export type HookType =
  | "founder-to-camera"
  | "problem-then-fix"
  | "customer quote"
  | "product demo"
  | "discount";

export type PersonType = "founder" | "customer" | "model" | "none";

export type Placement = "paid social" | "product page" | "email";

export type BrandSpec = {
  brand_name: string;
  voice_spec: string;
  do_words: string[];
  dont_words: string[];
  approved_claims: string[];
  good_examples: string[];
  bad_examples: string[];
};

export type ContentAsset = {
  id: string;
  label: string;
  format: ContentFormat;
  hook_type: HookType;
  length_seconds: number;
  person: PersonType;
  claim: string;
  placement: Placement;
  spend: number;
  impressions: number;
  hold_rate: number;
  ctr: number;
  in_video_atc: number;
  attributed_sales: number;
  aov: number;
  attributed_revenue: number;
  days_live: number;
};

export type Confidence = "High" | "Medium" | "Low";

export type AnalyzeResult = {
  left_out_low_data: Array<{
    asset: string;
    reason: string;
  }>;
  winning_elements: Array<{
    element: string;
    evidence: string;
    confidence: Confidence;
    inferred_why: string;
    false_explanations_checked: string;
  }>;
  next_priorities: Array<{
    priority: string;
    expected_payoff: string;
    how_to_test: string;
    when_to_discontinue: string;
  }>;
  open_questions: string[];
};

export type GenerateResult = {
  versions: Array<{
    hook_type: string;
    script: string;
    claims_used: string[];
    on_brand_score: number;
    reason: string;
    what_it_kept: string;
  }>;
  needs_approval: string[];
  needs_more_info: string[];
};

export type ApiMode = "live" | "mock";

export type AnalyzeApiResponse = AnalyzeResult & {
  mode: ApiMode;
  provider?: "openrouter" | "anthropic";
};

export type GenerateApiResponse = GenerateResult & {
  mode: ApiMode;
  provider?: "openrouter" | "anthropic";
};
