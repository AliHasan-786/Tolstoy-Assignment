import type { AnalyzeResult, GenerateResult } from "@/lib/types";

export const mockAnalysis: AnalyzeResult = {
  left_out_low_data: [
    {
      asset: "Derm edit - barrier serum teaser",
      reason:
        "Only 38 attributed purchases and 3 days live, below the 50-purchase and 5-day thresholds despite strong early revenue per day.",
    },
    {
      asset: "Creator quick quote - clinical test",
      reason:
        "Only 27 attributed purchases, so it is excluded from conclusions until it has a larger purchase sample.",
    },
  ],
  winning_elements: [
    {
      element: "Founder-to-camera videos under 15 seconds",
      evidence:
        "Four qualifying founder-led creator-style videos generated $175.6k in attributed revenue on $60.9k spend, with video completion rates from 41% to 46%.",
      confidence: "High",
      inferred_why:
        "Inference: the founder format makes the routine feel guided and credible, while short lengths keep attention high enough to move viewers toward add-to-cart.",
      false_explanations_checked:
        "Not explained by budget alone: this cluster also has the strongest revenue per dollar spent. Not explained by recency: the assets ran 19 to 28 days.",
    },
    {
      element: "Barrier and clinical proof claims",
      evidence:
        "Assets using supported barrier, fragrance-free, dermatologist-developed, or clinical proof claims consistently outperformed no-claim discount and static assets.",
      confidence: "Medium",
      inferred_why:
        "Inference: proof-led language gives shoppers a reason to believe the product belongs in an everyday routine without resorting to hype.",
      false_explanations_checked:
        "Discount-led no-claim assets underperformed even with meaningful spend, which weakens price promotion as the main explanation.",
    },
    {
      element: "Paid social as the main learning surface",
      evidence:
        "The strongest reusable signals come from paid social assets with enough spend, days live, and purchase volume for comparison.",
      confidence: "Medium",
      inferred_why:
        "Inference: paid social gives faster feedback on opening hook, claim, and creator format than product page or email placements.",
      false_explanations_checked:
        "Product page and email examples produced usable revenue but fewer comparable creative variations, so the placement effect should be tested before scaling.",
    },
  ],
  next_priorities: [
    {
      priority:
        "Launch three new founder-to-camera video cuts around the barrier routine",
      expected_payoff:
        "Highest expected payoff because it extends the strongest multi-asset pattern rather than a single winner.",
      how_to_test:
        "Run against the current founder routine control with equal spend and the same audience. Compare revenue per dollar, in-video add-to-cart actions, and video completion rate after at least 50 purchases per cell.",
      when_to_discontinue:
        "Pause any cut that is 20% below the control on revenue per dollar after 50 attributed purchases and 5 days live.",
    },
    {
      priority:
        "Test proof-led hooks against discount hooks with the same product and spend",
      expected_payoff:
        "Likely improves efficiency by replacing low-quality clicks with more qualified shoppers.",
      how_to_test:
        "Create a proof-led version and a discount-led version using the same format, audience, and budget. Compare revenue per click and add-to-cart rate.",
      when_to_discontinue:
        "Discontinue if proof-led creative does not beat discount creative on revenue per dollar after two matched spend cycles.",
    },
    {
      priority:
        "Convert the customer quote format into shorter creator-style videos",
      expected_payoff:
        "Moderate upside: customer proof works, but the current examples are longer and less efficient than founder-led video.",
      how_to_test:
        "Run 9 to 12 second customer quote cuts against the existing 18 second version. Hold claim and audience constant.",
      when_to_discontinue:
        "Stop if shorter quote cuts do not improve video completion rate by at least 10% while maintaining revenue per dollar.",
    },
    {
      priority:
        "Rebuild static image spend as video-first tests",
      expected_payoff:
        "Protects spend by moving away from the weakest asset class in the sample.",
      how_to_test:
        "Take the two static concepts and recreate each as a founder-led or product-demo video. Compare against static controls.",
      when_to_discontinue:
        "Stop static scaling if video versions beat static controls by 25% or more on revenue per dollar.",
    },
  ],
  open_questions: [
    "Do founder assets hold performance once they move beyond the initial paid social audience?",
    "Does the barrier claim outperform other approved claims when format and hook are held constant?",
  ],
};

export function mockGeneration(n: number): GenerateResult {
  const versions: GenerateResult["versions"] = [
    {
      hook_type: "question",
      script:
        "Is your routine doing too much? I built this step to keep things gentle: fragrance-free, dermatologist developed, and made to support the skin barrier every day.",
      claims_used: [
        "fragrance-free",
        "dermatologist developed",
        "supports the skin barrier",
      ],
      on_brand_score: 94,
      reason:
        "Calm, specific, and proof-led without promising more than the approved claims support.",
      what_it_kept:
        "Founder-led routine framing, short video pacing, and a barrier-focused claim.",
    },
    {
      hook_type: "problem-then-fix",
      script:
        "When a routine starts feeling crowded, I come back to the basics: one gentle everyday serum, clinically tested for 8 weeks, to support the skin barrier.",
      claims_used: ["clinically tested for 8 weeks", "supports the skin barrier"],
      on_brand_score: 91,
      reason:
        "Uses Lumi's plain-spoken tone and anchors the sales message in approved substantiation.",
      what_it_kept:
        "Short founder-to-camera structure and the original routine simplification idea.",
    },
    {
      hook_type: "founder talking",
      script:
        "I wanted this to feel like the easiest part of your night routine: fragrance-free, non-comedogenic, and gentle enough for everyday use.",
      claims_used: ["fragrance-free", "non-comedogenic"],
      on_brand_score: 76,
      reason:
        "The claims are approved, but the line is too generic and does not carry enough of Lumi's calm science-literate voice.",
      what_it_kept:
        "Founder credibility, under-15-second read, and a routine-first product role.",
    },
    {
      hook_type: "customer quote",
      script:
        "\"This made my skin look flawless overnight\" is not how we talk about skincare. The better promise is simpler: a gentle routine step that supports the skin barrier.",
      claims_used: ["supports the skin barrier"],
      on_brand_score: 73,
      reason:
        "It self-corrects, but the off-brand quote still introduces language Lumi would normally avoid.",
      what_it_kept:
        "The barrier routine concept, but with a riskier opening device.",
    },
    {
      hook_type: "quick demo",
      script:
        "One pump after cleansing, then moisturizer. That's the routine: dermatologist developed, fragrance-free, and designed for everyday barrier support.",
      claims_used: [
        "dermatologist developed",
        "fragrance-free",
        "supports the skin barrier",
      ],
      on_brand_score: 90,
      reason:
        "Clear product behavior, approved claims, and calm beauty language.",
      what_it_kept:
        "Short demo pacing and the proven barrier routine angle.",
    },
  ];

  return {
    versions: versions.slice(0, Math.max(1, Math.min(n, versions.length))),
    needs_approval: [
      "A stronger before-and-after acne clearing idea would need a supported acne or blemish claim before it can be written.",
    ],
    needs_more_info: [],
  };
}
