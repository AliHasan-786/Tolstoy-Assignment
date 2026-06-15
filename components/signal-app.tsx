"use client";

import {
  AlertTriangle,
  ArrowDownRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  FlaskConical,
  Loader2,
  LockKeyhole,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import {
  brandSpec as initialBrandSpec,
  minDays,
  minSales,
  northStar,
  performanceAssets,
} from "@/lib/seed";
import type {
  AnalyzeApiResponse,
  BrandSpec,
  ContentAsset,
  GenerateApiResponse,
} from "@/lib/types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

type Tab = "loop" | "engine";

export function SignalApp() {
  const [activeTab, setActiveTab] = useState<Tab>("loop");

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <Hero />
      <TabSwitcher activeTab={activeTab} onChange={setActiveTab} />
      <AnimatePresence mode="wait">
        {activeTab === "loop" ? (
          <motion.section
            key="loop"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <LoopTab />
          </motion.section>
        ) : (
          <motion.section
            key="engine"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <EngineTab />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[1.4rem] border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[var(--shadow)] sm:p-8">
      <div className="absolute inset-y-0 right-0 hidden w-1/3 border-l border-[var(--line)] bg-[linear-gradient(135deg,rgba(157,89,68,0.14),rgba(102,119,101,0.16))] md:block" />
      <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(157,89,68,0.24)] bg-[rgba(157,89,68,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--clay-dark)]">
            <Sparkles size={14} />
            Prototype &middot; sample data
          </div>
          <h1 className="display-font text-5xl font-semibold leading-none text-[var(--ink)] sm:text-6xl lg:text-7xl">
            Signal
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Measure what content drives sales, then generate more of what works,
            on-brand.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[var(--line)] bg-[rgba(255,250,243,0.72)] p-2 backdrop-blur sm:min-w-[320px]">
          <StatTile label="Assets" value="14" />
          <StatTile label="Sales" value="4.7k" />
          <StatTile label="Revenue" value="$250k" />
        </div>
      </div>
    </section>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[rgba(223,211,197,0.76)] bg-white/55 px-3 py-3">
      <div className="text-[11px] uppercase text-[var(--muted)]">{label}</div>
      <div className="display-font mt-1 text-2xl font-semibold text-[var(--plum)]">
        {value}
      </div>
    </div>
  );
}

function TabSwitcher({
  activeTab,
  onChange,
}: {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <div className="grid rounded-2xl border border-[var(--line)] bg-[rgba(255,250,243,0.72)] p-1 shadow-sm sm:w-fit sm:grid-cols-2">
      <button
        type="button"
        onClick={() => onChange("loop")}
        className={clsx(
          "flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition",
          activeTab === "loop"
            ? "bg-[var(--ink)] text-white shadow-sm"
            : "text-[var(--muted)] hover:text-[var(--ink)]",
        )}
      >
        <BarChart3 size={17} />
        The Loop
      </button>
      <button
        type="button"
        onClick={() => onChange("engine")}
        className={clsx(
          "flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition",
          activeTab === "engine"
            ? "bg-[var(--ink)] text-white shadow-sm"
            : "text-[var(--muted)] hover:text-[var(--ink)]",
        )}
      >
        <FlaskConical size={17} />
        The Engine
      </button>
    </div>
  );
}

function LoopTab() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalyzeApiResponse | null>(null);

  async function runAnalysis() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          performanceData: performanceAssets,
          northStar,
          minSales,
          minDays,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed.");
      }

      setResult((await response.json()) as AnalyzeApiResponse);
    } catch {
      setError("The analysis did not complete. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-7">
      <SectionHeader
        eyebrow="Measurement layer"
        title="Which content elements actually drive sales, and what to make next."
        action={
          <PrimaryButton onClick={runAnalysis} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <TrendingUp size={18} />}
            Run analysis
          </PrimaryButton>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <PerformanceTable />
        <RevenueChartPanel />
      </div>

      {error ? <ErrorState message={error} /> : null}
      {loading ? <AnalysisSkeleton /> : null}
      {result ? <AnalysisResults result={result} /> : <EmptyState />}
    </div>
  );
}

