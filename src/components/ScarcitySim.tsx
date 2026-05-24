"use client";

import { useState, useMemo } from "react";
import { T, useLang } from "./lang";
import { SCARCITY_EPOCHS, ScarcityEpoch } from "./content";

/* ── pressure math ──────────────────────────────────────────────── */
function calcPressure(demand: number, supply: number): number {
  // supply=0 → clamp to 1 to avoid div/0; normalize to [0,1]
  const s = Math.max(supply, 1);
  const raw = demand / s; // 0 → 0 at demand=0, up to 100 at demand=100,supply=1
  return Math.min(raw, 3) / 3; // cap at 3× ratio → 1.0
}

/* ── resolution paths ─────────────────────────────────────────────
   ordered low → extreme; threshold is the minimum pressure to activate */
const PATHS = [
  {
    key: "abundance",
    threshold: 0,
    color: "#2dd4ee",
    label: { en: "Abundance · Trade", zh: "富足·贸易" },
    desc: {
      en: "Resources and exchange keep pace with demand. Surplus drives cooperation.",
      zh: "资源与交换跟上需求。盈余推动合作。",
    },
  },
  {
    key: "intensify",
    threshold: 0.28,
    color: "#ff9d3c",
    label: { en: "Intensification · Innovation", zh: "集约·创新" },
    desc: {
      en: "Pressure triggers investment in better tools, techniques, and organisation.",
      zh: "压力触发对更好工具、技术与组织的投入。",
    },
  },
  {
    key: "migration",
    threshold: 0.52,
    color: "#ff6ba3",
    label: { en: "Migration", zh: "迁徙" },
    desc: {
      en: "When the land cannot yield more, people move toward resource frontiers.",
      zh: "当土地无法多产，人们迁向资源的前沿。",
    },
  },
  {
    key: "conflict",
    threshold: 0.76,
    color: "#ff3d80",
    label: { en: "Conflict · War", zh: "冲突·战争" },
    desc: {
      en: "Extreme scarcity turns neighbours into rivals; taking replaces exchange.",
      zh: "极端稀缺使邻人成为对手；「夺」取代「换」。",
    },
  },
] as const;

/* ── gauge arc helpers ────────────────────────────────────────────── */
const CX = 100;
const CY = 96;
const R = 72;
const START_ANGLE = 210; // degrees, clockwise from 3 o'clock
const SWEEP = 240; // degrees

