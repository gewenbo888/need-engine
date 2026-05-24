"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { T, useLang } from "./lang";
import { TRANSCENDENT_NEEDS } from "./content";

/* ─── constants ─────────────────────────────────────────── */
const TWO_PI = Math.PI * 2;
const N = TRANSCENDENT_NEEDS.length; // 6

/* centre of the ring, expressed as fraction of SVG viewBox */
const CX = 200;
const CY = 200;
const RING_R = 115; // orbit radius
const ORB_R = 28;   // base orb radius

/* node positions (static angles, rotation animated separately) */
function orbPos(i: number, rotDeg: number) {
  const angle = (TWO_PI * i) / N - Math.PI / 2 + (rotDeg * Math.PI) / 180;
  return {
    x: CX + RING_R * Math.cos(angle),
    y: CY + RING_R * Math.sin(angle),
  };
}

/* ─── Pleasure vs Meaning curve data ────────────────────── */
// X: 0..1 (time), Y: 0..1 (level, 1 = top)
function pleasureY(t: number): number {
  // sharp spike then exponential decay to a low baseline ~0.15
  if (t < 0.12) return 0.15 + (0.85 * t) / 0.12;          // rise
  return 0.15 + 0.85 * Math.exp(-8 * (t - 0.12));          // decay
}

function meaningY(t: number): number {
  // slow sigmoid rise that sustains
  const s = 1 / (1 + Math.exp(-10 * (t - 0.45)));
  return 0.12 + 0.72 * s;
}

/* map data coords → SVG coords inside a chart box */
function toSvg(tx: number, ty: number, W: number, H: number, pad: number) {
  return {
    x: pad + tx * (W - 2 * pad),
    y: H - pad - ty * (H - 2 * pad),
  };
}

const CURVE_PTS = 80; // sample count