function EngineTab() {
  const [brandSpec, setBrandSpec] = useState<BrandSpec>(initialBrandSpec);
  const winners = useMemo(
    () =>
      [...performanceAssets]
        .sort((a, b) => b.attributed_revenue - a.attributed_revenue)
        .slice(0, 5),
    [],
  );
  const [selectedId, setSelectedId] = useState(winners[0]?.id || "");
  const [placement, setPlacement] = useState("paid social");
  const [format, setFormat] = useState("UGC video");
  const [length, setLength] = useState("under 15 seconds");
  const [n, setN] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GenerateApiResponse | null>(null);

  const selectedWinner =
    winners.find((winner) => winner.id === selectedId) || winners[0];

  async function generate() {
    if (!selectedWinner) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandSpec,
          winningConcept: selectedWinner.label,
          winningAttributes: describeWinner(selectedWinner),
          placement,
          format,
          length,
          n,
        }),
      });

      if (!response.ok) {
        throw new Error("Generation failed.");
      }

      setResult((await response.json()) as GenerateApiResponse);
    } catch {
      setError("The generator did not complete. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-7">
      <SectionHeader
        eyebrow="Generation layer"
        title="Turn a proven winner into new on-brand variations, with a guardrail."
        action={
          <PrimaryButton onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Generate variations
          </PrimaryButton>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <BrandSpecPanel brandSpec={brandSpec} setBrandSpec={setBrandSpec} />
        <GeneratorControls
          winners={winners}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          placement={placement}
          setPlacement={setPlacement}
          format={format}
          setFormat={setFormat}
          length={length}
          setLength={setLength}
          n={n}
          setN={setN}
          selectedWinner={selectedWinner}
        />
      </div>

      {error ? <ErrorState message={error} /> : null}
      {loading ? <GenerationSkeleton /> : null}
      {result ? <GenerationResults result={result} brandSpec={brandSpec} /> : null}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--clay-dark)]">
          {eyebrow}
        </div>
        <h2 className="display-font mt-2 max-w-3xl text-2xl font-semibold leading-tight text-[var(--ink)] sm:text-3xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--clay)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(157,89,68,0.22)] transition hover:bg-[var(--clay-dark)] disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function PerformanceTable() {
  const maxRevenue = Math.max(
    ...performanceAssets.map((asset) => asset.attributed_revenue),
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
        <div>
          <h3 className="display-font text-2xl font-semibold">Performance overview</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Seed content assets with spend, sales, and revenue signals.
          </p>
        </div>
        <div className="hidden rounded-full border border-[var(--line)] px-3 py-1 text-xs font-medium text-[var(--muted)] sm:block">
          Min sample: {minSales} sales / {minDays} days
        </div>
      </div>
      <div className="soft-scroll overflow-x-auto">
        <table className="min-w-[1060px] w-full border-collapse text-left text-sm">
          <thead className="bg-[rgba(77,49,64,0.045)] text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
            <tr>
              <Th>Asset</Th>
              <Th>Format</Th>
              <Th>Hook</Th>
              <Th>Person</Th>
              <Th>Claim</Th>
              <Th>Placement</Th>
              <Th align="right">Spend</Th>
              <Th align="right">Revenue</Th>
              <Th align="right">Sales</Th>
              <Th align="right">Days</Th>
            </tr>
          </thead>
          <tbody>
            {performanceAssets.map((asset) => {
              const lowData =
                asset.attributed_sales < minSales || asset.days_live < minDays;
              const weak =
                asset.attributed_revenue / Math.max(asset.spend, 1) < 1;
              return (
                <tr
                  key={asset.id}
                  className="border-t border-[rgba(223,211,197,0.72)]"
                >
                  <Td>
                    <div className="flex items-center gap-3">
                      <Thumb asset={asset} />
                      <div>
                        <div className="font-semibold text-[var(--ink)]">
                          {asset.label}
                        </div>
                        <div className="mt-1 text-xs text-[var(--muted)]">
                          {asset.length_seconds
                            ? `${asset.length_seconds}s`
                            : "non-video"}
                          {lowData ? " - low sample" : weak ? " - underperformer" : ""}
                        </div>
                      </div>
                    </div>
                  </Td>
                  <Td>{asset.format}</Td>
                  <Td>{asset.hook_type}</Td>
                  <Td>{asset.person}</Td>
                  <Td>{asset.claim}</Td>
                  <Td>{asset.placement}</Td>
                  <Td align="right">{currency.format(asset.spend)}</Td>
                  <Td align="right">
                    <div className="flex min-w-32 items-center justify-end gap-3">
                      <div className="h-2 w-20 rounded-full bg-[rgba(157,89,68,0.12)]">
                        <div
                          className="h-2 rounded-full bg-[var(--clay)]"
                          style={{
                            width: `${Math.max(
                              8,
                              (asset.attributed_revenue / maxRevenue) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                      <span>{currency.format(asset.attributed_revenue)}</span>
                    </div>
                  </Td>
                  <Td align="right">{asset.attributed_sales}</Td>
                  <Td align="right">{asset.days_live}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={clsx("px-4 py-3 font-semibold", align === "right" && "text-right")}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <td
      className={clsx(
        "px-4 py-4 align-middle text-[var(--muted)]",
        align === "right" && "text-right tabular-nums",
      )}
    >
      {children}
    </td>
  );
}

function Thumb({ asset }: { asset: ContentAsset }) {
  const tone =
    asset.hook_type === "founder-to-camera"
      ? "bg-[var(--sage-soft)] text-[var(--sage)]"
      : asset.hook_type === "discount"
        ? "bg-[var(--rose-soft)] text-[var(--rose)]"
        : "bg-[var(--amber-soft)] text-[var(--amber)]";

  return (
    <div
      className={clsx(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/70 text-xs font-bold uppercase shadow-sm",
        tone,
      )}
    >
      {asset.format === "UGC video" ? "UGC" : asset.format.slice(0, 3)}
    </div>
  );
}

function RevenueChartPanel() {
  const [mounted, setMounted] = useState(false);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const chartData = useMemo(
    () =>
      [...performanceAssets]
        .sort((a, b) => b.attributed_revenue - a.attributed_revenue)
        .slice(0, 8)
        .map((asset) => ({
          name: asset.label.replace(" - ", "\n"),
          revenue: asset.attributed_revenue,
          spend: asset.spend,
          roas: Number((asset.attributed_revenue / asset.spend).toFixed(2)),
        })),
    [],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;

    const updateWidth = () => {
      setChartWidth(Math.floor(element.getBoundingClientRect().width));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="display-font text-2xl font-semibold">Revenue rank</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Top assets by attributed revenue.
          </p>
        </div>
        <Badge tone="sage">ROAS visible</Badge>
      </div>
      <div ref={chartRef} className="h-[360px] w-full overflow-hidden">
        {mounted && chartWidth > 0 ? (
          <BarChart
            data={chartData}
            width={chartWidth}
            height={360}
            layout="vertical"
            margin={{ left: 8, right: 16 }}
          >
            <CartesianGrid horizontal={false} stroke="rgba(118,108,98,0.18)" />
            <XAxis
              type="number"
              tickFormatter={(value) => `$${Number(value) / 1000}k`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={116}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(157,89,68,0.08)" }}
              formatter={(value, name) => [
                name === "roas" ? `${value}x` : currency.format(Number(value)),
                name === "roas" ? "ROAS" : "Revenue",
              ]}
              contentStyle={{
                border: "1px solid var(--line)",
                borderRadius: 14,
                background: "var(--paper-strong)",
                boxShadow: "var(--shadow)",
              }}
            />
            <Bar dataKey="revenue" radius={[0, 8, 8, 0]} fill="var(--clay)" />
          </BarChart>
        ) : (
          <div className="h-full rounded-xl bg-[rgba(118,108,98,0.08)]" />
        )}
      </div>
    </section>
  );
}

function AnalysisResults({ result }: { result: AnalyzeApiResponse }) {
  return (
    <div className="space-y-5">
      <ModeIndicator result={result} />
      <div className="grid gap-5 lg:grid-cols-3">
        {result.winning_elements.map((item, index) => (
          <motion.article
            key={item.element}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="display-font text-2xl font-semibold leading-tight">
                {item.element}
              </h3>
              <ConfidenceBadge confidence={item.confidence} />
            </div>
            <LabeledText label="Evidence" text={item.evidence} />
            <LabeledText label="Inference" text={item.inferred_why} />
            <LabeledText
              label="False explanations checked"
              text={item.false_explanations_checked}
            />
          </motion.article>
        ))}
      </div>

      <section className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-sm sm:p-6">
        <h3 className="display-font text-2xl font-semibold">What to make next</h3>
        <div className="mt-5 grid gap-4">
          {result.next_priorities.map((priority, index) => (
            <div
              key={priority.priority}
              className="grid gap-4 rounded-xl border border-[rgba(223,211,197,0.82)] bg-white/50 p-4 md:grid-cols-[48px_1fr]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--plum)] text-sm font-semibold text-white">
                {index + 1}
              </div>
              <div className="space-y-3">
                <h4 className="text-base font-semibold text-[var(--ink)]">
                  {priority.priority}
                </h4>
                <div className="grid gap-3 md:grid-cols-3">
                  <MiniField label="Expected payoff" text={priority.expected_payoff} />
                  <MiniField label="Recommended test" text={priority.how_to_test} />
                  <MiniField
                    label="Discontinue when"
                    text={priority.when_to_discontinue}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-[var(--line)] bg-[rgba(255,250,243,0.72)] p-5 shadow-sm">
          <h3 className="display-font text-2xl font-semibold">Excluded for low data</h3>
          <div className="mt-4 space-y-3">
            {result.left_out_low_data.map((item) => (
              <div
                key={item.asset}
                className="rounded-xl border border-[var(--line)] bg-white/50 p-4"
              >
                <div className="font-semibold text-[var(--ink)]">{item.asset}</div>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[rgba(255,250,243,0.72)] p-5 shadow-sm">
          <h3 className="display-font text-2xl font-semibold">Open questions</h3>
          <ul className="mt-4 space-y-3">
            {result.open_questions.map((question) => (
              <li key={question} className="flex gap-3 text-sm leading-6 text-[var(--muted)]">
                <ArrowDownRight className="mt-1 shrink-0 text-[var(--clay)]" size={16} />
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function BrandSpecPanel({
  brandSpec,
  setBrandSpec,
}: {
  brandSpec: BrandSpec;
  setBrandSpec: (brandSpec: BrandSpec) => void;
}) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="display-font text-2xl font-semibold">Brand spec</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Lumi Beauty constraints sent with each generation request.
          </p>
        </div>
        <LockKeyhole className="text-[var(--clay)]" size={20} />
      </div>
      <div className="space-y-4">
        <FieldLabel label="Voice and tone">
          <textarea
            value={brandSpec.voice_spec}
            onChange={(event) =>
              setBrandSpec({ ...brandSpec, voice_spec: event.target.value })
            }
            className="min-h-24 w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3 text-sm leading-6 outline-none transition focus:border-[var(--clay)]"
          />
        </FieldLabel>
        <FieldLabel label="Words to always use">
          <CommaInput
            value={brandSpec.do_words}
            onChange={(do_words) => setBrandSpec({ ...brandSpec, do_words })}
          />
        </FieldLabel>
        <FieldLabel label="Words to never use">
          <CommaInput
            value={brandSpec.dont_words}
            onChange={(dont_words) => setBrandSpec({ ...brandSpec, dont_words })}
          />
        </FieldLabel>
        <FieldLabel label="Approved claims">
          <CommaInput
            value={brandSpec.approved_claims}
            onChange={(approved_claims) =>
              setBrandSpec({ ...brandSpec, approved_claims })
            }
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {brandSpec.approved_claims.map((claim) => (
              <ClaimChip key={claim} claim={claim} approved />
            ))}
          </div>
        </FieldLabel>
      </div>
    </section>
  );
}

function GeneratorControls({
  winners,
  selectedId,
  setSelectedId,
  placement,
  setPlacement,
  format,
  setFormat,
  length,
  setLength,
  n,
  setN,
  selectedWinner,
}: {
  winners: ContentAsset[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  placement: string;
  setPlacement: (value: string) => void;
  format: string;
  setFormat: (value: string) => void;
  length: string;
  setLength: (value: string) => void;
  n: number;
  setN: (value: number) => void;
  selectedWinner?: ContentAsset;
}) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h3 className="display-font text-2xl font-semibold">Generation brief</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          A proven winner becomes the constraint, not a loose inspiration.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldLabel label="Proven winner">
          <select
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            className="h-12 w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 text-sm outline-none transition focus:border-[var(--clay)]"
          >
            {winners.map((winner) => (
              <option key={winner.id} value={winner.id}>
                {winner.label}
              </option>
            ))}
          </select>
        </FieldLabel>
        <FieldLabel label="Placement">
          <select
            value={placement}
            onChange={(event) => setPlacement(event.target.value)}
            className="h-12 w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 text-sm outline-none transition focus:border-[var(--clay)]"
          >
            <option>paid social</option>
            <option>product page</option>
            <option>email</option>
          </select>
        </FieldLabel>
        <FieldLabel label="Format">
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value)}
            className="h-12 w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 text-sm outline-none transition focus:border-[var(--clay)]"
          >
            <option>UGC video</option>
            <option>studio video</option>
            <option>static image</option>
            <option>carousel</option>
          </select>
        </FieldLabel>
        <FieldLabel label="Length">
          <select
            value={length}
            onChange={(event) => setLength(event.target.value)}
            className="h-12 w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 text-sm outline-none transition focus:border-[var(--clay)]"
          >
            <option>under 15 seconds</option>
            <option>15 to 20 seconds</option>
            <option>short carousel</option>
            <option>email module</option>
          </select>
        </FieldLabel>
        <FieldLabel label="Versions">
          <input
            type="number"
            min={1}
            max={5}
            value={n}
            onChange={(event) => setN(Number(event.target.value))}
            className="h-12 w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 text-sm outline-none transition focus:border-[var(--clay)]"
          />
        </FieldLabel>
      </div>

      {selectedWinner ? (
        <div className="mt-5 rounded-xl border border-[var(--line)] bg-white/50 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <BadgeCheck size={16} className="text-[var(--sage)]" />
            Winning attributes
          </div>
          <div className="flex flex-wrap gap-2">
            {describeWinner(selectedWinner)
              .split(", ")
              .map((item) => (
                <Badge key={item} tone="neutral">
                  {item}
                </Badge>
              ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function GenerationResults({
  result,
  brandSpec,
}: {
  result: GenerateApiResponse;
  brandSpec: BrandSpec;
}) {
  const threshold = 80;

  return (
    <div className="space-y-5">
      <ModeIndicator result={result} />

      {result.needs_approval.length || result.needs_more_info.length ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {result.needs_approval.length ? (
            <GuardrailPanel
              title="Needs approval"
              tone="rose"
              items={result.needs_approval}
            />
          ) : null}
          {result.needs_more_info.length ? (
            <GuardrailPanel
              title="Needs more info"
              tone="amber"
              items={result.needs_more_info}
            />
          ) : null}
        </section>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-3">
        {result.versions.map((version, index) => {
          const below = version.on_brand_score < threshold;
          return (
            <motion.article
              key={`${version.hook_type}-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={clsx(
                "rounded-2xl border bg-[var(--paper)] p-5 shadow-sm",
                below ? "border-[rgba(173,93,89,0.72)]" : "border-[var(--line)]",
              )}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--clay-dark)]">
                    {version.hook_type}
                  </div>
                  <h3 className="display-font mt-1 text-2xl font-semibold leading-tight">
                    Version {index + 1}
                  </h3>
                </div>
                <ScoreBadge score={version.on_brand_score} />
              </div>
              {below ? (
                <div className="mb-4 rounded-xl border border-[rgba(173,93,89,0.36)] bg-[var(--rose-soft)] px-3 py-2 text-sm font-semibold text-[var(--rose)]">
                  Below brand bar - do not ship.
                </div>
              ) : null}
              <p className="text-sm leading-7 text-[var(--ink)]">{version.script}</p>
              <div className="mt-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                  Claims used
                </div>
                <div className="flex flex-wrap gap-2">
                  {version.claims_used.map((claim) => (
                    <ClaimChip
                      key={claim}
                      claim={claim}
                      approved={brandSpec.approved_claims.includes(claim)}
                    />
                  ))}
                </div>
              </div>
              <LabeledText label="Reason" text={version.reason} />
              <LabeledText label="What it kept" text={version.what_it_kept} />
            </motion.article>
          );
        })}
      </section>
    </div>
  );
}

