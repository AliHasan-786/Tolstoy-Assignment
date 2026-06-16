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

export function AccountWorkbench() {
  const [activeTab, setActiveTab] = useState<Tab>("loop");

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-7 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <TopBar />
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

function TopBar() {
  return (
    <header className="flex min-h-12 items-center justify-between border-b border-[var(--line)] pb-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1" aria-hidden="true">
          <span className="h-3.5 w-3.5 rounded-full bg-black" />
          <span className="h-3.5 w-3.5 rounded-full bg-black" />
        </div>
        <span className="text-xl font-bold leading-none text-[var(--ink)]">
          Tolstoy account workbench
        </span>
      </div>
      <div className="hidden items-center gap-2 sm:flex">
        <span className="rounded-full bg-[var(--gray-soft)] px-4 py-2 text-sm font-medium text-[var(--ink)]">
          Seeded beauty case
        </span>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-8 sm:pt-12">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--gray-soft)] px-4 py-2 text-sm font-medium text-[var(--ink)] sm:hidden">
            Seeded beauty case
          </div>
          <h1 className="max-w-4xl text-5xl font-normal leading-[1.05] text-[var(--ink)] sm:text-6xl lg:text-[76px]">
            Measurement before generation.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-7 text-[var(--ink)] sm:text-xl">
            A working version of the strategy: connect content elements to
            purchases, then generate only from proven patterns and approved claims.
          </p>
        </div>
        <div className="grid w-full grid-cols-3 gap-3 md:max-w-[390px]">
          <StatTile label="Tagged assets" value="14" tone="lavender" />
          <StatTile label="Purchases" value="4,652" tone="sky" />
          <StatTile label="Revenue" value="$250k" tone="sage" />
        </div>
      </div>
    </section>
  );
}

function StatTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "lavender" | "sky" | "sage";
}) {
  const toneClass = {
    lavender: "bg-[var(--lavender)]",
    sky: "bg-[var(--sky-soft)]",
    sage: "bg-[var(--sage-soft)]",
  }[tone];

  return (
    <div className={clsx("rounded-2xl border border-[var(--line)] px-4 py-4", toneClass)}>
      <div className="text-xs font-medium text-[var(--muted)]">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-[var(--ink)]">{value}</div>
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
    <div className="grid rounded-full border border-[var(--line)] bg-[var(--gray-soft)] p-1 sm:w-fit sm:grid-cols-2">
      <button
        type="button"
        onClick={() => onChange("loop")}
        className={clsx(
          "flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition",
          activeTab === "loop"
            ? "bg-black text-white"
            : "text-[var(--muted)] hover:text-[var(--ink)]",
        )}
      >
        <BarChart3 size={17} />
        Measure
      </button>
      <button
        type="button"
        onClick={() => onChange("engine")}
        className={clsx(
          "flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition",
          activeTab === "engine"
            ? "bg-black text-white"
            : "text-[var(--muted)] hover:text-[var(--ink)]",
        )}
      >
        <FlaskConical size={17} />
        Generate
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
        eyebrow="Step 1: measurement"
        title="Find repeatable sales signals before recommending new content."
        action={
          <PrimaryButton onClick={runAnalysis} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <TrendingUp size={18} />}
            Run analysis
          </PrimaryButton>
        }
      />

      <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
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
        eyebrow="Step 2: guarded generation"
        title="Generate from a measured winner, inside brand and claim constraints."
        action={
          <PrimaryButton onClick={generate} disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <FlaskConical size={18} />
            )}
            Generate variations
          </PrimaryButton>
        }
      />

      <div className="grid items-start gap-5 lg:grid-cols-[0.9fr_1.1fr]">
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
    <div className="flex flex-col gap-4 rounded-[18px] border border-[var(--line)] bg-[var(--gray-soft)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <div className="text-sm font-medium text-[var(--muted)]">
          {eyebrow}
        </div>
        <h2 className="mt-2 max-w-3xl text-3xl font-normal leading-tight text-[var(--ink)] sm:text-4xl">
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
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--clay-dark)] disabled:opacity-60"
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
    <section className="min-w-0 self-start overflow-hidden rounded-[18px] border border-[var(--line)] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-4 sm:px-5">
        <div>
          <h3 className="text-xl font-medium sm:text-2xl">Tagged content assets</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Seeded case data with spend, attributed purchases, revenue, and sample thresholds.
          </p>
        </div>
        <div className="hidden rounded-full border border-[var(--line)] px-3 py-1 text-xs font-medium text-[var(--muted)] sm:block">
          Minimum sample: {minSales} purchases / {minDays} days
        </div>
      </div>
      <div className="soft-scroll max-h-[560px] overflow-auto">
        <table className="min-w-[720px] w-full border-collapse text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-[var(--gray-soft)] text-xs text-[var(--muted)] shadow-[inset_0_-1px_0_var(--line)]">
            <tr>
              <Th>Asset</Th>
              <Th>Type</Th>
              <Th>Content signal</Th>
              <Th align="right">Spend</Th>
              <Th align="right">Revenue</Th>
              <Th align="right">Sample</Th>
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
                  className="border-t border-[var(--line)] transition hover:bg-[var(--gray-soft)]/55"
                >
                  <Td>
                    <div className="flex items-center gap-3">
                      <Thumb asset={asset} />
                      <div className="min-w-0">
                        <div className="max-w-[210px] font-semibold leading-snug text-[var(--ink)]">
                          {asset.label}
                        </div>
                        <div className="mt-1 text-xs text-[var(--muted)]">
                          {assetMeta(asset, lowData, weak)}
                        </div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div className="font-medium text-[var(--ink)]">
                      {displayFormat(asset.format)}
                    </div>
                    <div className="mt-1 text-xs text-[var(--muted)]">
                      {asset.person} / {asset.placement}
                    </div>
                  </Td>
                  <Td>
                    <div className="font-medium text-[var(--ink)]">
                      {asset.hook_type}
                    </div>
                    <div className="mt-1 max-w-[170px] text-xs leading-5 text-[var(--muted)]">
                      {asset.claim}
                    </div>
                  </Td>
                  <Td align="right">{currency.format(asset.spend)}</Td>
                  <Td align="right">
                    <div className="flex min-w-28 items-center justify-end gap-3">
                      <div className="h-2 w-16 rounded-full bg-[var(--gray-soft)]">
                        <div
                          className="h-2 rounded-full bg-black"
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
                  <Td align="right">
                    <div className="font-medium text-[var(--ink)]">
                      {asset.attributed_sales} purchases
                    </div>
                    <div className="mt-1 text-xs text-[var(--muted)]">
                      {asset.days_live} days
                    </div>
                  </Td>
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
      className={clsx(
        "px-3 py-2.5 font-semibold",
        align === "right" && "text-right",
      )}
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
        "px-3 py-3 align-middle text-[var(--muted)]",
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
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-white/70 text-xs font-bold",
        tone,
      )}
    >
      {assetThumbLabel(asset)}
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
    <section className="h-fit min-w-0 self-start rounded-[18px] border border-[var(--line)] bg-[var(--sky-soft)] p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl font-medium">Revenue by asset</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Top assets by attributed revenue.
          </p>
        </div>
      </div>
      <div ref={chartRef} className="h-[330px] w-full overflow-hidden">
        {mounted && chartWidth > 0 ? (
          <BarChart
            data={chartData}
            width={chartWidth}
            height={330}
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
              cursor={{ fill: "rgba(24,24,27,0.06)" }}
              formatter={(value, name) => [
                name === "roas"
                  ? `${value} revenue per dollar`
                  : currency.format(Number(value)),
                name === "roas" ? "Revenue per dollar" : "Revenue",
              ]}
              contentStyle={{
                border: "1px solid var(--line)",
                borderRadius: 14,
                background: "var(--paper-strong)",
                boxShadow: "var(--shadow)",
              }}
            />
            <Bar dataKey="revenue" radius={[0, 8, 8, 0]} fill="var(--ink)" />
          </BarChart>
        ) : (
          <div className="h-full rounded-xl bg-[rgba(118,108,98,0.08)]" />
        )}
      </div>
    </section>
  );
}

