# AI Strategist Assignment: DTC Beauty Brand

For: Palak Agarwal  
By: Ali Hasan

## Assumptions

I am assuming the client is a mid-sized DTC beauty brand on Shopify, roughly $25-35M in annual revenue, using Tolstoy across paid social, PDPs, and content production. They have an in-house creative team, a paid media lead or agency, and an ecommerce lead. I am also assuming the brand already has product claims and brand guidelines, but those guidelines are written for humans rather than structured for AI.

Where data is missing, I would not wait for a perfect data warehouse. I would start with manual tagging and one weekly operating view, then automate only after the team agrees the workflow is useful.

## 1. Problem Framing

The three complaints are symptoms of one larger operating problem: the brand is producing content faster than it can learn from it.

They are making a lot of creative, but the system does not connect each asset to the revenue it influenced. Paid, creative, and ecommerce teams then optimize against different scoreboards. Paid looks at ROAS and CPA, creative looks at engagement and brand quality, and ecommerce looks at PDP conversion and AOV. All three teams can be "right" inside their own metric, while the account still lacks a shared answer to the question that matters: what content elements actually cause shoppers to buy?

That is why I would not start by generating more content. I would start by making content measurable. Once the team knows which hooks, formats, claims, placements, and on-camera talent drive conversion, AI can help scale the right ideas. Without that loop, AI only makes the current ambiguity move faster.

### Symptom vs. Root Cause

**Complaint 1: "We are making a lot of content, but we do not know what is actually driving conversion."**  
Symptom: the team can identify individual ads or PDP videos that seem to perform well.  
Root cause: assets are not consistently tagged by reusable ingredients such as hook, format, length, claim, creator type, placement, and product. Those tags are not tied back to purchase behavior. The team can see winners, but not the pattern behind the winners.

**Complaint 2: "Our paid team, creative team, and ecommerce team are not aligned."**  
Symptom: meetings turn into debates about whether an asset "worked."  
Root cause: the teams do not share a common content taxonomy, decision cadence, or success metric. Each team has valid but incomplete evidence. The missing piece is a weekly operating rhythm where the same content object is reviewed through sales, creative quality, and onsite behavior.

**Complaint 3: "We want AI to help us move faster, but we do not want generic output or brand dilution."**  
Symptom: the brand wants speed but fears bland or risky output.  
Root cause: the AI does not yet have enough structured context: brand voice, approved claims, examples of what good looks like, examples of what to avoid, and proof of which content patterns already perform. In beauty, this is not just a tone problem. If AI invents or stretches product claims, it creates compliance and trust risk.

### Questions I Would Ask First

**Business baseline**
- What are the current PDP conversion rate, AOV, CAC, repeat purchase rate, and return rate?
- What does one finished asset cost to produce, and how long does it take from brief to launch?
- Which placements matter most right now: paid social, PDPs, homepage, email, or quiz/assistant flows?

**Data**
- Can Tolstoy video events be connected to Shopify orders at the user, session, or cohort level?
- Do we know which assets appeared on which PDPs, ads, and campaigns?
- Are assets currently tagged in any consistent way?

**People and decision rights**
- Who owns the weekly content plan?
- Who can stop spend on a losing concept?
- Who approves brand voice and claims?
- Which team is most frustrated right now, and why: data trust, speed, quality, or ownership?

**Brand and AI safety**
- What claims are approved, and which claims are explicitly not allowed?
- Can the creative team provide 5 examples of on-brand content and 5 examples of off-brand content?
- What level of AI-generated output is acceptable before human review?

### Stakeholders and What Each Needs

**Head of Ecommerce** needs a defensible link between Tolstoy content and conversion lift. They need to know whether onsite video or shoppable experiences are changing PDP conversion, AOV, and revenue per visitor.

**Paid Media Lead** needs a faster supply of tested creative angles and a way to avoid wasting spend on assets that only look good in engagement metrics.

**Creative Lead** is a critical adoption partner. They need assurance that AI will not reduce the brand to generic content volume. They should own the tagging taxonomy and the brand rules used by the AI.

**Merchandising or Site Lead** needs the right content matched to the right product page, customer question, and purchase barrier.

**CMO or Founder** needs growth without brand erosion. They need one operating view that connects revenue impact with brand quality.

## 2. Strategic Recommendation

### North Star

Every piece of content should earn its place.

That means each content asset should be evaluated on three dimensions:

1. **Commercial impact:** attributed revenue, conversion lift, AOV, and sales per dollar of spend.
2. **Reusability:** whether the winning pattern can be repeated across hooks, formats, products, or placements.
3. **Brand safety:** whether the content stays inside approved voice and claim boundaries.

The practical goal is not "make more content." It is "increase revenue per content decision while protecting brand trust."

### Workflow 1: Content-to-Sales Loop

**What it is**  
A weekly measurement workflow that tags every content asset by its reusable elements, connects those tags to sales behavior, and produces a shared view of what is working and why.

Each asset would be tagged by:
- hook type
- format
- length
- person on camera
- product or SKU
- claim used
- placement
- audience or campaign
- spend and production cost

