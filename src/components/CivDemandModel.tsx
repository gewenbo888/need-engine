"use client";

import { T, useLang } from "./lang";
import { CAPACITIES } from "./content";

const SERIES = [
  { key: "forager" as const, label: { en: "Forager", zh: "采集者" }, color: "#ff9d3c" },
  { key: "consumer" as const, label: { en: "Consumer", zh: "消费者" }, color: "#ff3d80" },
  { key: "digital" as const, label: { en: "Digital · AI", zh: "数字 · AI" }, color: "#a855f7" },
];

export default function CivDemandModel() {
  const { lang } = useLang();
  return (
    <div className="holo rounded-2xl p-5 md:p-8">
      {/* the formula */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-center">
        <span className="display text-lg text-ghost-50 md:text-2xl">{lang === "zh" ? "文明需求" : "Civilizational Demand"}</span>
        <span className="display text-xl text-ember-400 md:text-2xl">=</span>
        {CAPACITIES.map((c, i) => (
          <span key={c.sym} className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-flame-500/30 bg-ink-900 mono text-flame-300">{c.sym}</span>
            {i < CAPACITIES.length - 1 && <span className="ember-text display text-lg">+</span>}
          </span>
        ))}
      </div>
      <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-ghost-300">
        <T v={{
          en: "A working definition: a civilization's total demand is not any single appetite but the sum of eight standing pressures — how hard it must work to survive, how much it must regulate feeling, how it competes for recognition, how it hungers to know, how scarcity squeezes it, how it seeks meaning, how it fights over finite means, and how relentlessly it constructs identity. Each era is the same eight terms re-weighted. Drag your eye across the bars: as material survival pressure falls, emotional, recognition and identity demand rise to fill the space.",
          zh: "一个可操作的定义：一个文明的总需求，不在于任何单一的食欲，而在于八种恒在压力之和——它必须多努力才能生存、必须多大程度调节感受、如何争夺认可、如何渴望去知、稀缺如何挤压它、它如何寻求意义、如何为有限的手段而争斗，以及它多么锲而不舍地构建身份。每一个时代，都是同样的八项被重新加权。让目光扫过这些条带：随着物质生存的压力下降，情绪、认可与身份的需求升起，填补那片空间。",
        }} />
      </p>

      <div className="mt-7 h-px rule-neon opacity-60" />

      {/* legend */}
      <div className="mt-6 mb-4 flex flex-wrap justify-center gap-5">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-2 text-sm text-ghost-200">
            <span className="h-3 w-3 rounded-sm" style={{ background: s.color }} /><T v={s.label} />
          </span>
        ))}
      </div>

      {/* grouped capacity bars */}
      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {CAPACITIES.map((c) => (
          <div key={c.sym}>
            <div className="flex items-baseline justify-between gap-3">
              <span className={`text-sm text-ghost-100 ${lang === "zh" ? "zh" : "display"}`}>
                <span className="mono mr-2 text-ember-400">{c.sym}</span><T v={c.name} />
              </span>
              <span className="text-[0.68rem] text-ghost-500"><T v={c.gloss} /></span>
            </div>
            <div className="mt-2 space-y-1">
              {SERIES.map((s) => (
                <div key={s.key} className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-700">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c[s.key]}%`, background: s.color, boxShadow: `0 0 8px ${s.color}66` }} />
                  </div>
                  <span className="mono tnum w-7 text-right text-[0.6rem] text-ghost-500">{c[s.key]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
