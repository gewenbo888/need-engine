"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { T, useLang } from "./lang";
import { DESIRE_TRADITIONS, DesireTradition } from "./content";

/* ─── types ─────────────────────────────────────────────────── */
interface Point {
  t: number;   // simulation tick
  sat: number; // satisfaction value (0–100)
  base: number; // baseline at this tick
}

interface SimState {
  baseline: number;     // current hedonic baseline (20–80)
  tolerance: number;    // tolerance multiplier — grows after each reward (1 → ∞)
  rewardSize: number;   // size of the most recent reward spike
  satisfaction: number; // current felt satisfaction
  tick: number;
}

/* ─── constants ─────────────────────────────────────────────── */
const MAX_POINTS = 160;
const DECAY_RATE = 0.12;         // how fast a spike decays back toward baseline
const BASELINE_CREEP = 1.4;      // baseline rises by this per reward
const TOLERANCE_GROWTH = 0.13;   // tolerance multiplier increment per reward
const INITIAL_REWARD = 22;       // starting spike size
const AUTO_INTERVAL_MS = 1400;   // ms between auto rewards
const TICK_INTERVAL_MS = 60;     // animation step

/* ─── helpers ────────────────────────────────────────────────── */
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function stateInterpretation(
  tolerance: number,
  netSat: number,
  baseline: number,
  lang: "en" | "zh"
): string {
  if (tolerance < 1.4) {
    return lang === "en"
      ? "Early stage — each reward still delivers a genuine lift."
      : "早期阶段——每次奖赏仍带来真实的提升。";
  }
  if (tolerance < 2.2) {
    return lang === "en"
      ? "Tolerance rising — you need more to feel the same."
      : "耐受攀升——你需要更多，才能感受到同样的满足。";
  }
  if (tolerance < 3.2) {
    return lang === "en"
      ? "The treadmill is running — bigger rewards, same net satisfaction."
      : "跑步机在运转——奖赏更大，净满足依然持平。";
  }
  return lang === "en"
    ? "Deep adaptation — the ground moves as fast as you run."
    : "深度适应——地面移动得和你奔跑一样快。";
}