function ModeIndicator({
  result,
}: {
  result: { mode: "live" | "mock"; provider?: string };
}) {
  return (
    <div className="flex justify-end">
      <div
        className={clsx(
          "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
          result.mode === "mock"
            ? "border-[rgba(168,115,46,0.28)] bg-[var(--amber-soft)] text-[var(--amber)]"
            : "border-[rgba(102,119,101,0.28)] bg-[var(--sage-soft)] text-[var(--sage)]",
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {result.mode === "mock"
          ? "demo mode"
          : `live${result.provider ? ` via ${result.provider}` : ""}`}
      </div>
    </div>
  );
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function CommaInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <input
      value={value.join(", ")}
      onChange={(event) =>
        onChange(
          event.target.value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        )
      }
      className="h-12 w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 text-sm outline-none transition focus:border-[var(--clay)]"
    />
  );
}

function ClaimChip({ claim, approved }: { claim: string; approved: boolean }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold",
        approved
          ? "border-[rgba(102,119,101,0.28)] bg-[var(--sage-soft)] text-[var(--sage)]"
          : "border-[rgba(173,93,89,0.34)] bg-[var(--rose-soft)] text-[var(--rose)]",
      )}
    >
      {approved ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
      {claim}
    </span>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "sage" | "amber" | "rose" | "neutral";
}) {
  const styles = {
    sage: "border-[rgba(102,119,101,0.28)] bg-[var(--sage-soft)] text-[var(--sage)]",
    amber:
      "border-[rgba(168,115,46,0.28)] bg-[var(--amber-soft)] text-[var(--amber)]",
    rose: "border-[rgba(173,93,89,0.34)] bg-[var(--rose-soft)] text-[var(--rose)]",
    neutral: "border-[var(--line)] bg-white/55 text-[var(--muted)]",
  }[tone];

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        styles,
      )}
    >
      {children}
    </span>
  );
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const tone =
    confidence === "High" ? "sage" : confidence === "Medium" ? "amber" : "rose";
  return <Badge tone={tone}>{confidence}</Badge>;
}

