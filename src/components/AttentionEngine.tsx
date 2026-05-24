"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { T, useLang } from "./lang";
import { ATTENTION_TACTICS, AttentionTactic } from "./content";

/* ─── types ─────────────────────────────────────────────────── */
type TacticKey = "variable" | "infinite" | "social" | "personal" | "fomo";

interface SimState {
  dist: number[];       // interest distribution over 6 topic bins, sums ~1
  engagement: number;   // 0–100 cumulative engagement / time-on-app
  tick: number;
  playing: boolean;
  activeTactics: Set<TacticKey>;
  hovered: TacticKey | null;
}

/* ─── topic bins ─────────────────────────────────────────────── */
const BINS = [
  { en: "Tech", zh: "科技" },
  { en: "Politics", zh: "政治" },
  { en: "Culture", zh: "文化" },
  { en: "Sport", zh: "体育" },
  { en: "Finance", zh: "财经" },
  { en: "Science", zh: "科学" },
];

const BIN_COLORS = [
  "#ff9d3c",
  "#ff3d80",
  "#ff6ba3",
  "#a855f7",
  "#2dd4ee",
  "#ffb866",
];

/* ─── initial distribution — roughly uniform with slight noise ─ */
function initDist(): number[] {
  const raw = [0.18, 0.16, 0.17, 0.16, 0.17, 0.16];
  return normalise(raw);
}

function normalise(d: number[]): number[] {
  const s = d.reduce((a, b) => a + b, 0);
  return d.map((v) => v / s);
}

/* ─── entropy (0 = spike, 1 = uniform) ───────────────────────── */
function entropy(d: number[]): number {
  const n = d.length;
  const maxH = Math.log2(n);
  let h = 0;
  for (const p of d) if (p > 0) h -= p * Math.log2(p);
  return h / maxH; // 0–1
}

/* ─── tick engine ─────────────────────────────────────────────── */
function runTick(
  dist: number[],
  engagementIn: number,
  active: Set<TacticKey>
): { dist: number[]; engagement: number } {
  const n = dist.length;

  /* sharpening rate — base + tactic bonuses */
  let sharpen = 0.06;
  if (active.has("personal")) sharpen += 0.07;
  if (active.has("variable")) sharpen += 0.04;
  if (active.has("social"))   sharpen += 0.03;
  if (active.has("fomo"))     sharpen += 0.03;

  /* engagement gain per tick */
  let gain = 2.2;
  if (active.has("infinite")) gain += 1.8;
  if (active.has("variable")) gain += active.has("variable") ? Math.random() * 3 : 0; // variance
  if (active.has("social"))   gain += 1.0;
  if (active.has("fomo"))     gain += 0.8;

  /* serve: sample top-2 bins weighted by distribution */
  const sorted = [...dist.map((v, i) => ({ v, i }))].sort((a, b) => b.v - a.v);
  const topTwo = [sorted[0].i, sorted[1].i];
  const served = Math.random() < 0.75 ? topTwo[0] : topTwo[1];

  /* engagement probability on served item */
  const engageP = Math.min(0.95, dist[served] * 4 + 0.3);
  const engaged = Math.random() < engageP;

  /* update distribution toward served item if engaged */
  let newDist = [...dist];
  if (engaged) {
    newDist = newDist.map((v, i) => {
      if (i === served) return v + sharpen * (1 - v);
      return v * (1 - sharpen * 0.4);
    });
    newDist = normalise(newDist);
  }

  const newEngagement = Math.min(100, engagementIn + gain * (engaged ? 1 : 0.3));

  return { dist: newDist, engagement: newEngagement };
}