The weekly view would answer:
- Which content elements are associated with conversion, AOV, and add-to-cart?
- Which assets should be excluded because the sample is too small?
- Which findings are observations versus hypotheses?
- What should the team make, test, or stop next?

**Why this comes first**  
Creative quality is a major driver of ad performance. Meta cites Nielsen research that creative drives 56% of campaign sales ROI, and Circana/NCS reports creative quality drives 49% of incremental sales. If the brand cannot read creative performance at the element level, it is underusing the biggest lever it has.

This workflow also directly addresses the alignment issue. Paid, creative, and ecommerce stop arguing from separate dashboards and start reviewing the same content object against the same decision criteria.

**Week one version**  
I would not overbuild this. In week one, I would:

1. Interview the paid, creative, and ecommerce leads separately.
2. Audit the last 20-30 assets that ran across paid and PDPs.
3. Create a simple tag sheet with the creative lead.
4. Manually connect tags to available performance metrics.
5. Run one weekly review with a single decision owner.
6. End that review with three decisions: make more, test differently, or stop.

The goal of week one is not perfect attribution. It is trust in the operating rhythm.

### Workflow 2: On-Brand Content Engine

**What it is**  
A guarded generation workflow that turns proven winners from the Content-to-Sales Loop into new on-brand variations.

The AI receives:
- the proven winning concept
- the winning attributes to preserve
- the brand voice rules
- words to use and avoid
- approved claims only
- on-brand examples
- off-brand examples
- placement and format constraints

It returns:
- new variations with different hooks
- claims used
- on-brand score
- what each version kept from the winner
- ideas that require approval
- missing information if the brief is too thin

**Why this comes second**  
AI generation is only valuable once it is pointed at something true. If the brand starts with generation, it risks producing a high volume of generic, unproven content. If it starts with measurement, AI becomes a multiplier for what the team already knows works.

**User journey improved**  
Today: teams brainstorm, produce, launch, wait, debate, and repeat.  
After: teams review the shared learning loop, select a proven pattern, generate guarded variations, approve the best ones, launch, and feed results back into the next review.

### Expected Business Impact

The expected impact is:
- faster time from learning to next creative brief
- higher share of spend going to proven creative patterns
- lower cost per usable asset
- better PDP conversion from content matched to shopper questions
- less brand risk from AI-generated output

I would position any financial model as sizing, not a promise. For example, if a $25M brand improves revenue per visitor by even a few percentage points and reduces waste in creative production, the account-level upside can be meaningful. But I would not forecast a number until we have the client baseline.

Tolstoy's own LSKD case study is useful context: Tolstoy reports a 24% lift in conversion, 53% uplift in AOV, and 110X ROI for LSKD. I would use that as proof that video commerce can move real metrics, not as a guarantee for this client.

### Risks, Tradeoffs, and Dependencies

**Attribution may be imperfect.**  
If user-level attribution is weak, I would start with cohort or comparison-group tests.

**Small samples can mislead.**  
The analysis workflow should exclude low-sales or short-running assets from conclusions.

**Creative may feel policed.**  
The creative team should own the taxonomy and brand examples. The system should help their work win, not turn them into an approval bottleneck.

**AI can overclaim.**  
Beauty claims must come from an approved list. Anything outside that list goes to `needs_approval` rather than being written into copy.

**Short-term conversion can conflict with brand health.**  
Discount hooks may sell in the short term while weakening the brand. That is why the north star includes brand safety, not just conversion.

### How I Would Measure Whether It Is Working

**First 30 days: adoption and operating rhythm**
- percent of assets tagged
- time from performance readout to next brief
- number of decisions made in the weekly review
- whether all three teams use the same source of truth

**30-90 days: performance**
- revenue per content asset
- conversion lift by placement
- AOV for shoppers exposed to content
- cost and turnaround time per usable asset
- share of paid spend allocated to proven patterns

**Brand and safety**
- on-brand score distribution
- number of outputs blocked for unapproved claims
- customer review language and return-rate changes
- manual creative approval rate

The strategy is working if the team can say, with evidence: "This is what we learned, this is what we are making next, this is why, and this is how we will know if we are wrong."

## 3. Prompt Engineering

### Prompt A: On-Brand Content Generation

**Goal**  
Generate new content variations from a proven winner while preserving brand voice and preventing unsupported beauty claims.

**System prompt**

