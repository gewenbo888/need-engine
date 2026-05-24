"use client";

import { useState, useMemo } from "react";
import { T, useLang } from "./lang";
import { CONSUMPTION_ERAS, DEMAND_LEVERS } from "./content";

/* ─── geometry helpers ─────────────────────────────────────── */
const W = 340;
const H = 220;
const PAD = { l: 48, r: 18, t: 18, b: 42 };
const IX = PAD.l;
const IY = PAD.t;
const IW = W - PAD.l - PAD.r;
const IH = H - PAD.t - PAD.b;

/** Map data [0,1] to SVG coords */
function sx(q: number) { return IX + q * IW; }
function sy(p: number) { return IY + (1 - p) * IH; }

/**
 * Base supply/demand parameters.
 * Each active lever shifts demand intercept up by LEVER_SHIFT.
 */
const LEVER_SHIFT = 0.06; // per lever, fraction of price axis

/** Compute equilibrium given active lever count */
function equilibrium(activeCount: number): { eqQ: number; eqP: number } {
  // Supply: P = 0.2 + 1.3 * Q  (passes through ~(0, 0.2) and (0.6, 0.98))
  // Demand: P = (demandIntercept) - 1.2 * Q
  const baseIntercept = 0.88;
  const demandIntercept = baseIntercept + activeCount * LEVER_SHIFT;
  // Set equal: 0.2 + 1.3Q = demandIntercept - 1.2Q  => 2.5Q = di - 0.2
  const eqQ = (demandIntercept - 0.2) / 2.5;
  const eqP = 0.2 + 1.3 * eqQ;
  return { eqQ: Math.min(eqQ, 0.98), eqP: Math.min(eqP, 0.98) };
}

/** Get three Q points for a demand line given intercept */
function demandLine(intercept: number): [number, number][] {
  // P = intercept - 1.2 * Q  =>  Q in [0, intercept/1.2]
  const qMax = Math.min(intercept / 1.2, 1.0);
  return [
    [0, intercept],
    [qMax / 2, intercept - 1.2 * (qMax / 2)],
    [qMax, 0],
  ];
}

/** Supply line: P = 0.2 + 1.3 * Q */
function supplyLine(): [number, number][] {
  return [
    [0, 0.2],
    [0.6, 0.98],
  ];
}

function pointsToSvg(pts: [number, number][]) {
  return pts.map(([q, p]) => `${sx(q).toFixed(1)},${sy(p).toFixed(1)}`).join(" ");
}

/* ─── lever accent colours ─────────────────────────────────── */
const LEVER_ACCENTS: Record<string, string> = {
  ad: "#ff9d3c",
  scarcity: "#ff6ba3",
  social: "#2dd4ee",
  status: "#ff3d80",
  novelty: "#a855f7",
};

