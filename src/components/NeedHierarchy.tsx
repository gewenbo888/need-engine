"use client";

import { useState } from "react";
import { T, useLang } from "./lang";
import { NEED_LAYERS, STATUS_FRAMES } from "./content";

/* ─── types ─────────────────────────────────────────────── */
type FrameIdx = 0 | 1 | 2 | 3;

/* ─── pyramid geometry constants ────────────────────────── */
const SVG_W = 480;
const SVG_H = 340;
const BASE_Y = SVG_H - 16;
const TIER_H = 44;
const GAP = 3;
const BASE_HALF_W = 220;

function trapezoidPoints(i: number, halfW: number): string {
  // tier 0 = bottom (widest), tier 5 = top (narrowest)
  // i is index from bottom (0) to top (5)
  const y1 = BASE_Y - i * (TIER_H + GAP);
  const y0 = y1 - TIER_H;
  const cx = SVG_W / 2;
  // next tier above is narrower
  const topHalfW = halfW * (NEED_LAYERS[5 - (i + 1 <= 5 ? i + 1 : 5)]?.height ?? 0.18);
  const botHalfW = halfW;
  const topW = (topHalfW / NEED_LAYERS[0].height) * BASE_HALF_W;
  const botW = (botHalfW / NEED_LAYERS[0].height) * BASE_HALF_W;
  return `${cx - botW},${y1} ${cx + botW},${y1} ${cx + topW},${y0} ${cx - topW},${y0}`;
}

/* Compute the 4 corner points for tier i (0=bottom, 5=top) */
function tierPoints(i: number): string {
  const cx = SVG_W / 2;
  const y1 = BASE_Y - i * (TIER_H + GAP);
  const y0 = y1 - TIER_H;
  const botW = (NEED_LAYERS[i].height / NEED_LAYERS[0].height) * BASE_HALF_W;
  // top width = next layer's width (or 0.15 * BASE_HALF_W for topmost)
  const topLayerHeight = i < 5 ? NEED_LAYERS[i + 1].height : 0.15;
  const topW = (topLayerHeight / NEED_LAYERS[0].height) * BASE_HALF_W;
  return `${cx - botW},${y1} ${cx + botW},${y1} ${cx + topW},${y0} ${cx - topW},${y0}`;
}

function tierMidY(i: number): number {
  const y1 = BASE_Y - i * (TIER_H + GAP);
  return y1 - TIER_H / 2;
}