/* ─── meter bar ─────────────────────────────────────────────── */
function Meter({
  value,
  color,
  label,
  invert = false,
}: {
  value: number;
  color: string;
  label: React.ReactNode;
  invert?: boolean;
}) {
  const pct = invert ? (1 - value) * 100 : value * 100;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="label-mono text-[0.6rem] text-ghost-400">{label}</span>
        <span className="mono tnum text-[0.65rem]" style={{ color }}>
          {Math.round(invert ? (1 - value) * 100 : value * 100)}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 6px ${color}99`,
          }}
        />
      </div>
    </div>
  );
}

/* ─── component ─────────────────────────────────────────────── */
export default function AttentionEngine() {
  const { lang } = useLang();

  const [dist, setDist] = useState<number[]>(initDist);
  const [engagement, setEngagement] = useState(0);
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeTactics, setActiveTactics] = useState<Set<TacticKey>>(new Set());
  const [hovered, setHovered] = useState<TacticKey | null>(null);

  /* speed: infinite scroll halves the interval */
  const intervalMs = activeTactics.has("infinite") ? 600 : 1100;

  const stateRef = useRef({ dist, engagement });
  stateRef.current = { dist, engagement };

  /* tick loop */
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const { dist: d, engagement: e } = stateRef.current;
      const result = runTick(d, e, activeTactics);
      setDist(result.dist);
      setEngagement(result.engagement);
      setTick((t) => t + 1);
    }, intervalMs);
    return () => clearInterval(id);
  }, [playing, activeTactics, intervalMs]);

  const reset = useCallback(() => {
    setPlaying(false);
    setDist(initDist());
    setEngagement(0);
    setTick(0);
  }, []);

  const toggleTactic = useCallback((key: TacticKey) => {
    setActiveTactics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const diversity = entropy(dist);
  const topBin = dist.indexOf(Math.max(...dist));

  /* ─── SVG bar chart heights ───────────────────────────────── */
  const CHART_H = 96;
  const CHART_W = 240;
  const barW = Math.floor(CHART_W / (BINS.length * 2 - 1));
  const gap = barW;

  return (
    <div className="terminal rounded-2xl p-5 md:p-7">
      {/* ── header ────────────────────────────────────────────── */}
      <div className="mb-5 flex flex-col gap-1">
        <span className="label-mono text-[0.65rem] tracking-widest text-signal-400/80">
          {lang === "en" ? "the attention loop" : "注意力回路"}
        </span>
        <h3 className="display text-xl text-ghost-50 md:text-2xl">
          <T v={{ en: "Filter Bubble Simulator", zh: "过滤泡模拟器" }} />
        </h3>
        <p className="mt-1 max-w-xl text-xs leading-relaxed text-ghost-400">
          <T
            v={{
              en: "The engine is an optimizer pointed at engagement. It discovers that narrowing and amplifying desire maximizes the metric — shaping wanting faster than you can reflect.",
              zh: "这引擎是一个瞄准「参与度」的优化器。它发现：收窄并放大欲望，能最大化那个指标——塑造「想要」的速度，快过你来得及反思。",
            }}
          />
        </p>
      </div>

      <div className="mt-5 h-px rule-neon opacity-40" />

      {/* ── main grid: chart + meters ─────────────────────────── */}
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        {/* distribution bar chart */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="label-mono text-[0.6rem] text-ghost-500">
              <T v={{ en: "Interest distribution", zh: "兴趣分布" }} />
            </span>
            <span className="mono tnum text-[0.6rem] text-ghost-600">
              <T v={{ en: "tick", zh: "轮次" }} />
              &nbsp;
              <span className="text-ember-400">{tick}</span>
            </span>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-ink-900 p-3">
            {/* SVG bars */}
            <svg
              viewBox={`0 0 ${CHART_W} ${CHART_H + 20}`}
              className="w-full"
              aria-label="interest distribution chart"
            >
              {BINS.map((bin, i) => {
                const x = i * (barW + gap);
                const h = Math.max(2, dist[i] * CHART_H * BINS.length * 0.72);
                const y = CHART_H - h;
                const isTop = i === topBin;
                const color = BIN_COLORS[i];
                return (
                  <g key={bin.en}>
                    {/* glow behind dominant bar */}
                    {isTop && (
                      <rect
                        x={x - 1}
                        y={y - 4}
                        width={barW + 2}
                        height={h + 4}
                        rx={3}
                        fill={color}
                        opacity={0.18}
                      />
                    )}
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={h}
                      rx={2}
                      fill={color}
                      opacity={isTop ? 1 : 0.55}
                      style={{ transition: "y 0.4s, height 0.4s" }}
                    />
                    <text
                      x={x + barW / 2}
                      y={CHART_H + 13}
                      textAnchor="middle"
                      fontSize={7}
                      fill={isTop ? color : "#6b7280"}
                      className="font-mono"
                    >
                      {lang === "zh" ? bin.zh : bin.en}
                    </text>
                    {/* percentage label above bar */}
                    <text
                      x={x + barW / 2}
                      y={Math.max(y - 3, 7)}
                      textAnchor="middle"
                      fontSize={6}
                      fill={isTop ? color : "#4b5563"}
                      className="font-mono"
                      style={{ transition: "y 0.4s" }}
                    >
                      {Math.round(dist[i] * 100)}%
                    </text>
                  </g>
                );
              })}
              {/* baseline */}
              <line x1={0} y1={CHART_H} x2={CHART_W} y2={CHART_H} stroke="#374151" strokeWidth={0.5} />
            </svg>
            {/* dominant topic label */}
            <div className="mt-1 text-center">
              <span className="mono text-[0.6rem] text-ghost-600">
                <T v={{ en: "dominant", zh: "主导话题" }} />
                :&nbsp;
              </span>
              <span className="mono text-[0.65rem]" style={{ color: BIN_COLORS[topBin] }}>
                {lang === "zh" ? BINS[topBin].zh : BINS[topBin].en}
              </span>
            </div>
          </div>
        </div>

        {/* meters + controls */}
        <div className="flex flex-col gap-4">
          {/* meters */}
          <div className="space-y-3 rounded-xl bg-ink-900 p-4">
            <Meter
              value={engagement / 100}
              color="#ff9d3c"
              label={<T v={{ en: "Engagement / time-on-app", zh: "参与度 / 使用时长" }} />}
            />
            <Meter
              value={diversity}
              color="#2dd4ee"
              label={<T v={{ en: "Interest diversity (entropy)", zh: "兴趣多样性（熵）" }} />}
            />
            <Meter
              value={1 - diversity}
              color="#a855f7"
              label={<T v={{ en: "Filter bubble depth", zh: "过滤泡深度" }} />}
            />
          </div>

          {/* playback controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPlaying((p) => !p)}
              className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs transition ${
                playing
                  ? "border-flame-500/60 bg-flame-500/10 text-flame-300 hover:bg-flame-500/20"
                  : "border-ember-500/50 bg-ember-500/10 text-ember-300 hover:bg-ember-500/20"
              }`}
            >
              <span className="mono text-[0.65rem]">{playing ? "▐▐" : "▶"}</span>
              <T v={{ en: playing ? "Pause" : "Play", zh: playing ? "暂停" : "播放" }} />
            </button>
            <button
              onClick={reset}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-ghost-600/30 bg-transparent px-3 text-xs text-ghost-400 transition hover:border-ghost-400/50 hover:text-ghost-200"
            >
              <span className="mono text-[0.6rem]">↺</span>
              <T v={{ en: "Reset", zh: "重置" }} />
            </button>
            {/* tick speed indicator */}
            <span className="ml-auto mono tnum text-[0.58rem] text-ghost-600">
              {activeTactics.has("infinite") ? (
                <span className="text-flame-400">
                  <T v={{ en: "2× speed", zh: "2× 速" }} />
                </span>
              ) : (
                <span>
                  <T v={{ en: "1× speed", zh: "1× 速" }} />
                </span>
              )}
            </span>
          </div>

          {/* bubble status annotation */}
          <div className="rounded-lg border border-ink-600 bg-ink-900/60 px-3 py-2">
            <p className="text-[0.65rem] leading-relaxed text-ghost-500">
              {diversity < 0.3 ? (
                <span className="text-flame-400">
                  <T
                    v={{
                      en: "Deep bubble — one topic dominates. The algorithm has learned you.",
                      zh: "深度泡囊——一个话题主导一切。算法已读懂你。",
                    }}
                  />
                </span>
              ) : diversity < 0.7 ? (
                <span className="text-ember-300">
                  <T
                    v={{
                      en: "Bubble forming — distribution narrowing toward a spike.",
                      zh: "泡囊正在形成——分布正收窄为一个尖峰。",
                    }}
                  />
                </span>
              ) : (
                <span className="text-signal-400">
                  <T
                    v={{
                      en: "Broad diet — distribution still roughly uniform. Keep going…",
                      zh: "兴趣广泛——分布仍大致均匀。继续运行……",
                    }}
                  />
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 h-px rule-neon opacity-30" />

      {/* ── tactic toggles ─────────────────────────────────────── */}
      <div className="mt-5">
        <p className="mb-3 label-mono text-[0.6rem] text-ghost-500">
          <T v={{ en: "Enable tactics — each sharpens the feedback loop", zh: "启用战术——每一项都会加速反馈回路的收窄" }} />
        </p>
        <div className="flex flex-wrap gap-2">
          {(ATTENTION_TACTICS as AttentionTactic[]).map((tac) => {
            const key = tac.key as TacticKey;
            const isActive = activeTactics.has(key);
            const isHovered = hovered === key;
            return (
              <div key={key} className="relative">
                <button
                  onClick={() => toggleTactic(key)}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(key)}
                  onBlur={() => setHovered(null)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all duration-200 ${
                    isActive
                      ? "border-transparent text-ink-900 shadow-lg"
                      : "border-ink-600 text-ghost-400 hover:border-ghost-500/60 hover:text-ghost-200"
                  }`}
                  style={
                    isActive
                      ? {
                          background: tac.accent,
                          boxShadow: `0 0 12px ${tac.accent}66`,
                        }
                      : {}
                  }
                  aria-pressed={isActive}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: isActive ? "#000000aa" : tac.accent,
                      boxShadow: isActive ? "none" : `0 0 4px ${tac.accent}`,
                    }}
                  />
                  <span className={`mono ${isActive ? "text-ink-900" : ""}`}>
                    <T v={tac.name} />
                  </span>
                </button>
                {/* gloss tooltip */}
                {isHovered && (
                  <div
                    className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 w-52 rounded-lg border border-ink-500 bg-ink-800/95 p-2.5 text-[0.65rem] leading-relaxed text-ghost-300 shadow-xl"
                    style={{ borderColor: `${tac.accent}44` }}
                  >
                    <span style={{ color: tac.accent }}>
                      <T v={tac.name} />
                    </span>
                    <span className="mx-1 text-ghost-600">—</span>
                    <T v={tac.gloss} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* active tactic effects summary */}
        {activeTactics.size > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {activeTactics.has("variable") && (
              <span className="mono text-[0.6rem] text-ember-400/80">
                <T v={{ en: "↑ engagement variance", zh: "↑ 参与度波动" }} />
              </span>
            )}
            {activeTactics.has("infinite") && (
              <span className="mono text-[0.6rem] text-flame-400/80">
                <T v={{ en: "↑↑ tick speed · no stop cue", zh: "↑↑ 轮次加速 · 无停止线索" }} />
              </span>
            )}
            {activeTactics.has("social") && (
              <span className="mono text-[0.6rem] text-ghost-300/70">
                <T v={{ en: "↑ retention gain", zh: "↑ 留存增益" }} />
              </span>
            )}
            {activeTactics.has("personal") && (
              <span className="mono text-[0.6rem]" style={{ color: "#a855f7cc" }}>
                <T v={{ en: "↑↑ sharpening rate", zh: "↑↑ 分布收窄速率" }} />
              </span>
            )}
            {activeTactics.has("fomo") && (
              <span className="mono text-[0.6rem] text-signal-400/80">
                <T v={{ en: "× loss-aversion multiplier", zh: "× 损失厌恶乘数" }} />
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 h-px rule-neon opacity-20" />

      {/* ── caption ───────────────────────────────────────────── */}
      <p className="mt-4 max-w-2xl text-[0.7rem] leading-relaxed text-ghost-500">
        <T
          v={{
            en: "The algorithm is not malicious — it is an optimizer pointed at engagement. It discovers, reliably, that narrowing and amplifying desire maximizes the metric. Personalization means it learns your specific cravings faster than you learn them yourself. Each tactic above was designed, A/B-tested, and shipped. Together they compose a system that shapes wanting at the source.",
            zh: "算法并不邪恶——它是一个瞄准「参与度」的优化器。它可靠地发现：收窄并放大欲望，能最大化那个指标。个性化意味着，它对你具体渴求的了解速度，快过你了解自己。以上每一项战术，都经过设计、A/B测试，并被部署上线。它们共同构成一个从源头塑造「想要」的系统。",
          }}
        />
      </p>
    </div>
  );
}