/* ─── SVG chart ──────────────────────────────────────────────── */
function TreadmillChart({
  points,
  width,
  height,
}: {
  points: Point[];
  width: number;
  height: number;
}) {
  if (points.length < 2) return null;

  const minT = points[0].t;
  const maxT = points[points.length - 1].t;
  const rangeT = Math.max(maxT - minT, 1);

  const px = (t: number) => ((t - minT) / rangeT) * width;
  const py = (v: number) => height - (clamp(v, 0, 100) / 100) * height;

  // satisfaction polyline
  const satPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${px(p.t).toFixed(1)},${py(p.sat).toFixed(1)}`)
    .join(" ");

  // baseline polyline
  const basePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${px(p.t).toFixed(1)},${py(p.base).toFixed(1)}`)
    .join(" ");

  // fill under satisfaction line
  const fillPath =
    satPath +
    ` L${px(maxT).toFixed(1)},${height} L${px(minT).toFixed(1)},${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="htSatFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9d3c" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ff9d3c" stopOpacity="0.02" />
        </linearGradient>
        <filter id="htGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* horizontal grid lines */}
      {[25, 50, 75].map((v) => (
        <line
          key={v}
          x1={0}
          y1={py(v)}
          x2={width}
          y2={py(v)}
          stroke="#ffffff10"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
      ))}

      {/* satisfaction fill */}
      <path d={fillPath} fill="url(#htSatFill)" />

      {/* baseline — dashed magenta */}
      <path
        d={basePath}
        fill="none"
        stroke="#ff3d80"
        strokeWidth={1.5}
        strokeDasharray="5 3"
        opacity={0.7}
      />

      {/* satisfaction line */}
      <path
        d={satPath}
        fill="none"
        stroke="#ff9d3c"
        strokeWidth={2}
        filter="url(#htGlow)"
      />

      {/* current dot */}
      {(() => {
        const last = points[points.length - 1];
        return (
          <circle
            cx={px(last.t)}
            cy={py(last.sat)}
            r={3.5}
            fill="#ff9d3c"
            filter="url(#htGlow)"
          />
        );
      })()}
    </svg>
  );
}

/* ─── main component ─────────────────────────────────────────── */
export default function HedonicTreadmill() {
  const { lang } = useLang();

  /* sim state */
  const [sim, setSim] = useState<SimState>({
    baseline: 32,
    tolerance: 1,
    rewardSize: INITIAL_REWARD,
    satisfaction: 32,
    tick: 0,
  });
  const simRef = useRef<SimState>(sim);
  simRef.current = sim;

  /* chart points */
  const [points, setPoints] = useState<Point[]>([
    { t: 0, sat: 32, base: 32 },
  ]);
  const pointsRef = useRef<Point[]>(points);
  pointsRef.current = points;

  /* auto-run state */
  const [autoRun, setAutoRun] = useState(false);
  const autoRunRef = useRef(false);
  autoRunRef.current = autoRun;

  /* is spike active (satisfaction above baseline) */
  const spikeActiveRef = useRef(false);

  /* ── animation tick: decay back toward baseline ── */
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  const tick = useCallback(() => {
    const now = Date.now();
    const elapsed = now - lastTickRef.current;
    if (elapsed >= TICK_INTERVAL_MS) {
      lastTickRef.current = now;

      setSim((prev) => {
        const gap = prev.satisfaction - prev.baseline;
        const decay = gap * DECAY_RATE;
        const newSat = clamp(prev.satisfaction - decay, 0, 100);
        const newTick = prev.tick + 1;

        const newPoint: Point = { t: newTick, sat: newSat, base: prev.baseline };
        setPoints((pts) => {
          const next = [...pts, newPoint];
          return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next;
        });

        return { ...prev, satisfaction: newSat, tick: newTick };
      });
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  /* ── auto reward interval ── */
  const autoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fireReward = useCallback(() => {
    setSim((prev) => {
      // spike size = initial reward scaled up by tolerance; net felt benefit shrinks
      const rawSpike = prev.rewardSize;
      const feltSpike = rawSpike / prev.tolerance;

      // new satisfaction = baseline + felt spike (can exceed 100 briefly)
      const newSat = clamp(prev.baseline + feltSpike, prev.baseline, 100);

      // baseline creeps up (hedonic adaptation)
      const newBaseline = clamp(prev.baseline + BASELINE_CREEP, 20, 78);

      // tolerance grows → need larger rewards for same felt effect
      const newTolerance = prev.tolerance + TOLERANCE_GROWTH;

      // next reward size grows proportionally to tolerance (you escalate)
      const newRewardSize = INITIAL_REWARD * newTolerance;

      return {
        ...prev,
        satisfaction: newSat,
        baseline: newBaseline,
        tolerance: newTolerance,
        rewardSize: newRewardSize,
      };
    });
  }, []);

  useEffect(() => {
    if (autoRun) {
      autoIntervalRef.current = setInterval(fireReward, AUTO_INTERVAL_MS);
    } else {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
    }
    return () => {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
    };
  }, [autoRun, fireReward]);

  /* ── reset ── */
  const handleReset = useCallback(() => {
    setAutoRun(false);
    const initial: SimState = {
      baseline: 32,
      tolerance: 1,
      rewardSize: INITIAL_REWARD,
      satisfaction: 32,
      tick: 0,
    };
    setSim(initial);
    setPoints([{ t: 0, sat: 32, base: 32 }]);
  }, []);

  /* ── derived display values ── */
  const netSatisfaction = Math.round(clamp(sim.satisfaction - sim.baseline, -10, 100));
  const displayTolerance = sim.tolerance.toFixed(2);
  const displayBaseline = Math.round(sim.baseline);
  const displayReward = Math.round(sim.rewardSize);
  const displaySat = Math.round(sim.satisfaction);

  /* ── tradition panel ── */
  const [selectedKey, setSelectedKey] = useState<string>("buddhism");
  const selected: DesireTradition =
    DESIRE_TRADITIONS.find((d) => d.key === selectedKey) ?? DESIRE_TRADITIONS[0];

  return (
    <div className="holo rounded-2xl p-5 md:p-7 space-y-8">

      {/* ── title row ────────────────────────────────────────── */}
      <div>
        <p className="label-mono mb-1 text-ember-400">
          {lang === "en" ? "the hedonic treadmill" : "享乐跑步机"}
        </p>
        <h3 className="display text-2xl text-ghost-50 md:text-3xl">
          <T v={{ en: "Craving, Addiction & the Empty Space", zh: "渴求、成瘾与那片空" }} />
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ghost-400">
          <T v={{
            en: "You run. The ground moves. You stay in place. Every gain resets the baseline — the treadmill is the architecture of adaptation itself.",
            zh: "你奔跑，地面移动，你原地不动。每一次所得都重设基线——跑步机，正是适应本身的结构。",
          }} />
        </p>
      </div>

      {/* ── PART 1: Simulator ────────────────────────────────── */}
      <div className="space-y-5">

        {/* chart */}
        <div className="relative rounded-xl border border-white/5 bg-ink-900/60 overflow-hidden" style={{ height: 180 }}>
          <TreadmillChart points={points} width={800} height={180} />

          {/* legend overlay */}
          <div className="absolute top-2 right-3 flex items-center gap-4 text-[0.65rem] font-mono">
            <span className="flex items-center gap-1.5 text-ember-400">
              <span className="inline-block h-0.5 w-5 bg-ember-400 rounded" />
              <T v={{ en: "satisfaction", zh: "满足感" }} />
            </span>
            <span className="flex items-center gap-1.5 text-flame-400">
              <span className="inline-block h-0.5 w-5 border-t border-dashed border-flame-400" />
              <T v={{ en: "baseline", zh: "基线" }} />
            </span>
          </div>
        </div>

        {/* numeric readouts */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: { en: "Reward size", zh: "奖赏量" },
              value: displayReward,
              accent: "#ff9d3c",
              unit: "",
            },
            {
              label: { en: "Baseline", zh: "基线" },
              value: displayBaseline,
              accent: "#ff3d80",
              unit: "",
            },
            {
              label: { en: "Tolerance", zh: "耐受" },
              value: displayTolerance,
              accent: "#a855f7",
              unit: "×",
            },
            {
              label: { en: "Net satisfaction", zh: "净满足" },
              value: netSatisfaction,
              accent: "#2dd4ee",
              unit: "",
            },
          ].map((r) => (
            <div
              key={r.label.en}
              className="flex flex-col items-start gap-1 rounded-lg border border-white/5 bg-ink-900/40 px-3 py-3"
            >
              <span className="text-[0.65rem] font-mono uppercase tracking-widest text-ghost-500">
                <T v={r.label} />
              </span>
              <span
                className="mono tnum text-2xl font-bold leading-none"
                style={{ color: r.accent }}
              >
                {r.value}
                <span className="text-base opacity-60">{r.unit}</span>
              </span>
            </div>
          ))}
        </div>

        {/* interpretation line */}
        <div className="rounded-lg border border-white/5 bg-ink-900/30 px-4 py-2.5 text-xs text-ghost-300 leading-relaxed">
          <span className="label-mono mr-2 text-ember-500">
            {lang === "en" ? "state" : "状态"}
          </span>
          {stateInterpretation(sim.tolerance, netSatisfaction, sim.baseline, lang)}
        </div>

        {/* controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fireReward}
            className="crave-beat rounded-full border border-ember-500/40 bg-ember-500/10 px-5 py-2 text-sm font-semibold text-ember-300 transition hover:bg-ember-500/20 active:scale-95"
            style={{ boxShadow: "0 0 12px #ff9d3c22" }}
          >
            <T v={{ en: "Receive reward", zh: "获得奖赏" }}/>
          </button>

          <button
            onClick={() => setAutoRun((v) => !v)}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition active:scale-95 ${
              autoRun
                ? "border-flame-500/60 bg-flame-500/15 text-flame-300 pulse"
                : "border-white/10 bg-white/5 text-ghost-300 hover:border-flame-500/30 hover:text-flame-400"
            }`}
          >
            {autoRun
              ? <T v={{ en: "Stop auto-run", zh: "停止自动运行" }} />
              : <T v={{ en: "Auto-run", zh: "自动运行" }} />
            }
          </button>

          <button
            onClick={handleReset}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-ghost-500 transition hover:border-white/20 hover:text-ghost-300 active:scale-95"
          >
            <T v={{ en: "Reset", zh: "重置" }} />
          </button>

          {autoRun && (
            <span className="text-xs text-ghost-500 italic">
              <T v={{
                en: "Rewards escalate · baseline rises · net stays flat",
                zh: "奖赏升级 · 基线攀升 · 净值持平",
              }} />
            </span>
          )}
        </div>
      </div>

      {/* divider */}
      <div className="h-px rule-neon opacity-50" />

      {/* ── PART 2: Five traditions ───────────────────────────── */}
      <div className="space-y-5">
        <div>
          <p className="label-mono mb-0.5 text-mind-400">
            {lang === "en" ? "five traditions · one premise" : "五种传统 · 同一前提"}
          </p>
          <p className="text-sm text-ghost-400 leading-relaxed max-w-2xl">
            <T v={{
              en: "They disagree on almost everything — metaphysics, mechanism, cure — except the shared premise: unexamined, endless desire leads away from satisfaction. Consumer capitalism alone declines to treat this as a problem.",
              zh: "它们几乎在一切之上彼此分歧——形而上学、机制、治愈——唯独同意同一前提：未经审视的、无尽的欲望，离满足越来越远。只有消费资本主义，拒绝把这当作一个问题。",
            }} />
          </p>
        </div>

        {/* tradition tabs */}
        <div className="flex flex-wrap gap-2">
          {DESIRE_TRADITIONS.map((d) => (
            <button
              key={d.key}
              onClick={() => setSelectedKey(d.key)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition active:scale-95 ${
                selectedKey === d.key
                  ? "border-transparent text-ink-950"
                  : "border-white/10 bg-white/5 text-ghost-400 hover:border-white/20 hover:text-ghost-200"
              }`}
              style={
                selectedKey === d.key
                  ? { background: d.accent, boxShadow: `0 0 16px ${d.accent}55` }
                  : {}
              }
            >
              <T v={d.name} />
            </button>
          ))}
        </div>

        {/* selected tradition card */}
        <div
          className="rounded-xl border p-5 space-y-4 transition-all duration-300"
          style={{
            borderColor: `${selected.accent}33`,
            background: `${selected.accent}0d`,
          }}
        >
          {/* header */}
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span
              className="display text-xl font-bold"
              style={{ color: selected.accent }}
            >
              <T v={selected.name} />
            </span>
            <span className="mono text-xs text-ghost-500">
              <T v={selected.era} />
            </span>
          </div>

          {/* diagnosis */}
          <div>
            <p className="label-mono mb-1.5 text-ghost-500">
              {lang === "en" ? "diagnosis" : "诊断"}
            </p>
            <p className="text-sm leading-relaxed text-ghost-200">
              <T v={selected.diagnosis} />
            </p>
          </div>

          {/* prescription */}
          <div>
            <p
              className="label-mono mb-1.5"
              style={{ color: selected.accent }}
            >
              {selected.key === "capitalism"
                ? (lang === "en" ? "no prescription" : "无处方")
                : (lang === "en" ? "prescription" : "处方")}
            </p>
            <p className="text-sm leading-relaxed text-ghost-200">
              <T v={selected.prescription} />
            </p>
          </div>

          {/* capitalism special callout */}
          {selected.key === "capitalism" && (
            <div className="rounded-lg border border-signal-500/20 bg-signal-500/5 px-4 py-3 text-xs text-signal-300 leading-relaxed">
              <span className="font-semibold uppercase tracking-widest mr-2 text-signal-400">
                {lang === "en" ? "unique position" : "独特立场"}
              </span>
              <T v={{
                en: "Consumer capitalism is the only tradition that monetizes the disease instead of treating it — the treadmill is not a failure of the system but its engine.",
                zh: "消费资本主义是唯一一种将这疾病货币化、而非治愈它的传统——跑步机不是系统的故障，而是其引擎。",
              }} />
            </div>
          )}
        </div>

        {/* bottom caption */}
        <p className="text-[0.7rem] leading-relaxed text-ghost-600 max-w-2xl">
          <T v={{
            en: "The treadmill itself is mechanical — dopamine adaptation, not moral failure. What differs is what each tradition asks you to do with that knowledge.",
            zh: "跑步机本身是机械性的——多巴胺适应，而非道德失败。不同之处，在于每种传统要求你用这份知识去做什么。",
          }} />
        </p>
      </div>
    </div>
  );
}
