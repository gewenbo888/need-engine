"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { T, useLang } from "./lang";
import { BRAIN_DRIVERS } from "./content";

/* ─────────────────────────────────────────────
   DOPAMINE LAB · 多巴胺实验室
   Part 1 — RPE Simulator
   Part 2 — Habit loop ring with migration animation
   Part 3 — Brain-driver legend (wanting/liking/etc.)
───────────────────────────────────────────── */

const W = 600;
const H = 200;
const BASELINE_Y = 130;
const TRACE_LEN = 240;

// ---------- types ----------
interface TracePoint { x: number; y: number }

// ---------- colours ----------
const C = {
  ember:  "#ff9d3c",
  flame:  "#ff3d80",
  violet: "#a855f7",
  cyan:   "#2dd4ee",
  ghost5: "rgba(250,248,245,0.05)",
  ghost15:"rgba(250,248,245,0.15)",
  ghost40:"rgba(250,248,245,0.40)",
  ghost70:"rgba(250,248,245,0.70)",
  ink800: "#1c1a28",
  ink700: "#252336",
};

// ─── PART 1 helpers ──────────────────────────────────────────────────────────
function buildTrace(rpe: number): TracePoint[] {
  const pts: TracePoint[] = [];
  const clamped = Math.max(-100, Math.min(100, rpe));
  const peak    = -clamped * 0.85;   // SVG y: negative = up

  for (let i = 0; i <= TRACE_LEN; i++) {
    const t  = i / TRACE_LEN;
    const cx = (W / 2 - 80) + i * (1.2);  // slide across central region

    // Gaussian spike/dip at 40% along the trace
    const g  = Math.exp(-Math.pow((t - 0.4) * 8, 2));
    // For negative RPE add a rebound recovery
    let dy = peak * g;
    if (clamped < 0) {
      // extra shallow rebound after the dip
      const rebound = Math.abs(peak) * 0.15 * Math.exp(-Math.pow((t - 0.7) * 6, 2));
      dy += rebound;
    }
    pts.push({ x: cx, y: BASELINE_Y + dy });
  }
  return pts;
}