function polarToXY(angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function describeArc(startDeg: number, endDeg: number, r: number) {
  const s = polarToXY(startDeg, r);
  const e = polarToXY(endDeg, r);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

/* lerp between colors by pressure bands */
function pressureColor(p: number): string {
  if (p < 0.28) return "#2dd4ee";
  if (p < 0.52) return "#ff9d3c";
  if (p < 0.76) return "#ff6ba3";
  return "#ff3d80";
}

/* ── component ──────────────────────────────────────────────────── */
export default function ScarcitySim() {
  const { lang } = useLang();

  /* slider state */
  const [demand, setDemand] = useState(55);
  const [supply, setSupply] = useState(60);
  const [selected, setSelected] = useState<string | null>(null);

  const pressure = useMemo(() => calcPressure(demand, supply), [demand, supply]);

  /* highest unlocked path index */
  const activeIdx = useMemo(() => {
    let idx = 0;
    PATHS.forEach((p, i) => {
      if (pressure >= p.threshold) idx = i;
    });
    return idx;
  }, [pressure]);

  const col = pressureColor(pressure);

  /* gauge arc: fill 0…SWEEP proportionally */
  const fillAngle = START_ANGLE + pressure * SWEEP;
  const needleAngle = START_ANGLE + pressure * SWEEP;
  const trackStart = START_ANGLE;
  const trackEnd = START_ANGLE + SWEEP;

  /* selected epoch object */
  const selectedEpoch: ScarcityEpoch | undefined = SCARCITY_EPOCHS.find(
    (e) => e.key === selected
  );

  return (
    <div className="holo rounded-2xl p-5 md:p-7 space-y-7">
      {/* ── title row ──────────────────────────────────────────── */}
      <div>
        <p className="label-mono mb-2 text-ghost-500">
          {lang === "zh" ? "需求的压力" : "the pressure of need"}
        </p>
        <h3 className="display text-xl text-ghost-50 md:text-2xl">
          <T v={{ en: "Scarcity, Competition & the Engine of History", zh: "稀缺、竞争与历史的引擎" }} />
        </h3>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-ghost-400">
          <T
            v={{
              en: "Collective need pressed against the hard wall of scarcity resolves as migration, trade, innovation, or war — and that pressure is very nearly the motor of history.",
              zh: "集体需求压向稀缺这堵硬墙，以迁徙、贸易、创新或战争的形式化解——而那份压力，几乎就是历史的发动机。",
            }}
          />
        </p>
      </div>

      <div className="h-px rule-neon opacity-50" />

      {/* ── PART 1: pressure simulator ─────────────────────────── */}
      <div className="grid gap-8 md:grid-cols-2">

        {/* left: sliders */}
        <div className="flex flex-col gap-6 justify-center">
          {/* demand slider */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="label-mono text-ghost-300">
                <T v={{ en: "Demand 需求", zh: "需求 Demand" }} />
              </span>
              <span className="mono tnum text-ember-400 text-sm">{demand}</span>
            </div>
            <p className="text-[0.68rem] text-ghost-500 mb-2">
              <T v={{ en: "Population × appetite — how hard people press on available resources.", zh: "人口 × 欲求——人们对可用资源的施压程度。" }} />
            </p>
            <input
              type="range"
              min={0}
              max={100}
              value={demand}
              onChange={(e) => setDemand(Number(e.target.value))}
              className="w-full accent-ember-400 cursor-pointer"
              aria-label="demand"
            />
            <div className="flex justify-between text-[0.6rem] text-ghost-600 mt-1">
              <span>{lang === "zh" ? "低" : "low"}</span>
              <span>{lang === "zh" ? "极高" : "extreme"}</span>
            </div>
          </div>

          {/* supply slider */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="label-mono text-ghost-300">
                <T v={{ en: "Supply 供给", zh: "供给 Supply" }} />
              </span>
              <span className="mono tnum text-signal-400 text-sm">{supply}</span>
            </div>
            <p className="text-[0.68rem] text-ghost-500 mb-2">
              <T v={{ en: "Available resource — land, water, energy, compute, or any constrained good.", zh: "可用资源——土地、水、能量、算力，或任何受约束的物品。" }} />
            </p>
            <input
              type="range"
              min={0}
              max={100}
              value={supply}
              onChange={(e) => setSupply(Number(e.target.value))}
              className="w-full accent-signal-400 cursor-pointer"
              aria-label="supply"
            />
            <div className="flex justify-between text-[0.6rem] text-ghost-600 mt-1">
              <span>{lang === "zh" ? "极低" : "scarce"}</span>
              <span>{lang === "zh" ? "充裕" : "abundant"}</span>
            </div>
          </div>

          {/* pressure readout */}
          <div className="rounded-xl border border-ghost-700/40 bg-ink-900/60 px-4 py-3">
            <p className="label-mono text-xs text-ghost-500 mb-1">
              {lang === "zh" ? "当前压力指数" : "scarcity pressure index"}
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className="mono tnum text-3xl font-bold transition-colors duration-500"
                style={{ color: col, textShadow: `0 0 20px ${col}88` }}
              >
                {Math.round(pressure * 100)}
              </span>
              <span className="text-ghost-500 text-sm">/ 100</span>
            </div>
            {/* pressure interpretation */}
            <p className="mt-2 text-xs text-ghost-300 leading-relaxed">
              {pressure < 0.28 && (
                <T v={{ en: "Resources are broadly sufficient. Society can afford cooperation and trade.", zh: "资源大体充足。社会可以负担合作与贸易。" }} />
              )}
              {pressure >= 0.28 && pressure < 0.52 && (
                <T v={{ en: "Growing tension drives investment in tools and techniques — the crucible of invention.", zh: "日增的紧张推动对工具与技术的投入——发明的熔炉。" }} />
              )}
              {pressure >= 0.52 && pressure < 0.76 && (
                <T v={{ en: "The land can no longer absorb the need. Populations begin to move toward new frontiers.", zh: "土地已无法容纳这份需求。人口开始向新边疆移动。" }} />
              )}
              {pressure >= 0.76 && (
                <T v={{ en: "Extreme scarcity. Cooperation collapses into rivalry; conflict becomes the path of least resistance.", zh: "极端稀缺。合作崩溃为对抗；冲突成为阻力最小之路。" }} />
              )}
            </p>
          </div>
        </div>

        {/* right: gauge + resolution ladder */}
        <div className="flex flex-col items-center gap-6">
          {/* SVG gauge */}
          <div className="relative w-full max-w-[220px]">
            <svg viewBox="0 0 200 130" className="w-full overflow-visible" aria-hidden>
              {/* track */}
              <path
                d={describeArc(trackStart, trackEnd, R)}
                fill="none"
                stroke="#1e1830"
                strokeWidth={14}
                strokeLinecap="round"
              />
              {/* gradient segments — four color bands */}
              {[
                { from: 0, to: 0.28, c: "#2dd4ee" },
                { from: 0.28, to: 0.52, c: "#ff9d3c" },
                { from: 0.52, to: 0.76, c: "#ff6ba3" },
                { from: 0.76, to: 1.0, c: "#ff3d80" },
              ].map((seg) => {
                const sa = trackStart + seg.from * SWEEP;
                const ea = trackStart + seg.to * SWEEP;
                return (
                  <path
                    key={seg.c}
                    d={describeArc(sa, ea, R)}
                    fill="none"
                    stroke={seg.c}
                    strokeWidth={14}
                    strokeLinecap="butt"
                    opacity={0.18}
                  />
                );
              })}
              {/* fill arc */}
              {pressure > 0.005 && (
                <path
                  d={describeArc(trackStart, Math.min(fillAngle, trackEnd - 0.01), R)}
                  fill="none"
                  stroke={col}
                  strokeWidth={14}
                  strokeLinecap="round"
                  style={{
                    filter: `drop-shadow(0 0 6px ${col}cc)`,
                    transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
                  }}
                />
              )}
              {/* needle */}
              {(() => {
                const tip = polarToXY(needleAngle, R - 4);
                const base1 = polarToXY(needleAngle + 90, 8);
                const base2 = polarToXY(needleAngle - 90, 8);
                return (
                  <polygon
                    points={`${tip.x},${tip.y} ${base1.x},${base1.y} ${CX},${CY} ${base2.x},${base2.y}`}
                    fill={col}
                    opacity={0.9}
                    style={{
                      filter: `drop-shadow(0 0 4px ${col})`,
                      transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
                    }}
                  />
                );
              })()}
              {/* center hub */}
              <circle cx={CX} cy={CY} r={7} fill="#0d0b18" stroke={col} strokeWidth={2} style={{ transition: "stroke 0.35s" }} />
              {/* pressure value center */}
              <text
                x={CX}
                y={CY + 26}
                textAnchor="middle"
                fill={col}
                fontFamily="monospace"
                fontSize={18}
                fontWeight="bold"
                style={{ transition: "fill 0.35s" }}
              >
                {Math.round(pressure * 100)}
              </text>
              <text x={CX} y={CY + 38} textAnchor="middle" fill="#6b6a7a" fontFamily="monospace" fontSize={7}>
                {lang === "zh" ? "压力指数" : "PRESSURE INDEX"}
              </text>
            </svg>
          </div>

          {/* resolution ladder */}
          <div className="w-full space-y-2">
            <p className="label-mono text-[0.65rem] text-ghost-500 mb-3">
              {lang === "zh" ? "化解路径" : "resolution pathway"}
            </p>
            {PATHS.map((path, i) => {
              const isActive = i === activeIdx;
              const isUnlocked = pressure >= path.threshold;
              return (
                <div
                  key={path.key}
                  className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-500 border ${
                    isActive
                      ? "border-opacity-60 bg-ink-800/80"
                      : isUnlocked
                      ? "border-ghost-700/20 bg-ink-900/30"
                      : "border-transparent bg-transparent"
                  }`}
                  style={
                    isActive
                      ? {
                          borderColor: `${path.color}60`,
                          boxShadow: `0 0 18px ${path.color}22, inset 0 0 12px ${path.color}0a`,
                        }
                      : {}
                  }
                >
                  {/* indicator dot */}
                  <span
                    className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full transition-all duration-500"
                    style={{
                      background: isUnlocked ? path.color : "#2a2840",
                      boxShadow: isActive ? `0 0 10px ${path.color}` : "none",
                    }}
                  />
                  <div className="min-w-0">
                    <span
                      className={`display text-sm transition-colors duration-300 ${isActive ? "text-ghost-50" : isUnlocked ? "text-ghost-300" : "text-ghost-600"}`}
                      style={isActive ? { color: path.color, textShadow: `0 0 14px ${path.color}88` } : {}}
                    >
                      <T v={path.label} />
                    </span>
                    {isActive && (
                      <p className="mt-0.5 text-[0.68rem] leading-snug text-ghost-400">
                        <T v={path.desc} />
                      </p>
                    )}
                  </div>
                  {/* threshold badge */}
                  <span className="ml-auto shrink-0 mono tnum text-[0.58rem] text-ghost-600">
                    ≥{Math.round(path.threshold * 100)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-px rule-neon opacity-40" />

      {/* ── PART 2: epochs timeline ─────────────────────────────── */}
      <div>
        <p className="label-mono mb-1 text-ghost-500">
          {lang === "zh" ? "历史上的稀缺纪元" : "scarcity epochs across history"}
        </p>
        <p className="mb-5 text-xs text-ghost-400">
          <T
            v={{
              en: "Five pivotal moments when collective need collided with a hard resource ceiling — and remade the world.",
              zh: "五个关键时刻——集体需求撞上某种资源上限，并由此重塑了世界。",
            }}
          />
        </p>

        {/* horizontal epoch nodes */}
        <div className="relative mb-6">
          {/* connector line */}
          <div className="absolute top-5 left-0 right-0 h-px bg-ghost-700/30" aria-hidden />

          <div className="relative flex items-start justify-between gap-1">
            {SCARCITY_EPOCHS.map((epoch, i) => {
              const isSel = selected === epoch.key;
              return (
                <button
                  key={epoch.key}
                  onClick={() => setSelected(isSel ? null : epoch.key)}
                  className="group flex flex-col items-center gap-2 flex-1 min-w-0 focus:outline-none"
                  aria-pressed={isSel}
                >
                  {/* node circle */}
                  <span
                    className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300"
                    style={{
                      borderColor: isSel ? epoch.accent : `${epoch.accent}50`,
                      background: isSel ? `${epoch.accent}22` : "#0d0b18",
                      boxShadow: isSel ? `0 0 18px ${epoch.accent}66` : "none",
                    }}
                  >
                    <span
                      className="mono text-sm font-bold"
                      style={{ color: isSel ? epoch.accent : `${epoch.accent}99` }}
                    >
                      {i + 1}
                    </span>
                  </span>
                  {/* label */}
                  <span
                    className={`display text-center text-[0.65rem] leading-tight transition-colors duration-200 px-0.5 ${
                      isSel ? "text-ghost-50" : "text-ghost-400 group-hover:text-ghost-200"
                    }`}
                    style={isSel ? { color: epoch.accent } : {}}
                  >
                    {epoch.name[lang]}
                  </span>
                  {/* era badge */}
                  <span
                    className="mono text-[0.55rem] px-1.5 py-0.5 rounded-full border transition-all duration-200"
                    style={{
                      borderColor: `${epoch.accent}30`,
                      color: isSel ? epoch.accent : "#4b4a60",
                      background: isSel ? `${epoch.accent}12` : "transparent",
                    }}
                  >
                    {epoch.era[lang]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* detail panel */}
        <div
          className={`overflow-hidden transition-all duration-500 ${selectedEpoch ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          {selectedEpoch && (
            <div
              className="rounded-xl border p-4 md:p-5 space-y-4"
              style={{
                borderColor: `${selectedEpoch.accent}40`,
                background: `linear-gradient(135deg, ${selectedEpoch.accent}08 0%, transparent 60%)`,
              }}
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h4
                  className="display text-base text-ghost-50 md:text-lg"
                  style={{ color: selectedEpoch.accent }}
                >
                  <T v={selectedEpoch.name} />
                </h4>
                <span
                  className="mono text-xs px-2 py-1 rounded-full border"
                  style={{ borderColor: `${selectedEpoch.accent}40`, color: `${selectedEpoch.accent}cc` }}
                >
                  <T v={selectedEpoch.era} />
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="label-mono text-[0.6rem] text-ghost-500 mb-1.5">
                    {lang === "zh" ? "驱动力" : "driver"}
                  </p>
                  <p className="text-sm text-ghost-200 leading-relaxed">
                    <T v={selectedEpoch.driver} />
                  </p>
                </div>
                <div>
                  <p className="label-mono text-[0.6rem] text-ghost-500 mb-1.5">
                    {lang === "zh" ? "历史后果" : "consequence"}
                  </p>
                  <p className="text-sm text-ghost-200 leading-relaxed">
                    <T v={selectedEpoch.consequence} />
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {!selectedEpoch && (
          <p className="text-center text-[0.68rem] text-ghost-600 italic">
            <T v={{ en: "Select an epoch to reveal its driver and consequence.", zh: "选择一个纪元，揭示其驱动力与历史后果。" }} />
          </p>
        )}
      </div>
    </div>
  );
}
