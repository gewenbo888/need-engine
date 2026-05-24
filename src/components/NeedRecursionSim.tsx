"use client";

import { useEffect, useState } from "react";
import { RECURSION_LAYERS } from "./content";
import { T, useLang } from "./lang";

/**
 * The recursive engine. The same move — detect a gap between a required state
 * and the world, and act until it closes — re-emerges at every scale, from a
 * cell climbing a chemical gradient up to a civilization learning to author its
 * own wanting. A rising signal lights each layer in turn. The claim: need is
 * not many things. It is one gap-closing logic, iterated.
 */
export default function NeedRecursionSim() {
  const { lang } = useLang();
  const n = RECURSION_LAYERS.length;
  const [step, setStep] = useState(n);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => setStep((s) => (s + 1) % (n + 1)), 950);
    return () => clearInterval(id);
  }, [play, n]);

  return (
    <div className="holo rounded-2xl p-5 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="label-mono">{lang === "zh" ? "递归需求引擎" : "recursive need engine"}</div>
          <h3 className={`mt-1 display text-2xl text-flame-300 ${lang === "zh" ? "zh" : ""}`}>
            <T v={{ en: "One gap, every scale", zh: "同一道缺口，每一种尺度" }} />
          </h3>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPlay((p) => !p)} className="rounded-full border border-ember-500/40 px-3.5 py-1.5 mono text-[0.62rem] uppercase tracking-wider text-ember-300 transition hover:border-ember-400">
            {play ? (lang === "zh" ? "暂停" : "pause") : (lang === "zh" ? "运行模拟" : "run sim")}
          </button>
          <button onClick={() => { setPlay(false); setStep((s) => (s >= n ? 1 : s + 1)); }} className="rounded-full border border-mind-500/30 px-3.5 py-1.5 mono text-[0.62rem] uppercase tracking-wider text-mind-300 transition hover:border-mind-400">
            {lang === "zh" ? "单步 ▸" : "step ▸"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-2.5">
        {RECURSION_LAYERS.map((l, i) => {
          const lit = i < step;
          const cur = i === step - 1;
          return (
            <div
              key={l.k}
              className="grid grid-cols-[150px_1fr] items-center gap-3 rounded-lg border px-3 py-2.5 transition-all duration-500 sm:grid-cols-[190px_1fr_1.7fr]"
              style={{
                borderColor: lit ? l.color + "66" : "rgba(216,180,254,0.08)",
                background: cur ? l.color + "18" : lit ? "rgba(216,180,254,0.03)" : "transparent",
                opacity: lit ? 1 : 0.32,
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="mono text-[0.62rem] text-ghost-500">{String(i + 1).padStart(2, "0")}</span>
                <span className="h-2.5 w-2.5 shrink-0 rounded-full transition" style={{ background: lit ? l.color : "transparent", border: `2px solid ${l.color}`, boxShadow: cur ? `0 0 14px ${l.color}` : "none" }} />
                <span className={`display text-sm ${lang === "zh" ? "zh" : ""}`} style={{ color: lit ? l.color : "#675d80" }}><T v={l.name} /></span>
              </div>
              <div className="mono text-[0.66rem] text-ghost-300"><T v={l.scale} /></div>
              <div className="text-sm leading-snug text-ghost-200">
                <span className="text-ghost-500">{lang === "zh" ? "需求在此：" : "need here: "}</span><T v={l.move} />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-ghost-300">
        <T v={{
          en: "Run it bottom to top. At each layer the unit changes — a molecule, a feeling, a status, a price, a feed, an optimizer, a civilization, a mind choosing its own ends — but the move is identical: hold a model of a required state, detect the gap between it and reality, and act until it closes. Need is not eight things. It is one gap-closing logic, recursing from a cell climbing a sugar gradient all the way up to a species learning to decide which gaps are worth closing at all.",
          zh: "从下往上运行它。在每一层，单元都在变化——一个分子、一种感受、一个地位、一个价格、一道信息流、一个优化器、一个文明、一个选择自身目的的心智——但那个动作始终如一：持有一个所需状态的模型，侦测它与现实之间的缺口，并行动直到缺口闭合。需求，不是八样东西。它是同一种闭合缺口的逻辑，从一只沿糖梯度攀爬的细胞，一路递归到一个学着去决定「哪些缺口究竟值得闭合」的物种。",
        }} />
      </p>
    </div>
  );
}