/* ─── component ─────────────────────────────────────────── */
export default function NeedHierarchy() {
  const { lang } = useLang();
  const [frameIdx, setFrameIdx] = useState<FrameIdx>(0);
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);
  // key that changes on frame switch to trigger CSS re-mount for label fade
  const [animKey, setAnimKey] = useState(0);

  const activeFrame = STATUS_FRAMES[frameIdx];

  function switchFrame(idx: FrameIdx) {
    if (idx === frameIdx) return;
    setFrameIdx(idx);
    setAnimKey((k) => k + 1);
  }

  /* frame tint colors */
  const FRAME_TINTS = ["#ff9d3c", "#ff6ba3", "#a855f7", "#2dd4ee"] as const;

  return (
    <div className="holo rounded-2xl p-5 md:p-7">
      {/* ── title row ── */}
      <div className="mb-5">
        <p className="label-mono mb-1 text-ghost-500">
          {lang === "zh" ? "被重新命名的层级" : "the hierarchy, re-skinned"}
        </p>
        <h3 className="display text-xl text-ghost-50 md:text-2xl">
          <T v={{ en: "One Ladder, Four Vocabularies", zh: "同一阶梯，四种命名" }} />
        </h3>
      </div>

      {/* ── frame toggle pills ── */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FRAMES.map((frame, idx) => {
          const tint = FRAME_TINTS[idx];
          const active = frameIdx === idx;
          return (
            <button
              key={frame.key}
              onClick={() => switchFrame(idx as FrameIdx)}
              style={
                active
                  ? { background: `${tint}22`, borderColor: `${tint}88`, color: tint, boxShadow: `0 0 10px ${tint}44` }
                  : { borderColor: `${tint}33`, color: "#a0a0b8" }
              }
              className="rounded-full border px-3 py-1 text-xs font-mono transition-all duration-300 hover:opacity-90"
            >
              <T v={frame.name} />
            </button>
          );
        })}
      </div>

      {/* ── main layout: pyramid + side panel ── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">

        {/* ── SVG pyramid ── */}
        <div className="relative mx-auto w-full max-w-[480px] flex-shrink-0 lg:mx-0">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full"
            aria-label={lang === "zh" ? "需求层级金字塔" : "Need hierarchy pyramid"}
          >
            <defs>
              {NEED_LAYERS.map((layer) => (
                <filter key={`glow-${layer.key}`} id={`glow-${layer.key}`} x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
              {/* hover glow */}
              <filter id="glow-hover" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {NEED_LAYERS.map((layer, rawIdx) => {
              // rawIdx 0 = physio (bottom in data) → render at tier 0 (bottom of pyramid)
              const tier = rawIdx; // 0 = bottom, 5 = top
              const isHovered = hoveredTier === tier;
              const accent = layer.accent;
              const label = activeFrame.layers[tier];

              return (
                <g
                  key={`${layer.key}-${animKey}`}
                  onMouseEnter={() => setHoveredTier(tier)}
                  onMouseLeave={() => setHoveredTier(null)}
                  onTouchStart={() => setHoveredTier(tier)}
                  onTouchEnd={() => setHoveredTier(null)}
                  style={{ cursor: "pointer" }}
                >
                  {/* tier trapezoid */}
                  <polygon
                    points={tierPoints(tier)}
                    fill={isHovered ? `${accent}55` : `${accent}28`}
                    stroke={accent}
                    strokeWidth={isHovered ? 2 : 1}
                    filter={isHovered ? "url(#glow-hover)" : `url(#glow-${layer.key})`}
                    style={{ transition: "fill 0.25s, stroke-width 0.2s" }}
                  />

                  {/* tier label */}
                  <text
                    x={SVG_W / 2}
                    y={tierMidY(tier) + 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isHovered ? accent : `${accent}cc`}
                    fontSize={isHovered ? 13 : lang === "zh" ? 12 : 11}
                    fontFamily={lang === "zh" ? "'Noto Serif SC', serif" : "'Space Grotesk', 'Sora', sans-serif"}
                    fontWeight={isHovered ? "700" : "500"}
                    style={{ transition: "font-size 0.2s, fill 0.2s", letterSpacing: lang === "zh" ? "0.05em" : "0.02em" }}
                  >
                    {label[lang]}
                  </text>

                  {/* hover highlight: left bracket accent line */}
                  {isHovered && (
                    <line
                      x1={SVG_W / 2 - (NEED_LAYERS[tier].height / NEED_LAYERS[0].height) * BASE_HALF_W - 8}
                      y1={BASE_Y - tier * (TIER_H + GAP) - TIER_H / 2}
                      x2={SVG_W / 2 - (NEED_LAYERS[tier].height / NEED_LAYERS[0].height) * BASE_HALF_W - 8}
                      y2={BASE_Y - tier * (TIER_H + GAP) - TIER_H / 2}
                      stroke={accent}
                      strokeWidth={3}
                    />
                  )}
                </g>
              );
            })}

            {/* top apex cap dot */}
            <circle
              cx={SVG_W / 2}
              cy={BASE_Y - 5 * (TIER_H + GAP) - TIER_H - 6}
              r={4}
              fill={NEED_LAYERS[5].accent}
              opacity={0.9}
              style={{ filter: `drop-shadow(0 0 5px ${NEED_LAYERS[5].accent})` }}
            />
          </svg>

          {/* hover tooltip – absolute below pyramid on mobile */}
          <div
            className="pointer-events-none absolute inset-x-0 -bottom-8 flex justify-center transition-opacity duration-200"
            style={{ opacity: hoveredTier !== null ? 1 : 0 }}
          >
            {hoveredTier !== null && (
              <span
                className="mono rounded-full px-3 py-1 text-xs"
                style={{
                  background: `${NEED_LAYERS[hoveredTier].accent}18`,
                  border: `1px solid ${NEED_LAYERS[hoveredTier].accent}55`,
                  color: NEED_LAYERS[hoveredTier].accent,
                }}
              >
                {activeFrame.layers[hoveredTier][lang]}
              </span>
            )}
          </div>
        </div>

        {/* ── right panel: frame details + tier list ── */}
        <div className="flex min-w-0 flex-1 flex-col gap-4 pt-1">
          {/* active frame description */}
          <div
            key={`desc-${animKey}`}
            className="lang-fade rounded-xl border px-4 py-3"
            style={{
              borderColor: `${FRAME_TINTS[frameIdx]}33`,
              background: `${FRAME_TINTS[frameIdx]}0d`,
            }}
          >
            <p
              className="mb-1 text-sm font-semibold"
              style={{ color: FRAME_TINTS[frameIdx] }}
            >
              <T v={activeFrame.name} />
            </p>
            <p className="text-xs leading-relaxed text-ghost-300">
              <T v={activeFrame.gloss} />
            </p>
          </div>

          {/* tier list – bottom to top */}
          <div className="flex flex-col gap-1.5">
            {NEED_LAYERS.map((layer, tier) => {
              const isHov = hoveredTier === tier;
              const label = activeFrame.layers[tier];
              return (
                <div
                  key={`${layer.key}-list-${animKey}`}
                  className="lang-fade flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200"
                  style={{
                    background: isHov ? `${layer.accent}18` : `${layer.accent}08`,
                    border: `1px solid ${isHov ? layer.accent + "66" : layer.accent + "22"}`,
                  }}
                  onMouseEnter={() => setHoveredTier(tier)}
                  onMouseLeave={() => setHoveredTier(null)}
                  onTouchStart={() => setHoveredTier(tier)}
                  onTouchEnd={() => setHoveredTier(null)}
                >
                  {/* color dot */}
                  <span
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{
                      background: layer.accent,
                      boxShadow: `0 0 6px ${layer.accent}88`,
                    }}
                  />
                  {/* tier number */}
                  <span
                    className="mono text-[0.6rem] opacity-50"
                    style={{ color: layer.accent }}
                  >
                    {String(tier + 1).padStart(2, "0")}
                  </span>
                  {/* label */}
                  <span
                    className={`flex-1 text-sm ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: isHov ? layer.accent : "#d4d4e8" }}
                  >
                    {label[lang]}
                  </span>
                  {/* maslow anchor key */}
                  {frameIdx !== 0 && (
                    <span className="mono text-[0.6rem] text-ghost-600">
                      {STATUS_FRAMES[0].layers[tier][lang]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── divider ── */}
      <div className="mt-7 h-px rule-neon opacity-40" />

      {/* ── key insight caption ── */}
      <div className="mt-5 rounded-xl border border-ghost-700/30 bg-ink-900/40 px-4 py-3">
        <p className="label-mono mb-2 text-ghost-500">
          {lang === "zh" ? "洞察" : "key insight"}
        </p>
        <p className={`text-xs leading-relaxed text-ghost-300 ${lang === "zh" ? "zh" : ""}`}>
          <T
            v={{
              en: "The structure — a ladder of needs running from survival up to transcendence — is shared across cultures. What differs is only the vocabulary each culture uses to name the same rungs. Confucian honor reads esteem as right conduct within one's role; the aristocratic code fixes it to bloodline and glory; the modern attention economy melts the entire upper pyramid into a live, quantified scoreboard of likes and followers that never closes.",
              zh: "这一结构——一座从生存通往超越的需求阶梯——是跨文化共享的。不同之处，仅在于每种文化用来命名同一级台阶的词汇。儒家荣誉将尊重读作在自身角色之中的行止得当；贵族法典将它固定于血统与荣耀；而现代的注意力经济，则将金字塔上层整个熔化为一块实时的、被量化的、永不收盘的点赞与粉丝记分牌。",
            }}
          />
        </p>
      </div>
    </div>
  );
}