function tracePath(pts: TracePoint[]): string {
  if (!pts.length) return "";
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

function glowColor(rpe: number): string {
  if (rpe > 0)  return C.violet;
  if (rpe < 0)  return C.flame;
  return C.ghost40;
}

// ─── PART 2 helpers ──────────────────────────────────────────────────────────
// 4 nodes on a ring: Cue, Routine, Reward, Craving
const RING_NODES = [
  { key: "cue",     angle: -Math.PI / 2,         label: { en: "Cue",     zh: "线索" } },
  { key: "routine", angle: -Math.PI / 2 + Math.PI * 2 / 4,  label: { en: "Routine", zh: "惯例" } },
  { key: "reward",  angle: -Math.PI / 2 + Math.PI * 4 / 4,  label: { en: "Reward",  zh: "奖赏" } },
  { key: "craving", angle: -Math.PI / 2 + Math.PI * 6 / 4,  label: { en: "Craving", zh: "渴求" } },
] as const;

const RING_R  = 88;
const RING_CX = 160;
const RING_CY = 155;

function nodePos(angle: number) {
  return { x: RING_CX + RING_R * Math.cos(angle), y: RING_CY + RING_R * Math.sin(angle) };
}

// arc path from one node to next (clockwise curved arc on the ring)
function arcBetween(a1: number, a2: number): string {
  const p1 = nodePos(a1);
  const p2 = nodePos(a2);
  // Use a large-arc=0, sweep=1 arc along the ring circle radius
  return `M${p1.x.toFixed(1)},${p1.y.toFixed(1)} A${RING_R},${RING_R},0,0,1,${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
}

// Interpolate angle along the ring for a marker
function markerAngle(progress: number): number {
  // progress 0→1 = full lap; each quadrant = 0.25
  return -Math.PI / 2 + progress * Math.PI * 2;
}

// ─── INTERPRETATION strings ───────────────────────────────────────────────────
const INTERP = {
  positive: {
    en: "Unexpected reward — dopamine surges. The brain marks this cue as worth pursuing.",
    zh: "意外的奖赏——多巴胺涌现。大脑将此线索标记为值得追逐。",
  },
  flat: {
    en: "Fully predicted — no signal. Anticipation taught the brain; the reward itself teaches nothing.",
    zh: "完全被预测——没有信号。预期已经教导了大脑；奖赏本身不再教什么。",
  },
  negative: {
    en: "Expected reward failed to arrive — dopamine dips below baseline. Disappointment is the brain updating down.",
    zh: "期待的奖赏未能到来——多巴胺跌破基线。失望，是大脑向下修正预期。",
  },
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function DopamineLab() {
  const { lang } = useLang();

  // ── Part 1 state ──
  const [expected, setExpected] = useState(50);
  const [actual,   setActual]   = useState(70);
  const rpe = actual - expected;

  // animated draw fraction for the trace
  const [drawFrac, setDrawFrac] = useState(0);
  const drawRef  = useRef<number | null>(null);
  const prevRpe  = useRef<number>(rpe);

  const animateTrace = useCallback(() => {
    setDrawFrac(0);
    let start: number | null = null;
    const dur = 800;
    function frame(ts: number) {
      if (!start) start = ts;
      const frac = Math.min((ts - start) / dur, 1);
      setDrawFrac(frac);
      if (frac < 1) drawRef.current = requestAnimationFrame(frame);
    }
    drawRef.current = requestAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (Math.abs(rpe - prevRpe.current) > 0.5) {
      prevRpe.current = rpe;
      if (drawRef.current) cancelAnimationFrame(drawRef.current);
      animateTrace();
    }
  }, [rpe, animateTrace]);

  // initial draw on mount
  useEffect(() => {
    animateTrace();
    return () => { if (drawRef.current) cancelAnimationFrame(drawRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fullTrace = buildTrace(rpe);
  const visibleLen = Math.round(drawFrac * fullTrace.length);
  const trace = fullTrace.slice(0, visibleLen);
  const color = glowColor(rpe);

  // pulse radius for neuron
  const pulseR = Math.abs(rpe) / 100 * 18 + 4;
  const pulseOpacity = 0.25 + Math.abs(rpe) / 100 * 0.55;

  // ── Part 2 state ──
  const [trial,      setTrial]      = useState(0);
  const [markerProg, setMarkerProg] = useState(0);
  const [running,    setRunning]    = useState(false);
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef2 = useRef<number | null>(null);

  // How far the spike has "migrated" toward the cue (0=stays at reward=0.5, 1=fully at cue=0)
  // After trial 10 it should be fully at cue
  const migrationFrac = Math.min(trial / 10, 1);
  // spike node angle: interpolate between reward angle (index 2) and cue angle (index 0)
  const rewardAngle = RING_NODES[2].angle;
  const cueAngle    = RING_NODES[0].angle;
  // spike angle = lerp from reward to cue as migration increases
  const spikeAngle = rewardAngle + (cueAngle - rewardAngle) * migrationFrac;
  const spikePos   = nodePos(spikeAngle);

  const spikeNote = {
    en: migrationFrac < 0.3
      ? "Dopamine fires at the reward."
      : migrationFrac < 0.7
      ? "The spike is migrating toward the cue…"
      : "The spike has moved to the cue — the loop now runs without deciding.",
    zh: migrationFrac < 0.3
      ? "多巴胺在奖赏处放电。"
      : migrationFrac < 0.7
      ? "尖峰正在向线索迁移……"
      : "尖峰已迁移至线索——回路无须决定便自行运转。",
  };

  // Animate marker traveling around ring
  const animMarker = useCallback((targetTrials: number) => {
    const lapsNeeded = targetTrials;
    let start: number | null = null;
    const dur = lapsNeeded * 900; // 900ms per lap
    function frame(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const frac = Math.min(elapsed / dur, 1);
      setMarkerProg(frac * lapsNeeded % 1);
      if (frac < 1) {
        rafRef2.current = requestAnimationFrame(frame);
      } else {
        setMarkerProg(0);
        setRunning(false);
      }
    }
    rafRef2.current = requestAnimationFrame(frame);
  }, []);

  const runTrials = useCallback(() => {
    if (running) return;
    setRunning(true);
    const newTrial = Math.min(trial + 10, 10);
    // run 10 laps animation
    animMarker(10);
    // update trial count mid-way using interval
    let count = trial;
    loopRef.current = setInterval(() => {
      count = Math.min(count + 1, 10);
      setTrial(count);
      if (count >= newTrial) {
        if (loopRef.current) clearInterval(loopRef.current);
      }
    }, 900);
  }, [running, trial, animMarker]);

  const resetHabit = useCallback(() => {
    if (rafRef2.current) cancelAnimationFrame(rafRef2.current);
    if (loopRef.current) clearInterval(loopRef.current);
    setTrial(0);
    setMarkerProg(0);
    setRunning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef2.current) cancelAnimationFrame(rafRef2.current);
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, []);

  const markerA = markerAngle(markerProg);
  const markerPos = nodePos(markerA);

  // interpret
  const interpKey: "positive" | "flat" | "negative" =
    rpe > 4 ? "positive" : rpe < -4 ? "negative" : "flat";

  return (
    <div className="holo rounded-2xl p-5 md:p-7 space-y-8">

      {/* ── TITLE ROW ─────────────────────────────────────── */}
      <div>
        <p className="label-mono text-ember-400 mb-1">
          <T v={{ en: "dopamine lab", zh: "多巴胺实验室" }} />
        </p>
        <h3 className="display text-xl md:text-2xl text-ghost-50 leading-tight">
          <T v={{ en: "Reward Prediction Error", zh: "奖赏预测误差" }} />
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-ghost-400 max-w-2xl">
          <T v={{
            en: "Dopamine doesn't signal pleasure — it signals the gap between what you expected and what you got. Fully predicted rewards teach nothing. Surprises rewrite the brain.",
            zh: "多巴胺并不标记快感——它标记的是你所期待与你所得到之间的落差。被完全预测的奖赏什么也不教。惊喜则重写大脑。",
          }} />
        </p>
      </div>

      <div className="h-px rule-neon opacity-40" />

      {/* ── PART 1 — RPE SIMULATOR ───────────────────────────── */}
      <div className="space-y-5">
        <p className="label-mono text-ghost-400 text-[0.6rem] tracking-widest uppercase">
          <T v={{ en: "Part 1 — RPE Simulator", zh: "第一部分 — 奖赏预测误差模拟器" }} />
        </p>

        {/* Sliders */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Expected */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-ghost-300">
                <T v={{ en: "Expected reward", zh: "预期奖赏" }} />
              </label>
              <span className="mono tnum text-ember-300 text-sm">{expected}</span>
            </div>
            <input
              type="range" min={0} max={100} value={expected}
              onChange={e => setExpected(Number(e.target.value))}
              className="w-full accent-ember-400 h-1 rounded-full cursor-pointer"
              style={{ accentColor: C.ember }}
            />
          </div>
          {/* Actual */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-ghost-300">
                <T v={{ en: "Actual reward", zh: "实际奖赏" }} />
              </label>
              <span className="mono tnum text-violet-300 text-sm" style={{ color: C.violet }}>{actual}</span>
            </div>
            <input
              type="range" min={0} max={100} value={actual}
              onChange={e => setActual(Number(e.target.value))}
              className="w-full h-1 rounded-full cursor-pointer"
              style={{ accentColor: C.violet }}
            />
          </div>
        </div>

        {/* RPE readout */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="label-mono text-ghost-500 text-[0.58rem] uppercase tracking-widest">RPE</span>
            <span
              className="mono tnum text-3xl font-bold transition-colors duration-300"
              style={{ color: rpe > 4 ? C.violet : rpe < -4 ? C.flame : C.ghost40 }}
            >
              {rpe > 0 ? "+" : ""}{rpe}
            </span>
          </div>
          <p className="text-xs text-ghost-400 max-w-xs leading-relaxed">
            {INTERP[interpKey][lang]}
          </p>
        </div>

        {/* Animated SVG trace */}
        <div className="rounded-xl overflow-hidden bg-ink-900 border border-white/5">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ maxHeight: 200 }}
            aria-label="Dopamine trace"
          >
            <defs>
              <filter id="glow-trace" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-neuron" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="6" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <linearGradient id="trace-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
                <stop offset="50%" stopColor={color} stopOpacity="1"/>
                <stop offset="100%" stopColor={color} stopOpacity="0.3"/>
              </linearGradient>
            </defs>

            {/* grid lines */}
            {[40, 80, 120, 160].map(gy => (
              <line key={gy} x1={60} y1={gy} x2={W - 60} y2={gy}
                stroke="rgba(250,248,245,0.04)" strokeWidth="1"/>
            ))}

            {/* baseline */}
            <line
              x1={60} y1={BASELINE_Y} x2={W - 60} y2={BASELINE_Y}
              stroke="rgba(250,248,245,0.18)" strokeWidth="1" strokeDasharray="6,4"
            />
            <text x={64} y={BASELINE_Y - 5} fill="rgba(250,248,245,0.3)" fontSize="9" fontFamily="monospace">
              baseline
            </text>

            {/* zero-RPE guide area label */}
            <text x={W - 64} y={BASELINE_Y - 5} fill="rgba(250,248,245,0.2)"
              fontSize="9" fontFamily="monospace" textAnchor="end">
              {rpe > 4 ? "↑ surprise" : rpe < -4 ? "↓ disappoint" : "≈ predicted"}
            </text>

            {/* RPE fill area */}
            {trace.length > 2 && (
              <path
                d={`${tracePath(trace)} L${trace[trace.length - 1].x},${BASELINE_Y} L${trace[0].x},${BASELINE_Y} Z`}
                fill={color}
                fillOpacity={0.08}
              />
            )}

            {/* main trace */}
            {trace.length > 1 && (
              <path
                d={tracePath(trace)}
                fill="none"
                stroke="url(#trace-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#glow-trace)"
              />
            )}

            {/* neuron pulse at spike peak */}
            {drawFrac > 0.3 && (() => {
              const peakIdx = Math.round(0.4 * Math.min(visibleLen - 1, fullTrace.length - 1));
              const pk = fullTrace[peakIdx] ?? fullTrace[fullTrace.length - 1];
              if (!pk) return null;
              return (
                <g filter="url(#glow-neuron)">
                  <circle cx={pk.x} cy={pk.y} r={pulseR * 1.8}
                    fill={color} fillOpacity={pulseOpacity * 0.4}/>
                  <circle cx={pk.x} cy={pk.y} r={pulseR}
                    fill={color} fillOpacity={pulseOpacity}/>
                </g>
              );
            })()}

            {/* axis labels */}
            <text x={62} y={H - 14} fill="rgba(250,248,245,0.28)"
              fontSize="9" fontFamily="monospace">
              {lang === "zh" ? "时间 →" : "time →"}
            </text>
            <text x={62} y={28} fill="rgba(250,248,245,0.28)"
              fontSize="9" fontFamily="monospace" writingMode="vertical-lr"
              transform={`rotate(-90,28,${H/2}) translate(${-H/2+20},20)`}>
              {lang === "zh" ? "多巴胺" : "dopamine"}
            </text>
          </svg>
        </div>
      </div>

      <div className="h-px rule-neon opacity-30" />

      {/* ── PART 2 — HABIT LOOP ───────────────────────────── */}
      <div className="space-y-5">
        <p className="label-mono text-ghost-400 text-[0.6rem] tracking-widest uppercase">
          <T v={{ en: "Part 2 — Habit Loop", zh: "第二部分 — 习惯回路" }} />
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Ring SVG */}
          <div className="rounded-xl overflow-hidden bg-ink-900 border border-white/5 flex-shrink-0 w-full md:w-auto">
            <svg viewBox="0 0 320 310" className="w-full md:w-[320px]" aria-label="Habit loop ring">
              <defs>
                <filter id="ring-glow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="5" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="spike-glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="8" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* ring arcs */}
              {RING_NODES.map((node, i) => {
                const next = RING_NODES[(i + 1) % RING_NODES.length];
                const arcColor = [C.ember, C.flame, C.violet, C.cyan][i];
                return (
                  <path
                    key={node.key}
                    d={arcBetween(node.angle, next.angle)}
                    fill="none"
                    stroke={arcColor}
                    strokeWidth="2.5"
                    strokeOpacity="0.35"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* ring node circles */}
              {RING_NODES.map((node, i) => {
                const pos = nodePos(node.angle);
                const col = [C.ember, C.flame, C.violet, C.cyan][i];
                const isCue = node.key === "cue";
                const isReward = node.key === "reward";
                const highlight = (isCue && migrationFrac > 0.5) || (isReward && migrationFrac <= 0.5);
                return (
                  <g key={node.key} filter={highlight ? "url(#ring-glow)" : undefined}>
                    <circle cx={pos.x} cy={pos.y} r={highlight ? 22 : 18}
                      fill={C.ink800} stroke={col} strokeWidth={highlight ? 2.5 : 1.5}
                      strokeOpacity={highlight ? 1 : 0.5}
                    />
                    <text
                      x={pos.x} y={pos.y - 3}
                      textAnchor="middle" dominantBaseline="middle"
                      fill={highlight ? col : "rgba(250,248,245,0.55)"}
                      fontSize="9"
                      fontFamily="'JetBrains Mono', monospace"
                      fontWeight={highlight ? "700" : "400"}
                    >
                      {lang === "zh" ? node.label.zh : node.label.en}
                    </text>
                  </g>
                );
              })}

              {/* traveling marker */}
              {running && (
                <g>
                  <circle cx={markerPos.x} cy={markerPos.y} r={7}
                    fill={C.cyan} fillOpacity={0.9} filter="url(#ring-glow)"/>
                  <circle cx={markerPos.x} cy={markerPos.y} r={14}
                    fill="none" stroke={C.cyan} strokeWidth="1" strokeOpacity="0.35"/>
                </g>
              )}

              {/* dopamine spike indicator — migrates from reward to cue */}
              <g filter="url(#spike-glow)">
                <circle cx={spikePos.x} cy={spikePos.y} r={6 + migrationFrac * 6}
                  fill={C.violet} fillOpacity={0.2 + migrationFrac * 0.5}/>
                <circle cx={spikePos.x} cy={spikePos.y} r={3 + migrationFrac * 3}
                  fill={C.violet} fillOpacity={0.85}/>
              </g>

              {/* center label */}
              <text x={RING_CX} y={RING_CY - 12}
                textAnchor="middle" fill="rgba(250,248,245,0.45)"
                fontSize="8.5" fontFamily="monospace">
                {lang === "zh" ? "习惯" : "habit"}
              </text>
              <text x={RING_CX} y={RING_CY + 6}
                textAnchor="middle" fill="rgba(250,248,245,0.25)"
                fontSize="7.5" fontFamily="monospace">
                {lang === "zh" ? "回路" : "loop"}
              </text>

              {/* migration label */}
              <text x={RING_CX} y={RING_CY + 24}
                textAnchor="middle"
                fill={migrationFrac > 0.5 ? C.violet : C.ember}
                fontSize="7" fontFamily="monospace" fillOpacity="0.75">
                {lang === "zh"
                  ? `尖峰 ${migrationFrac < 0.3 ? "→ 奖赏" : migrationFrac < 0.8 ? "迁移中…" : "→ 线索 ✓"}`
                  : `spike ${migrationFrac < 0.3 ? "→ reward" : migrationFrac < 0.8 ? "migrating…" : "→ cue ✓"}`
                }
              </text>

              {/* trial counter */}
              <text x={RING_CX} y={290}
                textAnchor="middle" fill="rgba(250,248,245,0.35)"
                fontSize="9" fontFamily="monospace">
                {lang === "zh" ? `第 ${trial} / 10 次` : `trial ${trial} / 10`}
              </text>
            </svg>
          </div>

          {/* side panel */}
          <div className="flex-1 space-y-4">
            <p className="text-xs text-ghost-400 leading-relaxed">
              <T v={{
                en: "Each repetition of cue → routine → reward shifts the dopamine spike earlier in the sequence. After enough repetitions, the brain fires at the cue alone — the decision is bypassed.",
                zh: "每一次「线索→惯例→奖赏」的重复，都会把多巴胺尖峰推向序列更早的位置。重复足够多次之后，大脑单凭线索就放电——决定被绕过了。",
              }} />
            </p>

            {/* migration note */}
            <div
              className="rounded-lg border px-4 py-3 text-xs leading-relaxed transition-colors duration-700"
              style={{
                borderColor: migrationFrac > 0.5 ? `${C.violet}55` : `${C.ember}44`,
                background:  migrationFrac > 0.5 ? `${C.violet}0d` : `${C.ember}09`,
                color: migrationFrac > 0.5 ? C.violet : C.ember,
              }}
            >
              {spikeNote[lang]}
            </div>

            {/* buttons */}
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={runTrials}
                disabled={running || trial >= 10}
                className="rounded-full border border-violet-500/40 px-3.5 py-1.5 mono text-[0.62rem] uppercase tracking-wider text-violet-300 hover:border-violet-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                style={{ borderColor: `${C.violet}55`, color: C.violet }}
              >
                <T v={{ en: running ? "running…" : "run 10 trials", zh: running ? "运行中…" : "运行 10 次" }} />
              </button>
              <button
                onClick={resetHabit}
                className="rounded-full border border-ghost-500/30 px-3.5 py-1.5 mono text-[0.62rem] uppercase tracking-wider text-ghost-500 hover:text-ghost-300 hover:border-ghost-400 transition"
              >
                <T v={{ en: "reset", zh: "重置" }} />
              </button>
            </div>

            {/* habit node legend */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {RING_NODES.map((n, i) => {
                const col = [C.ember, C.flame, C.violet, C.cyan][i];
                return (
                  <div key={n.key} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: col }}/>
                    <span className="text-[0.65rem] text-ghost-400">
                      {lang === "zh" ? n.label.zh : n.label.en}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="h-px rule-neon opacity-30" />

      {/* ── PART 3 — BRAIN DRIVER LEGEND ────────────────── */}
      <div className="space-y-4">
        <p className="label-mono text-ghost-400 text-[0.6rem] tracking-widest uppercase">
          <T v={{ en: "Part 3 — The Four Brain Systems", zh: "第三部分 — 四种脑系统" }} />
        </p>

        <p className="text-xs text-ghost-500 leading-relaxed max-w-xl">
          <T v={{
            en: "Wanting and liking are distinct neural systems. You can crave something you no longer enjoy — wanting is a dopamine engine that fires at cues; liking is an opioid system that registers brief pleasure. They dissociate in addiction, in scrolling, in the gap between the chase and the having.",
            zh: "「想要」与「喜欢」是两个不同的神经系统。你可以渴求一样自己早已不再享受的东西——「想要」是一台在线索上放电的多巴胺引擎；「喜欢」是一个登记短暂愉悦的阿片系统。它们在成瘾、在刷屏、在追逐与拥有之间的落差中彼此分离。",
          }} />
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {BRAIN_DRIVERS.map((d) => (
            <div
              key={d.key}
              className="flex items-start gap-3 rounded-xl border p-3 transition-colors"
              style={{
                borderColor: `${d.accent}33`,
                background: `${d.accent}09`,
              }}
            >
              <span
                className="mt-0.5 h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ background: d.accent, boxShadow: `0 0 8px ${d.accent}99` }}
              />
              <div className="space-y-0.5">
                <p className="text-sm font-medium" style={{ color: d.accent }}>
                  <T v={d.name} />
                </p>
                <p className="text-[0.68rem] leading-relaxed text-ghost-400">
                  <T v={d.gloss} />
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* wanting vs liking explicit callout */}
        <div className="rounded-xl border border-white/5 bg-ink-900 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: C.ember, boxShadow: `0 0 6px ${C.ember}` }}/>
                <span className="mono text-[0.65rem] uppercase tracking-wider" style={{ color: C.ember }}>
                  <T v={{ en: "Wanting  (dopamine)", zh: "想要（多巴胺）" }} />
                </span>
              </div>
              <p className="text-[0.65rem] text-ghost-400 leading-relaxed pl-4">
                <T v={{
                  en: "Large, anticipatory. Grows as the cue repeats. Can become enormous while liking stays flat.",
                  zh: "强烈、预期性的。随线索重复而增大。可以变得极大，而「喜欢」却保持平坦。",
                }} />
              </p>
            </div>
            <div className="h-px sm:h-auto sm:w-px bg-white/8 flex-shrink-0"/>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: C.flame, boxShadow: `0 0 6px ${C.flame}` }}/>
                <span className="mono text-[0.65rem] uppercase tracking-wider" style={{ color: C.flame }}>
                  <T v={{ en: "Liking  (opioids)", zh: "喜欢（阿片）" }} />
                </span>
              </div>
              <p className="text-[0.65rem] text-ghost-400 leading-relaxed pl-4">
                <T v={{
                  en: "Small, present-tense. Registers the pleasure of the thing itself. Does not train on repetition.",
                  zh: "微小、当下的。登记事物本身的愉悦。不会因重复而训练增强。",
                }} />
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