function ScoreBadge({ score }: { score: number }) {
  const tone = score >= 90 ? "sage" : score >= 80 ? "amber" : "rose";
  return <Badge tone={tone}>{score}/100</Badge>;
}

function LabeledText({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-5">
      <div className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
        {label}
      </div>
      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{text}</p>
    </div>
  );
}

function MiniField({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
        {label}
      </div>
      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{text}</p>
    </div>
  );
}

function GuardrailPanel({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "rose" | "amber";
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border p-5 shadow-sm",
        tone === "rose"
          ? "border-[rgba(173,93,89,0.34)] bg-[var(--rose-soft)]"
          : "border-[rgba(168,115,46,0.32)] bg-[var(--amber-soft)]",
      )}
    >
      <div className="mb-3 flex items-center gap-2 font-semibold text-[var(--ink)]">
        <AlertTriangle size={18} />
        {title}
      </div>
      <ul className="space-y-2 text-sm leading-6 text-[var(--muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-[rgba(173,93,89,0.34)] bg-[var(--rose-soft)] p-5 text-sm font-medium text-[var(--rose)]">
      {message}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[rgba(118,108,98,0.34)] bg-[rgba(255,250,243,0.52)] p-8 text-center">
      <BarChart3 className="mx-auto text-[var(--clay)]" size={28} />
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
        Run analysis to separate repeatable sales signals from thin or misleading
        data.
      </p>
    </div>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <SkeletonCard key={item} />
      ))}
    </div>
  );
}

function GenerationSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <SkeletonCard key={item} />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-sm">
      <div className="h-4 w-24 animate-pulse rounded-full bg-[rgba(118,108,98,0.16)]" />
      <div className="mt-5 h-7 w-3/4 animate-pulse rounded-full bg-[rgba(118,108,98,0.16)]" />
      <div className="mt-6 space-y-3">
        <div className="h-3 animate-pulse rounded-full bg-[rgba(118,108,98,0.12)]" />
        <div className="h-3 w-5/6 animate-pulse rounded-full bg-[rgba(118,108,98,0.12)]" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-[rgba(118,108,98,0.12)]" />
      </div>
    </div>
  );
}

function describeWinner(asset: ContentAsset) {
  return [
    asset.hook_type,
    asset.format,
    `${asset.length_seconds || "non-video"}${asset.length_seconds ? "s" : ""}`,
    `${asset.person} on camera`,
    asset.claim,
    `${currency.format(asset.attributed_revenue)} revenue`,
    `${percent.format(asset.hold_rate)} hold rate`,
  ].join(", ");
}