```text
You are a senior creative strategist for {{brand_name}}, a direct-to-consumer beauty brand.
Write social-native, sales-focused content that sounds unmistakably like this brand.
Never invent product claims.

Brand rules, in priority order:
1. Voice and tone: {{voice_spec}}
2. Words to use when natural: {{do_words}}
3. Words to avoid: {{dont_words}}
4. Approved claims only: {{approved_claims}}
5. On-brand examples to match: {{good_examples}}
6. Off-brand examples to avoid: {{bad_examples}}

Proven winner:
{{winning_concept}}

What made it work:
{{winning_attributes}}

Task:
Write {{N}} new versions for {{placement}}.
Format: {{format}}
Length: {{length}}

Requirements:
- Preserve the winning attributes.
- Use a different opening hook for each version.
- Every claim must come from the approved claims list.
- If a strong idea needs an unapproved claim, do not write the version. Put the idea in needs_approval.
- Score each version from 0 to 100 on brand fit.
- If required inputs are missing, return needs_more_info and stop.

Return only valid JSON:
{
  "versions": [
    {
      "hook_type": "question | problem-then-fix | customer quote | founder talking | quick demo",
      "script": "string",
      "claims_used": ["approved claim"],
      "on_brand_score": 0,
      "reason": "string",
      "what_it_kept": "string"
    }
  ],
  "needs_approval": ["string"],
  "needs_more_info": ["string"]
}
```

**Why it is structured this way**  
The prompt puts brand rules before creative freedom. It gives the model both positive and negative examples, which is more useful than abstract voice adjectives alone. It requires varied hooks so the output is not just three rewrites of the same idea. It forces every claim to map to an approved list, which is essential in beauty.

**Inputs required**
- brand name
- voice and tone
- words to use and avoid
- approved claims
- on-brand and off-brand examples
- proven winning concept
- winning attributes
- placement, format, length, and number of versions

**Expected failure modes**
- generic copy
- overclaiming
- near-duplicate variations
- inflated self-scores
- weak output if the winning attributes are vague

**How I would improve weak output**
- add sharper off-brand examples
- require a stricter script structure by placement
- lower the acceptable brand-score threshold
- add a second pass that rejects duplicate hooks
- compare generated variations against past winners before launch

### Prompt B: Analysis and Next-Step Recommendation

**Goal**  
Identify which content elements are driving sales, separate evidence from inference, exclude thin data, and recommend the next tests.

**System prompt**

```text
You are a careful performance analyst. Find what is truly driving sales, not a flattering story.
Do not over-read small samples. Separate observations from inferences.

Context:
- North star: {{north_star}}
- Benchmarks: {{baselines}}
- Minimum sales threshold: {{min_sales}}
- Minimum days live threshold: {{min_days}}
- Tagged content data: {{performance_data}}

Steps:
1. Data check:
   - Exclude any asset with fewer than {{min_sales}} sales or fewer than {{min_days}} days live.
   - List excluded assets and the reason.
2. Group by reusable content element:
   - hook type
   - format
   - person on camera
   - claim
   - placement
3. For each finding:
   - state what the data shows
   - state the inferred why
   - check possible false explanations such as budget, recency, audience mix, seasonality, or one outlier asset
   - assign confidence: High, Medium, or Low
4. Recommend 3 to 5 next priorities:
   - expected payoff
   - test design
   - comparison group
   - discontinuation rule

Rules:
- Do not recommend producing more of an element based on one asset or insufficient data.
- If evidence is weak, recommend the test that would settle the question.
- Do not include prose outside JSON.

Return only valid JSON:
{
  "left_out_low_data": [
    {
      "asset": "string",
      "reason": "string"
    }
  ],
  "winning_elements": [
    {
      "element": "string",
      "evidence": "string",
      "confidence": "High | Medium | Low",
      "inferred_why": "string",
      "false_explanations_checked": "string"
    }
  ],
  "next_priorities": [
    {
      "priority": "string",
      "expected_payoff": "string",
      "how_to_test": "string",
      "when_to_discontinue": "string"
    }
  ],
  "open_questions": ["string"]
}
```

**Why it is structured this way**  
The prompt makes the model act like an analyst, not a storyteller. It starts with exclusions, groups by reusable elements rather than individual winners, and requires confidence levels and false-explanation checks. It does not ask for hidden reasoning. Instead, it asks for evidence fields that a human can review.

**Inputs required**
- tagged content data
- spend, views, watch behavior, add-to-cart, sales, AOV, revenue, and days live
- baseline metrics
- north star
- minimum sample thresholds

**Expected failure modes**
- false patterns from small samples
- confusing higher spend with better creative
- overvaluing the newest asset
- ignoring audience or placement differences
- making recommendations that are too broad to test

**How I would improve weak output**
- increase minimum data thresholds
- add audience and placement splits
- add historical winners for comparison
- require a named comparison group for every recommendation
- evaluate the prompt by whether its recommendations improve the next test, not by whether the analysis sounds confident

## Sources

1. Meta for Business, citing Nielsen: creative drives 56% of campaign sales ROI. https://www.facebook.com/business/news/insights/high-quality-creative-increases-ad-roi
2. Circana/NCS, Five Keys to Advertising Effectiveness: creative quality drives 49% of incremental sales. https://www.circana.com/post/brand-loyalty-impact-on-sales
3. Tolstoy LSKD customer story: +24% conversion lift, +53% AOV uplift, 110X ROI. https://www.gotolstoy.com/customer-stories/lskd
4. Marq/Lucidpress on brand consistency and revenue impact. https://www.marq.com/blog/brand-consistency-competitive-advantage/
