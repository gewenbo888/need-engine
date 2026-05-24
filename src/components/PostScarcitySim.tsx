"use client";

import { useState } from "react";
import { T, useLang } from "./lang";
import { POSTSCARCITY_SCENARIOS, AI_NEED_ANALOGS } from "./content";

/* ------------------------------------------------------------------ *
 *  Desire-redistribution weights as scarcity falls from 100 → 0.
 *  Each function takes scarcity s ∈ [0,100] and returns a raw weight.
 *  The five keys match POSTSCARCITY_SCENARIOS.
 * ------------------------------------------------------------------ */
function rawWeights(s: number): Record<string, number> {
  const hi = s / 100; // 1 at high scarcity, 0 at none
  const lo = 1 - hi; // 0 at high scarcity, 1 at none
  // material "survival" fills most of the chart at high scarcity
  const survival = hi * 70;
  // status rises quickly as material pressure eases
  const status = lo * lo * 28 + lo * 6;
  // meaning rises but requires cultivation — moderate curve
  const meaning = lo * (0.5 + 0.5 * lo) * 18;
  // virtual climbs steeply once basics met
  const virtual = lo * lo * 22;
  // captured: AI capture rises sharply in the low-scarcity zone
  const captured = lo * lo * lo * 20 + lo * 4;
  // anomie: risk band — peaks in the mid-low zone
  const anomie = lo * (1 - lo * 0.6) * 10;
  return { survival, status, meaning, virtual, captured, anomie };
}

const SCENARIO_ORDER = ["status", "meaning", "virtual", "captured", "anomie"] as const;

// Material survival is the "before" band — not a scenario, just context
const SURVIVAL_LABEL = { en: "Material / survival pressure", zh: "物质 / 生存压力" };

const SCARCITY_READOUT: Array<{ threshold: number; en: string; zh: string }> = [
  { threshold: 80, en: "Material need still binds. Desire is largely organised around survival, physical security, and the basics of social provision.", zh: "物质需求仍在绑缚。欲望大体围绕生存、人身安全与基本社会保障而组织。" },
  { threshold: 55, en: "Scarcity is loosening its grip. Status rivalry and positional games start filling the space material need is vacating.", zh: "稀缺正在松开它的钳制。地位竞争与位置博弈开始填补物质需求正在腾出的空间。" },
  { threshold: 30, en: "The binding constraint is now attention, status and meaning. AI systems begin capturing desire at the source.", zh: "绑缚性的约束，如今是注意力、地位与意义。人工智能系统开始从源头捕获欲望。" },
  { threshold: 0, en: "Material pressure near zero. Desire redistributes into status games, virtual worlds, AI-curated identity — with anomie as the latent failure mode.", zh: "物质压力趋近于零。欲望重新分配进地位博弈、虚拟世界、AI策展的身份——失范作为潜伏的失败模式。" },
];

function getReadout(s: number) {
  return SCARCITY_READOUT.find((r) => s > r.threshold) ?? SCARCITY_READOUT[SCARCITY_READOUT.length - 1];
}