function AnalysisResults({ result }: { result: AnalyzeApiResponse }) {
  const cardTones = [
    "bg-[var(--lavender)]",
    "bg-[var(--sky-soft)]",
    "bg-[var(--sage-soft)]",
  ];

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
            className={clsx(
              "rounded-2xl border border-[var(--line)] p-5",
              cardTones[index % cardTones.length],
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-2xl font-semibold leading-tight">
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

      <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-6">
        <h3 className="text-2xl font-medium">What to make next</h3>
        <div className="mt-5 grid gap-4">
          {result.next_priorities.map((priority, index) => (
            <div
              key={priority.priority}
              className="grid gap-4 rounded-xl border border-[var(--line)] bg-white p-4 md:grid-cols-[48px_1fr]"
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
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--gray-soft)] p-5 ">
          <h3 className="text-2xl font-semibold">Excluded for low data</h3>
          <div className="mt-4 space-y-3">
            {result.left_out_low_data.map((item) => (
              <div
                key={item.asset}
                className="rounded-xl border border-[var(--line)] bg-white p-4"
              >
                <div className="font-semibold text-[var(--ink)]">{item.asset}</div>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--gray-soft)] p-5 ">
          <h3 className="text-2xl font-semibold">Open questions</h3>
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
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--lavender)] p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl font-medium">Brand spec</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Case brand constraints sent with each generation request.
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
            className="min-h-24 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-sm leading-6 outline-none transition focus:border-[var(--clay)]"
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
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--sky-soft)] p-5 sm:p-6">
      <div className="mb-5">
        <h3 className="text-2xl font-medium">Generation brief</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          A proven winner becomes the constraint, not a loose inspiration.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldLabel label="Measured winner">
          <select
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            className="h-12 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm outline-none transition focus:border-[var(--clay)]"
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
            className="h-12 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm outline-none transition focus:border-[var(--clay)]"
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
            className="h-12 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm outline-none transition focus:border-[var(--clay)]"
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
            className="h-12 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm outline-none transition focus:border-[var(--clay)]"
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
            className="h-12 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm outline-none transition focus:border-[var(--clay)]"
          />
        </FieldLabel>
      </div>

      {selectedWinner ? (
        <div className="mt-5 rounded-xl border border-[var(--line)] bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <BadgeCheck size={16} className="text-[var(--sage)]" />
            Preserved winner elements
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
  const cardTones = [
    "bg-[var(--lavender)]",
    "bg-[var(--sky-soft)]",
    "bg-[var(--sage-soft)]",
  ];

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
                "rounded-2xl border p-5",
                below
                  ? "border-[rgba(180,35,24,0.45)] bg-[var(--rose-soft)]"
                  : `border-[var(--line)] ${cardTones[index % cardTones.length]}`,
              )}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-[var(--clay-dark)]">
                    {version.hook_type}
                  </div>
                  <h3 className="mt-1 text-2xl font-semibold leading-tight">
                    Version {index + 1}
                  </h3>
                </div>
                <ScoreBadge score={version.on_brand_score} />
              </div>
              {below ? (
                <div className="mb-4 rounded-xl border border-[rgba(173,93,89,0.36)] bg-[var(--rose-soft)] px-3 py-2 text-sm font-semibold text-[var(--rose)]">
                  Below brand bar. Do not ship.
                </div>
              ) : null}
              <p className="text-sm leading-7 text-[var(--ink)]">{version.script}</p>
              <div className="mt-5">
                <div className="mb-2 text-xs font-semibold text-[var(--muted)]">
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
          ? "seeded fallback"
          : result.provider === "anthropic"
            ? "Claude live run"
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
      <span className="mb-2 block text-xs font-semibold text-[var(--muted)]">
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
      className="h-12 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm outline-none transition focus:border-[var(--clay)]"
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
    neutral: "border-[var(--line)] bg-white text-[var(--muted)]",
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
      <div className="text-xs font-semibold text-[var(--muted)]">
        {label}
      </div>
      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{text}</p>
    </div>
  );
}

function MiniField({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="text-xs font-semibold text-[var(--muted)]">
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
        "rounded-2xl border p-5 ",
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
    <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--gray-soft)] p-8 text-center">
      <BarChart3 className="mx-auto text-[var(--ink)]" size={28} />
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
        Run analysis to separate repeatable purchase signals from thin or misleading
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
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 ">
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
    `${percent.format(asset.hold_rate)} video completion rate`,
  ].join(", ");
}

function assetMeta(asset: ContentAsset, lowData: boolean, weak: boolean) {
  const details = [asset.length_seconds ? `${asset.length_seconds}s` : "non-video"];
  if (lowData) {
    details.push("low sample");
  } else if (weak) {
    details.push("underperformer");
  }
  return details.join(" / ");
}

function assetThumbLabel(asset: ContentAsset) {
  if (asset.format === "UGC video") return "UGC";
  if (asset.format === "studio video") return "VID";
  if (asset.format === "static image") return "IMG";
  return "CAR";
}

function displayFormat(format: ContentAsset["format"]) {
  if (format === "UGC video") return "Creator-style video";
  if (format === "studio video") return "Studio video";
  if (format === "static image") return "Static image";
  return "Carousel";
}