/* ─── component ─────────────────────────────────────────────── */
export default function DesireEconomy() {
  const { lang } = useLang();
  const [activeLevers, setActiveLevers] = useState<Set<string>>(new Set());
  const [selectedEra, setSelectedEra] = useState<string>("mass");

  const toggleLever = (key: string) => {
    setActiveLevers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const activeCount = activeLevers.size;
  const { eqQ, eqP } = useMemo(() => equilibrium(activeCount), [activeCount]);
  const baseEq = useMemo(() => equilibrium(0), []);

  const pctLift = Math.round(((eqQ - baseEq.eqQ) / baseEq.eqQ) * 100);

  const baseIntercept = 0.88;
  const currentIntercept = baseIntercept + activeCount * LEVER_SHIFT;
  const demandPts = useMemo(() => demandLine(currentIntercept), [currentIntercept]);
  const supplyPts = supplyLine();

  const selectedEraData = CONSUMPTION_ERAS.find((e) => e.key === selectedEra)!;

  return (
    <div className="holo rounded-2xl p-5 md:p-7 space-y-7">
      {/* ── Title ── */}
      <div>
        <p className="label-mono mb-1 text-ember-400">
          {lang === "zh" ? "需求机器" : "the demand machine"}
          <span className="text-ghost-500 mx-2">/</span>
          {lang === "zh" ? "the demand machine" : "需求机器"}
        </p>
        <h3 className="display text-xl text-ghost-50 md:text-2xl">
          <T v={{ en: "How Economies Manufacture Desire", zh: "经济体如何制造欲望" }} />
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ghost-400 max-w-2xl">
          <T v={{
            en: "When supply is cheap and abundant, the binding constraint becomes demand — so these levers exist to manufacture the wanting. Toggle each to see how markets shift equilibrium.",
            zh: "当供给廉价而充裕，真正的约束便成了需求——于是这些杠杆的存在，就是为了制造「想要」。拨动每一个，看看市场如何移动均衡点。",
          }} />
        </p>
      </div>

      {/* ── Lever toggle pills ── */}
      <div>
        <p className="label-mono mb-3 text-ghost-500">
          <T v={{ en: "Demand levers", zh: "需求杠杆" }} />
          <span className="ml-3 mono tnum text-xs">
            {activeCount}/{DEMAND_LEVERS.length}
            {activeCount > 0 && (
              <span className="ml-2" style={{ color: "#ff9d3c" }}>
                +{pctLift}%
              </span>
            )}
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {DEMAND_LEVERS.map((lv) => {
            const active = activeLevers.has(lv.key);
            const accent = LEVER_ACCENTS[lv.key];
            return (
              <button
                key={lv.key}
                onClick={() => toggleLever(lv.key)}
                className="rounded-full border px-3 py-1 text-xs mono transition-all duration-200"
                style={{
                  borderColor: active ? accent : `${accent}44`,
                  background: active ? `${accent}22` : "transparent",
                  color: active ? accent : "#9ca3af",
                  boxShadow: active ? `0 0 10px ${accent}44` : "none",
                }}
                aria-pressed={active}
                title={lv.gloss[lang]}
              >
                <T v={lv.name} />
              </button>
            );
          })}
        </div>
        {/* active lever glosses */}
        {activeCount > 0 && (
          <div className="mt-3 space-y-1">
            {DEMAND_LEVERS.filter((lv) => activeLevers.has(lv.key)).map((lv) => (
              <p key={lv.key} className="text-xs text-ghost-500 flex gap-2">
                <span className="mono" style={{ color: LEVER_ACCENTS[lv.key] }}>
                  <T v={lv.name} />
                </span>
                <span>—</span>
                <T v={lv.gloss} />
              </p>
            ))}
          </div>
        )}
      </div>

      {/* ── Supply & Demand chart ── */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full max-w-sm mx-auto md:max-w-md"
          style={{ minWidth: 280 }}
          aria-label={lang === "zh" ? "供需图" : "Supply and demand chart"}
        >
          {/* grid lines */}
          {[0.25, 0.5, 0.75].map((v) => (
            <g key={v}>
              <line
                x1={sx(v)} y1={IY} x2={sx(v)} y2={IY + IH}
                stroke="#ffffff0d" strokeWidth="1" strokeDasharray="3 4"
              />
              <line
                x1={IX} y1={sy(v)} x2={IX + IW} y2={sy(v)}
                stroke="#ffffff0d" strokeWidth="1" strokeDasharray="3 4"
              />
            </g>
          ))}

          {/* Axes */}
          <line x1={IX} y1={IY} x2={IX} y2={IY + IH} stroke="#4b5563" strokeWidth="1.5" />
          <line x1={IX} y1={IY + IH} x2={IX + IW} y2={IY + IH} stroke="#4b5563" strokeWidth="1.5" />

          {/* Axis labels */}
          <text x={IX - 8} y={IY + IH / 2} textAnchor="middle" fontSize="9" fill="#6b7280"
            transform={`rotate(-90, ${IX - 8}, ${IY + IH / 2})`}>
            {lang === "zh" ? "价格 P" : "Price P"}
          </text>
          <text x={IX + IW / 2} y={IY + IH + 26} textAnchor="middle" fontSize="9" fill="#6b7280">
            {lang === "zh" ? "数量 Q" : "Quantity Q"}
          </text>

          {/* Base demand line (ghost) — shown when levers active */}
          {activeCount > 0 && (
            <polyline
              points={pointsToSvg(demandLine(baseIntercept))}
              fill="none"
              stroke="#ff3d8033"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Supply line */}
          <polyline
            points={pointsToSvg(supplyPts)}
            fill="none"
            stroke="#2dd4ee"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text
            x={sx(0.58) + 4}
            y={sy(0.95) + 4}
            fontSize="8"
            fill="#2dd4ee"
            fontFamily="monospace"
          >
            {lang === "zh" ? "供给 S" : "Supply S"}
          </text>

          {/* Demand line — animates via CSS transition on SVG points attribute */}
          <polyline
            points={pointsToSvg(demandPts)}
            fill="none"
            stroke="#ff3d80"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)" }}
          />
          <text
            x={sx(0.02)}
            y={sy(currentIntercept) - 5}
            fontSize="8"
            fill="#ff3d80"
            fontFamily="monospace"
            style={{ transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)" }}
          >
            {lang === "zh" ? "需求 D" : "Demand D"}
            {activeCount > 0 && (
              <tspan fill="#ff9d3c"> ↑{activeCount}</tspan>
            )}
          </text>

          {/* Equilibrium drop-lines */}
          <line
            x1={sx(eqQ)} y1={sy(eqP)}
            x2={sx(eqQ)} y2={IY + IH}
            stroke="#ffffff1a" strokeWidth="1" strokeDasharray="3 4"
            style={{ transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)" }}
          />
          <line
            x1={IX} y1={sy(eqP)}
            x2={sx(eqQ)} y2={sy(eqP)}
            stroke="#ffffff1a" strokeWidth="1" strokeDasharray="3 4"
            style={{ transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)" }}
          />

          {/* Equilibrium axis tick labels */}
          <text
            x={sx(eqQ)}
            y={IY + IH + 13}
            textAnchor="middle"
            fontSize="8"
            fill="#a855f7"
            fontFamily="monospace"
            className="tnum"
            style={{ transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)" }}
          >
            Q*={Math.round(eqQ * 100)}
          </text>
          <text
            x={IX - 4}
            y={sy(eqP) + 3}
            textAnchor="end"
            fontSize="8"
            fill="#a855f7"
            fontFamily="monospace"
            className="tnum"
            style={{ transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)" }}
          >
            P*={Math.round(eqP * 100)}
          </text>

          {/* Equilibrium point */}
          <circle
            cx={sx(eqQ)}
            cy={sy(eqP)}
            r={5}
            fill="#a855f7"
            stroke="#0a0a0c"
            strokeWidth="1.5"
            style={{ transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)", filter: "drop-shadow(0 0 4px #a855f7aa)" }}
          />
          <circle
            cx={sx(eqQ)}
            cy={sy(eqP)}
            r={9}
            fill="none"
            stroke="#a855f755"
            strokeWidth="1"
            className="pulse"
            style={{ transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)" }}
          />

          {/* Equilibrium label */}
          <text
            x={sx(eqQ) + 11}
            y={sy(eqP) - 7}
            fontSize="8"
            fill="#a855f7"
            fontFamily="monospace"
            style={{ transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)" }}
          >
            {lang === "zh" ? "均衡" : "Equilibrium"}
          </text>
        </svg>
      </div>

      {/* ── Readout ── */}
      <div className="rounded-lg border border-mind-500/20 bg-mind-500/5 px-4 py-3 text-xs leading-relaxed text-ghost-300">
        {activeCount === 0 ? (
          <T v={{
            en: "At rest: supply and demand intersect at a natural clearing price. No levers active — desire is organic and unmanufactured.",
            zh: "静止状态：供给与需求在自然出清价格处相交。没有杠杆激活——欲望是有机的、未被制造的。",
          }} />
        ) : activeCount < 3 ? (
          <T v={{
            en: `${activeCount} lever${activeCount > 1 ? "s" : ""} active — demand is being nudged outward. Equilibrium price and quantity both rise. The market is learning to want more.`,
            zh: `${activeCount} 个杠杆激活——需求正被向外推移。均衡价格与数量双双上升。市场正在学会想要更多。`,
          }} />
        ) : (
          <T v={{
            en: `${activeCount} levers active (+${pctLift}% demand lift) — desire is no longer found but manufactured. Every lever fires simultaneously: the consumer is surrounded. This is the algorithmic demand era.`,
            zh: `${activeCount} 个杠杆激活（需求提升 +${pctLift}%）——欲望不再是被发现的，而是被制造的。每一个杠杆同时放电：消费者被包围了。这便是算法需求时代。`,
          }} />
        )}
      </div>

      <div className="h-px rule-neon opacity-50" />

      {/* ── Consumption-era timeline ── */}
      <div>
        <p className="label-mono mb-4 text-ghost-500">
          <T v={{ en: "Consumption eras", zh: "消费时代" }} />
        </p>

        {/* Timeline nodes */}
        <div className="relative">
          {/* connecting line */}
          <div className="absolute top-4 left-0 right-0 h-px bg-ghost-700/40 hidden sm:block" />

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-0">
            {CONSUMPTION_ERAS.map((era, i) => {
              const active = selectedEra === era.key;
              const isDemandProblemEra = era.key === "mass";
              return (
                <button
                  key={era.key}
                  onClick={() => setSelectedEra(era.key)}
                  className="relative flex flex-col items-center gap-2 px-1 py-2 text-center transition-all duration-200 group"
                  aria-pressed={active}
                >
                  {/* node dot */}
                  <div
                    className="relative z-10 h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                    style={{
                      borderColor: active ? era.accent : `${era.accent}44`,
                      background: active ? `${era.accent}22` : "#0a0a0c",
                      boxShadow: active ? `0 0 12px ${era.accent}66` : "none",
                    }}
                  >
                    <span className="mono text-xs" style={{ color: active ? era.accent : "#6b7280" }}>
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                  </div>

                  {/* demand-problem badge */}
                  {isDemandProblemEra && (
                    <span
                      className="absolute -top-1 right-0 rounded-sm px-1 text-[0.55rem] mono leading-tight"
                      style={{ background: "#ff9d3c22", color: "#ff9d3c", border: "1px solid #ff9d3c44" }}
                    >
                      <T v={{ en: "demand problem", zh: "需求难题" }} />
                    </span>
                  )}

                  <div className="space-y-0.5">
                    <p
                      className="text-[0.7rem] font-medium leading-tight transition-colors"
                      style={{ color: active ? era.accent : "#d1d5db" }}
                    >
                      <T v={era.name} />
                    </p>
                    <p className="mono tnum text-[0.6rem] text-ghost-600">
                      <T v={era.era} />
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* selected era gloss */}
        {selectedEraData && (
          <div
            className="mt-4 rounded-lg border px-4 py-3 text-sm leading-relaxed text-ghost-200 transition-all duration-300"
            style={{
              borderColor: `${selectedEraData.accent}33`,
              background: `${selectedEraData.accent}0d`,
            }}
          >
            <span
              className="display mr-2 text-sm"
              style={{ color: selectedEraData.accent }}
            >
              <T v={selectedEraData.name} />
            </span>
            <span className="mono tnum text-xs text-ghost-500 mr-3">
              <T v={selectedEraData.era} />
            </span>
            <T v={selectedEraData.gloss} />
          </div>
        )}
      </div>
    </div>
  );
}