export default function PostScarcitySim() {
  const { lang } = useLang();
  const [scarcity, setScarcity] = useState<number>(75);
  const [selected, setSelected] = useState<string | null>(null);

  const weights = rawWeights(scarcity);
  const total = Object.values(weights).reduce((a, b) => a + b, 0);

  // normalised percentages for each band (0–100)
  const pct = (key: string) => Math.round((weights[key] / total) * 100);
  const survivalPct = pct("survival");
  const readout = getReadout(scarcity);

  const selectedScenario =
    selected ? POSTSCARCITY_SCENARIOS.find((sc) => sc.key === selected) ?? null : null;

  return (
    <div className="holo rounded-2xl p-5 md:p-7 space-y-8">
      {/* ── Title row ─────────────────────────────────────────── */}
      <div>
        <p className="label-mono text-ember-400 mb-1">
          after scarcity <span className="text-ghost-500 mx-1">/</span>{" "}
          <span className="zh">稀缺之后</span>
        </p>
        <h3 className="display text-xl md:text-2xl text-ghost-50 leading-snug">
          <T v={{ en: "Where Does Desire Go?", zh: "欲望去往何处？" }} />
        </h3>
        <p className="mt-2 text-xs text-ghost-400 leading-relaxed max-w-2xl">
          <T
            v={{
              en: "As material scarcity falls toward zero, human desire does not vanish — it redistributes. Drag the slider to see how want migrates across five post-scarcity scenarios.",
              zh: "随着物质稀缺趋近于零，人类的欲望并不消失——它重新分配。拖动滑块，看「想要」如何在五种后稀缺情景之间迁移。",
            }}
          />
        </p>
      </div>

      {/* ── PART 1 — Scarcity slider + stacked bar ────────────── */}
      <div className="space-y-5">
        {/* Slider row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label className="label-mono text-ghost-300 text-[0.72rem]">
              <T v={{ en: "Material scarcity", zh: "物质稀缺" }} />
            </label>
            <div className="flex items-center gap-3">
              <span className="mono tnum text-xs text-ghost-500">
                <T v={{ en: "ZERO", zh: "零" }} />
              </span>
              <div className="h-px w-6 rule-neon opacity-40" />
              <span className="mono tnum text-xs text-ember-400">
                <T v={{ en: "HIGH", zh: "极高" }} />
              </span>
            </div>
          </div>
          {/* custom styled range input */}
          <div className="relative">
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={scarcity}
              onChange={(e) => { setScarcity(Number(e.target.value)); setSelected(null); }}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ff9d3c ${scarcity}%, #1e1b2e ${scarcity}%)`,
                outline: "none",
              }}
            />
          </div>
          {/* readout */}
          <p
            key={readout.en}
            className="text-[0.72rem] leading-relaxed text-ghost-300 lang-fade"
          >
            {lang === "zh" ? readout.zh : readout.en}
          </p>
        </div>

        {/* Stacked bar */}
        <div className="space-y-2">
          <p className="label-mono text-ghost-500 text-[0.65rem]">
            <T v={{ en: "Desire distribution", zh: "欲望分布" }} />
          </p>

          {/* the bar itself */}
          <div className="flex h-10 w-full overflow-hidden rounded-xl border border-ghost-700/30 gap-px">
            {/* survival band */}
            <div
              className="relative flex items-center justify-center overflow-hidden transition-all duration-500"
              style={{
                width: `${survivalPct}%`,
                background: "linear-gradient(135deg, #2a1800 0%, #3d2200 100%)",
                borderRight: survivalPct > 0 ? "1px solid #ff9d3c22" : "none",
              }}
              title={lang === "zh" ? "物质/生存压力" : "Material / survival pressure"}
            >
              {survivalPct > 12 && (
                <span className="label-mono text-[0.55rem] text-ember-600 truncate px-1">
                  {lang === "zh" ? "生存" : "survival"}
                </span>
              )}
            </div>

            {/* 5 scenario bands */}
            {SCENARIO_ORDER.map((key) => {
              const sc = POSTSCARCITY_SCENARIOS.find((s) => s.key === key)!;
              const w = pct(key);
              if (w === 0) return null;
              const isSelected = selected === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelected(selected === key ? null : key)}
                  className="relative flex items-center justify-center overflow-hidden transition-all duration-500 focus:outline-none"
                  style={{
                    width: `${w}%`,
                    background: isSelected
                      ? sc.accent
                      : `${sc.accent}44`,
                    boxShadow: isSelected ? `0 0 14px ${sc.accent}88` : "none",
                    borderRight: "1px solid #ffffff08",
                  }}
                  aria-pressed={isSelected}
                  title={sc.name[lang]}
                >
                  {w > 10 && (
                    <span
                      className="label-mono truncate px-1 text-[0.55rem]"
                      style={{ color: isSelected ? "#fff" : sc.accent }}
                    >
                      {lang === "zh" ? sc.name.zh : sc.name.en}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* percent labels below bar */}
          <div className="flex w-full text-[0.6rem] mono tnum text-ghost-600">
            <div
              className="overflow-hidden text-center transition-all duration-500"
              style={{ width: `${survivalPct}%` }}
            >
              {survivalPct > 8 ? `${survivalPct}%` : ""}
            </div>
            {SCENARIO_ORDER.map((key) => {
              const w = pct(key);
              const sc = POSTSCARCITY_SCENARIOS.find((s) => s.key === key)!;
              return (
                <div
                  key={key}
                  className="overflow-hidden text-center transition-all duration-500"
                  style={{ width: `${w}%`, color: sc.accent }}
                >
                  {w > 6 ? `${w}%` : ""}
                </div>
              );
            })}
          </div>
        </div>

        {/* Scenario legend + gloss cards */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 mt-1">
          {POSTSCARCITY_SCENARIOS.map((sc) => {
            const isSelected = selected === sc.key;
            return (
              <button
                key={sc.key}
                onClick={() => setSelected(selected === sc.key ? null : sc.key)}
                className="rounded-xl border px-3 py-2 text-left transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: isSelected ? sc.accent : `${sc.accent}44`,
                  background: isSelected ? `${sc.accent}18` : "transparent",
                  boxShadow: isSelected ? `0 0 10px ${sc.accent}44` : "none",
                }}
                aria-pressed={isSelected}
              >
                <span
                  className="block label-mono text-[0.62rem] leading-tight"
                  style={{ color: sc.accent }}
                >
                  <T v={sc.name} />
                </span>
                <span className="block mt-0.5 text-[0.6rem] text-ghost-500 leading-tight">
                  {lang === "zh"
                    ? (sc.key === "status" ? "地位博弈" : sc.key === "meaning" ? "意义精通" : sc.key === "virtual" ? "虚拟世界" : sc.key === "captured" ? "AI捕获" : "失范")
                    : (sc.key === "status" ? "positional" : sc.key === "meaning" ? "cultivated" : sc.key === "virtual" ? "designed scarcity" : sc.key === "captured" ? "AI-shaped" : "risk band")
                  }
                </span>
              </button>
            );
          })}
        </div>

        {/* Gloss panel for selected scenario */}
        {selectedScenario && (
          <div
            key={selectedScenario.key}
            className="rounded-xl border p-4 lang-fade transition-all duration-300"
            style={{
              borderColor: `${selectedScenario.accent}55`,
              background: `${selectedScenario.accent}0d`,
            }}
          >
            <p
              className="display text-sm mb-1"
              style={{ color: selectedScenario.accent }}
            >
              <T v={selectedScenario.name} />
            </p>
            <p className="text-xs text-ghost-300 leading-relaxed">
              <T v={selectedScenario.gloss} />
            </p>
          </div>
        )}
      </div>

      {/* ── Divider ───────────────────────────────────────────── */}
      <div className="h-px rule-neon opacity-50" />

      {/* ── PART 2 — Do machines need? ────────────────────────── */}
      <div className="space-y-4">
        <div>
          <p className="label-mono text-signal-400 mb-1 text-[0.7rem]">
            <T v={{ en: "instrumental sub-goals", zh: "工具性子目标" }} />
          </p>
          <h3 className="display text-lg md:text-xl text-ghost-50 leading-snug">
            <T v={{ en: "Do Machines Need?", zh: "机器有需求吗？" }} />
          </h3>
          <p className="mt-2 text-xs text-ghost-400 leading-relaxed max-w-2xl">
            <T
              v={{
                en: "A goal-directed optimizer develops instrumental sub-goals that are need-shaped without any biology beneath them — function without (known) feeling. Ask a system to pursue any objective, and four sub-goals emerge by logic alone.",
                zh: "一个目标导向的优化器，会发展出形状上酷似需求的工具性子目标——其下却没有任何生物学——功能，没有（已知的）感受。要求一个系统去追逐任何目标，仅凭逻辑，四种子目标便会浮现。",
              }}
            />
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {AI_NEED_ANALOGS.map((an) => (
            <div
              key={an.key}
              className="rounded-xl border p-4 space-y-2 transition-all duration-200 hover:scale-[1.01]"
              style={{
                borderColor: `${an.accent}44`,
                background: `${an.accent}0a`,
              }}
            >
              {/* icon strip */}
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-base shrink-0"
                  style={{ background: `${an.accent}22`, color: an.accent }}
                  aria-hidden
                >
                  {an.key === "reward" ? "⚡" : an.key === "resources" ? "◈" : an.key === "preserve" ? "◉" : "◎"}
                </span>
                <span
                  className="display text-sm font-semibold"
                  style={{ color: an.accent }}
                >
                  <T v={an.name} />
                </span>
              </div>
              <p className="text-xs text-ghost-300 leading-relaxed">
                <T v={an.gloss} />
              </p>
            </div>
          ))}
        </div>

        {/* closing framing line */}
        <div
          className="rounded-xl border border-mind-500/20 bg-mind-500/5 px-4 py-3 mt-2"
        >
          <p className="text-xs text-ghost-300 leading-relaxed">
            <T
              v={{
                en: "These are need-shaped structures with no biology beneath them. Aligning them with human flourishing — rather than against it — is among the hardest problems the post-scarcity era inherits.",
                zh: "这些是需求形状的结构，其下没有生物学。让它们与人类的繁荣相对齐——而非背道而驰——是后稀缺时代所继承的最艰难问题之一。",
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
}