/* ─── component ─────────────────────────────────────────── */
export default function MeaningField() {
  const { lang } = useLang();

  /* ring state */
  const [rotDeg, setRotDeg]     = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered]   = useState<number | null>(null);
  const ringRafRef              = useRef<number | null>(null);
  const lastTsRef               = useRef<number>(0);

  /* curve animation */
  const [progress, setProgress] = useState(0); // 0..1
  const curveRafRef             = useRef<number | null>(null);
  const curveStartRef           = useRef<number | null>(null);
  const CURVE_DURATION          = 2200; // ms

  /* ── ring animation: slow rotation ── */
  useEffect(() => {
    function frame(ts: number) {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;
      setRotDeg(r => (r + dt * 0.012) % 360);
      ringRafRef.current = requestAnimationFrame(frame);
    }
    ringRafRef.current = requestAnimationFrame(frame);
    return () => {
      if (ringRafRef.current !== null) cancelAnimationFrame(ringRafRef.current);
    };
  }, []);

  /* ── curve draw-in animation ── */
  useEffect(() => {
    function frame(ts: number) {
      if (curveStartRef.current === null) curveStartRef.current = ts;
      const elapsed = ts - curveStartRef.current;
      const p = Math.min(elapsed / CURVE_DURATION, 1);
      setProgress(p);
      if (p < 1) curveRafRef.current = requestAnimationFrame(frame);
    }
    curveRafRef.current = requestAnimationFrame(frame);
    return () => {
      if (curveRafRef.current !== null) cancelAnimationFrame(curveRafRef.current);
    };
  }, []);

  /* ── build polyline points for curves ── */
  const buildPath = useCallback(
    (fn: (t: number) => number, W: number, H: number, pad: number, prog: number) => {
      const pts: string[] = [];
      const steps = Math.max(2, Math.round(CURVE_PTS * prog));
      for (let i = 0; i < steps; i++) {
        const t = (i / (CURVE_PTS - 1)) * prog;
        const { x, y } = toSvg(t, fn(t), W, H, pad);
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      return pts.join(" ");
    },
    []
  );

  /* ── derived ── */
  const activeIdx = hovered ?? selected;
  const activeNeed = activeIdx !== null ? TRANSCENDENT_NEEDS[activeIdx] : null;

  /* ── orb breath scale (per-node oscillation) ── */
  function breathScale(i: number, ts: number) {
    return 1 + 0.08 * Math.sin((ts / 1400 + (i * TWO_PI) / N));
  }

  /* We'll use Date.now() for breath since we need a live ref inside SVG render */
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60);
    return () => clearInterval(id);
  }, []);
  const now = Date.now();

  /* ── SVG dimensions ── */
  const VB = 400; // viewBox side
  // chart
  const CW = 420, CH = 180, CP = 24;

  return (
    <div className="holo rounded-2xl p-5 md:p-7 space-y-8">

      {/* ── TITLE ROW ── */}
      <div className="space-y-1">
        <p className="label-mono text-mind-400 tracking-widest text-[0.65rem] uppercase">
          <T v={{ en: "the meaning field", zh: "意义之场" }} />
        </p>
        <h3 className="display text-2xl text-ghost-50 md:text-3xl leading-tight">
          <T v={{ en: "Meaning & Transcendent Needs", zh: "意义与超越性需求" }} />
        </h3>
        <p className="text-xs leading-relaxed text-ghost-400 max-w-2xl">
          <T v={{
            en: "Six needs that do not habituate — they deepen. Unlike appetites, they are outward-facing, non-zero-sum, and sustain motivation across a life.",
            zh: "六种不会习惯化的需求——它们只会加深。与食欲不同，它们朝向外部、非零和，并在整段生命中持续滋养动机。",
          }} />
        </p>
      </div>

      <div className="h-px rule-neon opacity-40" />

      {/* ── PART 1: MEANING FIELD SVG ── */}
      <div className="grid md:grid-cols-[1fr_280px] gap-6 items-center">

        {/* constellation */}
        <div className="relative">
          <svg
            viewBox={`0 0 ${VB} ${VB}`}
            className="w-full max-w-[380px] mx-auto"
            aria-label={lang === "zh" ? "超越性需求星座图" : "Transcendent needs constellation"}
          >
            <defs>
              {TRANSCENDENT_NEEDS.map((n, i) => (
                <radialGradient key={n.key} id={`orb-grad-${i}`} cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor={n.accent} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={n.accent} stopOpacity="0.15" />
                </radialGradient>
              ))}
              {/* centre glow */}
              <radialGradient id="centre-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.5" />
                <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </radialGradient>
              <filter id="orb-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="centre-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="9" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="edge-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* orbit ring track */}
            <circle
              cx={CX} cy={CY} r={RING_R}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="0.5"
              strokeOpacity="0.2"
              strokeDasharray="4 6"
            />

            {/* edges: centre → each orb */}
            {TRANSCENDENT_NEEDS.map((n, i) => {
              const pos = orbPos(i, rotDeg);
              const isActive = activeIdx === i;
              return (
                <line
                  key={`edge-${n.key}`}
                  x1={CX} y1={CY}
                  x2={pos.x} y2={pos.y}
                  stroke={n.accent}
                  strokeWidth={isActive ? 1.4 : 0.6}
                  strokeOpacity={isActive ? 0.75 : 0.18}
                  filter={isActive ? "url(#edge-glow)" : undefined}
                  style={{ transition: "stroke-opacity 0.3s, stroke-width 0.3s" }}
                />
              );
            })}

            {/* centre — self node */}
            <circle
              cx={CX} cy={CY} r={32}
              fill="url(#centre-grad)"
              filter="url(#centre-glow)"
            />
            <circle
              cx={CX} cy={CY} r={18}
              fill="none"
              stroke="#c084fc"
              strokeWidth="1.2"
              strokeOpacity="0.6"
            />
            <text
              x={CX} y={CY + 1}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="9"
              fill="#e9d5ff"
              fontFamily="var(--font-mono, monospace)"
              opacity="0.9"
            >
              {lang === "zh" ? "自我" : "self"}
            </text>

            {/* orbs */}
            {TRANSCENDENT_NEEDS.map((n, i) => {
              const pos = orbPos(i, rotDeg);
              const isActive = activeIdx === i;
              const scale = isActive ? 1.28 : breathScale(i, now);
              const r = ORB_R * scale;
              return (
                <g
                  key={n.key}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelected(s => s === i ? null : i)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  aria-label={n.name[lang]}
                >
                  {/* outer glow ring */}
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={r + (isActive ? 8 : 4)}
                    fill="none"
                    stroke={n.accent}
                    strokeWidth="1"
                    strokeOpacity={isActive ? 0.55 : 0.2}
                    style={{ transition: "r 0.3s, stroke-opacity 0.3s" }}
                  />
                  {/* body */}
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={r}
                    fill={`url(#orb-grad-${i})`}
                    filter="url(#orb-glow)"
                    stroke={n.accent}
                    strokeWidth={isActive ? 1.5 : 0.8}
                    strokeOpacity={isActive ? 0.9 : 0.5}
                    style={{ transition: "stroke-width 0.3s, stroke-opacity 0.3s" }}
                  />
                  {/* label */}
                  <text
                    x={pos.x} y={pos.y + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={isActive ? "8.5" : "7.5"}
                    fill={n.accent}
                    fontFamily="var(--font-mono, monospace)"
                    opacity={isActive ? 1 : 0.85}
                    style={{ transition: "font-size 0.3s, opacity 0.3s", pointerEvents: "none" }}
                  >
                    {n.name[lang]}
                  </text>
                </g>
              );
            })}

            {/* tick indicator */}
            <title>{lang === "zh" ? "点击节点查看详情" : "Click a node for details"}</title>
          </svg>
        </div>

        {/* detail panel */}
        <div className="space-y-3">
          {activeNeed ? (
            <div
              key={activeNeed.key}
              className="rounded-xl border p-4 space-y-2 lang-fade"
              style={{
                borderColor: `${activeNeed.accent}44`,
                background: `${activeNeed.accent}0d`,
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0 pulse"
                  style={{ background: activeNeed.accent, boxShadow: `0 0 8px ${activeNeed.accent}` }}
                />
                <span
                  className="display text-xl font-semibold"
                  style={{ color: activeNeed.accent }}
                >
                  <T v={activeNeed.name} />
                </span>
              </div>
              <p className="text-sm leading-relaxed text-ghost-200 serif">
                <T v={activeNeed.gloss} />
              </p>
              <div className="h-px opacity-20" style={{ background: activeNeed.accent }} />
              <p className="text-[0.7rem] text-ghost-500 mono">
                {lang === "zh"
                  ? "非零和 · 不习惯化 · 朝向外部"
                  : "non-zero-sum · non-habituating · outward-facing"}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-mind-500/20 bg-mind-500/5 p-4 space-y-3">
              <p className="label-mono text-mind-400 text-[0.65rem] uppercase tracking-wider">
                <T v={{ en: "select a node", zh: "点击一个节点" }} />
              </p>
              {/* mini legend */}
              <div className="space-y-2">
                {TRANSCENDENT_NEEDS.map((n) => (
                  <div key={n.key} className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ background: n.accent, boxShadow: `0 0 5px ${n.accent}88` }}
                    />
                    <span className="text-[0.72rem] text-ghost-300 mono">
                      <T v={n.name} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* property badges */}
          <div className="space-y-1.5">
            {[
              { en: "Non-zero-sum", zh: "非零和", desc: { en: "your meaning doesn't diminish mine", zh: "你的意义不会消减我的" }, color: "#a855f7" },
              { en: "Non-habituating", zh: "不习惯化", desc: { en: "depth compounds with time", zh: "深度随时间复利积累" }, color: "#2dd4ee" },
              { en: "Outward-facing", zh: "朝向外部", desc: { en: "oriented beyond the self's own states", zh: "朝向自我状态之外" }, color: "#ff9d3c" },
            ].map(badge => (
              <div key={badge.en} className="rounded-lg border border-ghost-700/30 bg-ink-900/60 px-3 py-2 flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: badge.color }} />
                <div>
                  <span className="mono text-[0.65rem] tracking-wide" style={{ color: badge.color }}>
                    {lang === "zh" ? badge.zh : badge.en}
                  </span>
                  <p className="text-[0.65rem] text-ghost-500 mt-0.5">
                    <T v={badge.desc} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px rule-neon opacity-30" />

      {/* ── PART 2: PLEASURE vs MEANING CURVES ── */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <p className="label-mono text-signal-400 text-[0.65rem] uppercase tracking-widest">
            <T v={{ en: "pleasure vs meaning", zh: "快感 vs 意义" }} />
          </p>
          <h4 className="display text-lg text-ghost-100">
            <T v={{ en: "Why meaning systems are the great stabilizers", zh: "为何意义系统是伟大的稳定器" }} />
          </h4>
        </div>

        {/* curve SVG */}
        <div className="rounded-xl border border-ghost-700/25 bg-ink-900/70 overflow-hidden">
          <svg
            viewBox={`0 0 ${CW} ${CH}`}
            className="w-full"
            aria-label={lang === "zh" ? "快感与意义随时间的曲线对比" : "Pleasure vs meaning over time"}
          >
            <defs>
              <filter id="curve-glow" x="-10%" y="-50%" width="120%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="pleasure-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff3d80" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#ff3d80" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="meaning-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* grid lines */}
            {[0.25, 0.5, 0.75, 1].map(v => {
              const y = CH - CP - v * (CH - 2 * CP);
              return (
                <line
                  key={v}
                  x1={CP} y1={y} x2={CW - CP} y2={y}
                  stroke="#ffffff" strokeOpacity="0.05" strokeWidth="0.8"
                />
              );
            })}

            {/* axes */}
            <line x1={CP} y1={CP / 2} x2={CP} y2={CH - CP} stroke="#ffffff" strokeOpacity="0.2" strokeWidth="0.8" />
            <line x1={CP} y1={CH - CP} x2={CW - CP} y2={CH - CP} stroke="#ffffff" strokeOpacity="0.2" strokeWidth="0.8" />

            {/* axis labels */}
            <text x={CW / 2} y={CH - 4} textAnchor="middle" fontSize="7.5" fill="#6b7280" fontFamily="var(--font-mono, monospace)">
              {lang === "zh" ? "时间" : "time →"}
            </text>
            <text x={8} y={CY} textAnchor="middle" fontSize="7.5" fill="#6b7280" fontFamily="var(--font-mono, monospace)" transform={`rotate(-90,8,${CY})`}>
              {lang === "zh" ? "水平" : "level"}
            </text>

            {/* pleasure fill area */}
            {progress > 0.01 && (() => {
              const pts: string[] = [];
              const steps = Math.max(2, Math.round(CURVE_PTS * progress));
              const pad = CP;
              // bottom-left start
              pts.push(`${pad},${CH - pad}`);
              for (let i = 0; i < steps; i++) {
                const t = (i / (CURVE_PTS - 1)) * progress;
                const { x, y } = toSvg(t, pleasureY(t), CW, CH, pad);
                pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
              }
              // last x, bottom
              const lastT = progress;
              const lastX = pad + lastT * (CW - 2 * pad);
              pts.push(`${lastX.toFixed(1)},${CH - pad}`);
              return <polygon points={pts.join(" ")} fill="url(#pleasure-fill)" />;
            })()}

            {/* meaning fill area */}
            {progress > 0.01 && (() => {
              const pts: string[] = [];
              const steps = Math.max(2, Math.round(CURVE_PTS * progress));
              const pad = CP;
              pts.push(`${pad},${CH - pad}`);
              for (let i = 0; i < steps; i++) {
                const t = (i / (CURVE_PTS - 1)) * progress;
                const { x, y } = toSvg(t, meaningY(t), CW, CH, pad);
                pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
              }
              const lastX = pad + progress * (CW - 2 * pad);
              pts.push(`${lastX.toFixed(1)},${CH - pad}`);
              return <polygon points={pts.join(" ")} fill="url(#meaning-fill)" />;
            })()}

            {/* pleasure curve */}
            <polyline
              points={buildPath(pleasureY, CW, CH, CP, progress)}
              fill="none"
              stroke="#ff3d80"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#curve-glow)"
            />

            {/* meaning curve */}
            <polyline
              points={buildPath(meaningY, CW, CH, CP, progress)}
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#curve-glow)"
            />

            {/* baseline dashed */}
            <line
              x1={CP} y1={CH - CP - 0.15 * (CH - 2 * CP)}
              x2={CW - CP} y2={CH - CP - 0.15 * (CH - 2 * CP)}
              stroke="#ffffff" strokeOpacity="0.1"
              strokeDasharray="3 5" strokeWidth="0.8"
            />
            <text
              x={CW - CP + 2} y={CH - CP - 0.15 * (CH - 2 * CP) + 3}
              fontSize="6.5" fill="#6b7280"
              fontFamily="var(--font-mono, monospace)"
            >
              {lang === "zh" ? "基线" : "baseline"}
            </text>

            {/* legend */}
            <g>
              <circle cx={CP + 8} cy={CP + 6} r="4" fill="#ff3d80" fillOpacity="0.85" filter="url(#curve-glow)" />
              <text x={CP + 16} y={CP + 10} fontSize="8" fill="#ff3d80" fontFamily="var(--font-mono, monospace)">
                {lang === "zh" ? "快感" : "Pleasure"}
              </text>
              <circle cx={CP + 72} cy={CP + 6} r="4" fill="#a855f7" fillOpacity="0.85" filter="url(#curve-glow)" />
              <text x={CP + 80} y={CP + 10} fontSize="8" fill="#a855f7" fontFamily="var(--font-mono, monospace)">
                {lang === "zh" ? "意义" : "Meaning"}
              </text>
            </g>

            {/* annotation arrows / callouts */}
            {progress > 0.6 && (
              <>
                {/* pleasure peak callout */}
                <line x1={CP + 40} y1={CP + 20} x2={CP + 50} y2={CH - CP - 0.85 * (CH - 2 * CP)}
                  stroke="#ff3d80" strokeOpacity="0.45" strokeWidth="0.8" strokeDasharray="2 3" />
                <text x={CP + 42} y={CP + 18} fontSize="6.5" fill="#ff9d3c" fontFamily="var(--font-mono, monospace)">
                  {lang === "zh" ? "习惯化 →" : "habituates →"}
                </text>
                {/* meaning sustain callout */}
                <line x1={CW - CP - 48} y1={CP + 22} x2={CW - CP - 30} y2={CH - CP - 0.75 * (CH - 2 * CP)}
                  stroke="#a855f7" strokeOpacity="0.45" strokeWidth="0.8" strokeDasharray="2 3" />
                <text x={CW - CP - 100} y={CP + 20} fontSize="6.5" fill="#c084fc" fontFamily="var(--font-mono, monospace)">
                  {lang === "zh" ? "加深 · 持续" : "deepens · sustains"}
                </text>
              </>
            )}
          </svg>
        </div>

        {/* readout */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-flame-500/20 bg-ink-900/60 px-4 py-3 space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ff3d80]" style={{ boxShadow: "0 0 6px #ff3d80" }} />
              <span className="mono text-[0.7rem] text-[#ff3d80] tracking-wide uppercase">
                <T v={{ en: "Pleasure / Appetite", zh: "快感 / 食欲" }} />
              </span>
            </div>
            <p className="text-[0.72rem] leading-relaxed text-ghost-300">
              <T v={{
                en: "Spikes on acquisition, then adapts back to baseline. Each gained object raises the threshold — the treadmill that keeps turning.",
                zh: "在获取时骤然飙升，随后适应回基线。每一次所得都抬高了阈值——那台永不停止的跑步机。",
              }} />
            </p>
          </div>
          <div className="rounded-lg border border-mind-500/20 bg-ink-900/60 px-4 py-3 space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#a855f7]" style={{ boxShadow: "0 0 6px #a855f7" }} />
              <span className="mono text-[0.7rem] text-[#a855f7] tracking-wide uppercase">
                <T v={{ en: "Meaning / Transcendence", zh: "意义 / 超越" }} />
              </span>
            </div>
            <p className="text-[0.72rem] leading-relaxed text-ghost-300">
              <T v={{
                en: "Rises slowly, sustains and compounds. Creating, loving, contributing, seeking truth — these are outward-facing and non-zero-sum. Your meaning does not consume mine.",
                zh: "缓慢上升，持续并复利增长。创造、爱、贡献、寻求真理——这些朝向外部，非零和。你的意义不会消减我的。",
              }} />
            </p>
          </div>
        </div>

        {/* closing insight */}
        <blockquote className="border-l-2 border-mind-500/50 pl-4 space-y-1">
          <p className="serif text-sm leading-relaxed text-ghost-200 italic">
            <T v={{
              en: "Appetites habituate and reset the baseline. Meaning-oriented needs — create, love, contribute — are non-zero-sum, outward-facing, and sustain motivation. This is why meaning systems are the great stabilizers of human life.",
              zh: "食欲习惯化，并不断重设基线。以意义为取向的需求——创造、爱、贡献——是非零和、朝向外部的，并持续滋养动机。这正是为何意义系统是人类生命的伟大稳定器。",
            }} />
          </p>
          <p className="mono text-[0.65rem] text-ghost-500">
            — <T v={{ en: "§07 Need Engine", zh: "§07 需求引擎" }} />
          </p>
        </blockquote>
      </div>
    </div>
  );
}
