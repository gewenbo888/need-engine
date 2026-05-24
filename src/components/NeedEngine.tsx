"use client";

import { ReactNode } from "react";
import { LangProvider, LangToggle, T, useLang } from "./lang";
import { SECTIONS, FUTURES, BIG_QUESTIONS } from "./content";
import NeedField from "./NeedField";
import DriveEmergence from "./DriveEmergence";
import DopamineLab from "./DopamineLab";
import NeedHierarchy from "./NeedHierarchy";
import DesireEconomy from "./DesireEconomy";
import AttentionEngine from "./AttentionEngine";
import HedonicTreadmill from "./HedonicTreadmill";
import MeaningField from "./MeaningField";
import ScarcitySim from "./ScarcitySim";
import PostScarcitySim from "./PostScarcitySim";
import CivDemandModel from "./CivDemandModel";
import NeedAnalyst from "./NeedAnalyst";
import NeedRecursionSim from "./NeedRecursionSim";

const VIS: Record<string, ReactNode> = {
  origin: <DriveEmergence />,
  brain: <DopamineLab />,
  status: <NeedHierarchy />,
  economics: <DesireEconomy />,
  technology: <AttentionEngine />,
  suffering: <HedonicTreadmill />,
  meaning: <MeaningField />,
  scarcity: <ScarcitySim />,
  future: (
    <div className="space-y-8">
      <PostScarcitySim />
      <FuturesGrid />
    </div>
  ),
  unified: (
    <div className="space-y-8">
      <CivDemandModel />
      <QuestionsGrid />
    </div>
  ),
};

function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-flame-500/12 bg-ink-950/80 px-5 py-3 backdrop-blur md:px-9">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 32 32" className="h-8 w-8">
          <defs>
            <radialGradient id="hdrg" cx="50%" cy="42%" r="62%">
              <stop offset="0" stopColor="#ffd6a1" />
              <stop offset="0.5" stopColor="#ff3d80" />
              <stop offset="1" stopColor="#a855f7" />
            </radialGradient>
          </defs>
          <circle cx="16" cy="16" r="10" fill="none" stroke="url(#hdrg)" strokeWidth="1.3" opacity="0.85" strokeDasharray="40 7" />
          <circle cx="16" cy="16" r="5.6" fill="none" stroke="url(#hdrg)" strokeWidth="1.6" opacity="0.9" />
          <circle cx="16" cy="16" r="2.1" fill="#ff9d3c" />
          <path d="M16 28 L16 19.5" stroke="#2dd4ee" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
        </svg>
        <div className="leading-tight">
          <div className="display text-base text-ghost-50">Need Engine</div>
          <div className="zh text-[0.6rem] text-ghost-500">需求引擎</div>
        </div>
      </div>
      <nav className="hidden gap-5 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ghost-500 xl:flex">
        <a href="#origin" className="hover:text-flame-400">Origin</a>
        <a href="#brain" className="hover:text-flame-400">Brain</a>
        <a href="#status" className="hover:text-flame-400">Status</a>
        <a href="#economics" className="hover:text-flame-400">Demand</a>
        <a href="#technology" className="hover:text-flame-400">Attention</a>
        <a href="#suffering" className="hover:text-flame-400">Craving</a>
        <a href="#meaning" className="hover:text-flame-400">Meaning</a>
        <a href="#unified" className="hover:text-flame-400">Model</a>
      </nav>
      <div className="flex items-center gap-3">
        <LangToggle />
        <a href="https://psyverse.fun" className="hidden font-mono text-[0.58rem] uppercase tracking-[0.18em] text-signal-400 hover:text-flame-400 sm:block">← Psyverse</a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="absolute inset-0 z-0 opacity-90"><NeedField /></div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-ink-950/30 via-transparent to-ink-950" />
      <div className="relative z-20 mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="label-mono">Psyverse · An atlas of need</div>
        <div className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-ghost-500">
          EN · 中文 · gradient → drive → dopamine → status → demand → attention → meaning → synthetic desire
        </div>
        <h1 className="display mt-6 text-6xl leading-[0.95] text-ghost-50 md:text-8xl">
          Need <span className="flame-text">Engine</span>
        </h1>
        <h2 className="zh mt-3 text-3xl text-ghost-200 md:text-5xl">需求引擎</h2>

        <p className="serif mt-9 max-w-2xl text-lg leading-relaxed text-ghost-100 md:text-xl">
          <T v={{
            en: "A need is older than any mind. Before there were brains to feel longing, there were chemical gradients a bacterium had to climb to survive. That single bias — reach toward what you lack — is the seed of everything: hunger and love, markets and empires, the feed that knows your cravings, the machine that may soon have cravings of its own. This is the story of the gap that drives all motion.",
            zh: "需求，比任何心智都更古老。在还没有大脑去感受渴望之前，就已有化学梯度，一只细菌必须沿之攀爬才能存活。那一个简单的偏向——伸向你所缺乏之物——便是一切的种子：饥饿与爱、市场与帝国、那懂你渴求的信息流、那或许很快将拥有自身渴求的机器。这，是关于那道驱动一切运动之缺口的故事。",
          }} />
        </p>

        <div className="mt-10 max-w-2xl holo rounded-lg p-6">
          <div className="label-mono">Central thesis · 核心论点</div>
          <p className="mt-3 text-xl leading-relaxed text-ghost-50 md:text-2xl">
            <T v={{
              en: "Need is not weakness. It is the universal grammar of incompleteness — the gap between a conscious system and the state it requires, made into the force that drives evolution, economies, technology, and civilization itself.",
              zh: "需求并非弱点。它是不完整性的通用语法——一个有意识的系统与它所要求之状态之间的缺口，被造成那驱动着演化、经济、技术与文明本身的力。",
            }} />
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ghost-500">
          <span>10 systems · 十大系统</span>
          <span>live motivation sims · 实时动机模拟</span>
          <span>dopamine · hierarchy · demand · attention · post-scarcity</span>
        </div>
      </div>
    </section>
  );
}

function SectionBlock({ num, id, title, sub, body, vis }: { num: string; id: string; title: any; sub: any; body: any; vis?: ReactNode }) {
  return (
    <section id={id} className="relative border-t border-flame-500/8 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline gap-4">
          <span className="display text-5xl text-flame-500/25">{num}</span>
          <div>
            <h2 className="display text-4xl text-ghost-50 md:text-5xl"><T v={title} /></h2>
            <h3 className="mt-1 text-lg text-signal-400"><T v={sub} /></h3>
          </div>
        </div>
        <div className="mt-5 h-px rule-neon opacity-60" />
        <p className="serif mt-8 max-w-3xl text-lg leading-relaxed text-ghost-200"><T v={body} /></p>
        {vis && <div className="mt-12">{vis}</div>}
      </div>
    </section>
  );
}

function sectionProps(id: string) {
  const s = SECTIONS.find((x) => x.id === id)!;
  return { num: s.num, id: s.id, title: s.title, sub: s.sub, body: s.body };
}

/* ---- Section 9 : future-scenario grid ---- */
function FuturesGrid() {
  const { lang } = useLang();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FUTURES.map((f, i) => (
        <div key={i} className="holo rounded-xl p-5" style={{ borderTopColor: f.accent, borderTopWidth: 2 }}>
          <div className="flex items-center justify-between">
            <span className={`display text-lg text-ghost-50 ${lang === "zh" ? "zh" : ""}`}><T v={f.name} /></span>
            <span className="font-mono text-[0.55rem] uppercase tracking-wider" style={{ color: f.accent }}><T v={f.horizon} /></span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ghost-300"><T v={f.desc} /></p>
        </div>
      ))}
    </div>
  );
}

/* ---- Section 10 : open questions ---- */
function QuestionsGrid() {
  const { lang } = useLang();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {BIG_QUESTIONS.map((q, i) => (
        <div key={i} className="holo flex gap-4 rounded-xl p-5">
          <span className="mono shrink-0 text-2xl text-signal-400/60">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <div className={`text-base leading-snug text-ghost-50 ${lang === "zh" ? "zh" : "display"}`}><T v={q.q} /></div>
            <p className="mt-2 font-mono text-[0.68rem] leading-relaxed text-signal-400/80">{q.lens.en}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Body() {
  const { lang } = useLang();
  return (
    <main className="relative bg-ink-950 text-ghost-100">
      <Header />
      <Hero />

      <div className="grid-bg border-y border-flame-500/12 bg-ink-900/60 py-2.5 overflow-hidden">
        <div className="whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-[0.3em] text-signal-400/70 ticker inline-block">
          {(lang === "zh"
            ? "梯度 · 饥饿 · 口渴 · 恐惧 · 繁殖 · 依恋 · 多巴胺 · 奖赏预测 · 想要 · 喜欢 · 习惯 · 地位 · 归属 · 尊重 · 身份 · 需求 · 价格 · 广告 · 品牌 · 注意力 · 算法 · 渴求 · 成瘾 · 意义 · 稀缺 · 后稀缺 · 合成欲望 · "
            : "GRADIENT · HUNGER · THIRST · FEAR · REPRODUCTION · ATTACHMENT · DOPAMINE · REWARD PREDICTION · WANTING · LIKING · HABIT · STATUS · BELONGING · ESTEEM · IDENTITY · DEMAND · PRICE · ADVERTISING · BRAND · ATTENTION · ALGORITHM · CRAVING · ADDICTION · MEANING · SCARCITY · POST-SCARCITY · SYNTHETIC DESIRE · ").repeat(2)}
        </div>
      </div>

      {SECTIONS.map((s) => (
        <SectionBlock key={s.id} {...sectionProps(s.id)} vis={VIS[s.id]} />
      ))}

      {/* AI layer — the Need Analyst */}
      <section id="analyst" className="relative border-t border-flame-500/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">AI layer · 人工智能层</div>
          <h2 className="display mt-3 text-4xl text-ghost-50 md:text-5xl">
            <T v={{ en: "Ask the engine", zh: "向引擎发问" }} />
          </h2>
          <p className="serif mt-6 max-w-3xl text-lg leading-relaxed text-ghost-200">
            <T v={{
              en: "Six disciplines, one question at a time. The analyst reads need structurally — as a gap between a required state and the world — and answers from the lenses of a psychologist, a neuroscientist, an economist, a systems theorist, a behavioral analyst, and a civilization researcher. It compares the great accounts of desire by their trade-offs, not by slogans, and it states open questions as open.",
              zh: "六门学科，每次一个问题。这位分析者结构性地阅读需求——把它读作所需状态与世界之间的一道缺口——并从心理学家、神经科学家、经济学家、系统论者、行为分析者与文明研究者的视角作答。它以各自的权衡、而非口号，来比较那些关于欲望的伟大论述，并把悬而未决的问题，如实陈述为悬而未决。",
            }} />
          </p>
          <div className="mt-12"><NeedAnalyst /></div>
        </div>
      </section>

      {/* Recursive engine */}
      <section id="recursion" className="relative border-t border-flame-500/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">Recursive engine · 递归引擎</div>
          <h2 className="display mt-3 text-4xl text-ghost-50 md:text-5xl">
            <T v={{ en: "Run the engine, scale by scale", zh: "逐尺度地，运行这台引擎" }} />
          </h2>
          <p className="serif mt-6 max-w-3xl text-lg leading-relaxed text-ghost-200">
            <T v={{
              en: "The same move repeats from a cell climbing a gradient to a civilization choosing its own ends: hold a model of a required state, detect the gap between it and reality, and act until it closes. Watch need evolve across biology, emotion, social structure, economy, technology, AI attention, post-scarcity, and future consciousness. Let it run.",
              zh: "同一个动作，从一只沿梯度攀爬的细胞，一路重复到一个选择自身目的的文明：持有一个所需状态的模型，侦测它与现实之间的缺口，并行动直到缺口闭合。看着需求跨越生物、情绪、社会结构、经济、技术、AI 注意力、后稀缺与未来意识而演化。让它运行起来。",
            }} />
          </p>
          <div className="mt-12"><NeedRecursionSim /></div>
        </div>
      </section>

      {/* Closing */}
      <section className="relative border-t border-flame-500/8 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="serif text-4xl leading-snug text-ghost-50 md:text-6xl">
            <T v={{ en: "Need is not a thing a being has. It is the relation a being is — the standing gap between what it is and what it must reach toward to continue.", zh: "需求不是一个存在所「拥有」之物。它是一个存在所「是」之关系——它「是什么」与它「必须伸向什么才能延续」之间，那道恒在的缺口。" }} />
          </h2>
          <p className="serif mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-ghost-300">
            <T v={{
              en: "From a bacterium climbing toward sugar to a market clearing a price to a model pursuing a reward, the same logic runs: a system holds a target, senses the gap, and moves to close it. Human history may fundamentally be the endless transformation of that gap — of longing into structure, scarcity into systems, desire into civilization. We are not built to be satisfied; we are built to keep reaching. The question is no longer how to abolish need — a system without a gap is a system without motion — but how to choose, wisely and freely, which gaps are worth a life, and a civilization, spending themselves to close.",
              zh: "从一只朝糖攀爬的细菌，到一个出清价格的市场，再到一个追逐奖励的模型，同一种逻辑在运行：一个系统持有一个目标，感知缺口，并动身去闭合它。人类历史，归根结底，或许正是那道缺口无尽的转化——把渴望化为结构，把稀缺化为系统，把欲望化为文明。我们并非被造来满足的；我们被造来不断伸手。问题已不再是如何废除需求——一个没有缺口的系统，是一个没有运动的系统——而是如何明智而自由地选择：哪些缺口，值得一段生命、一个文明，倾尽自身去闭合。",
            }} />
          </p>
          <div className="mx-auto mt-10 max-w-xl rounded-lg border border-signal-500/25 bg-ink-900/60 p-5">
            <p className="text-xs leading-relaxed text-ghost-500">
              <T v={{
                en: "An educational synthesis of motivation neuroscience, behavioral economics, psychology, philosophy and the study of civilizations. Figures are order-of-magnitude; simulations are illustrative simplifications, not forecasts. It compares the great accounts of desire by their trade-offs, not by ideology, and states open questions as open.",
                zh: "一份融合动机神经科学、行为经济学、心理学、哲学与文明研究的教育性综述。文中数字为数量级估计；模拟为示意性的简化，而非预测。它以各自的权衡、而非意识形态来比较关于欲望的伟大论述，并把悬而未决的问题，如实陈述为悬而未决。",
              }} />
            </p>
          </div>
          <div className="mx-auto mt-12 h-px w-40 rule-neon" />
          <p className="mt-6 font-mono text-[0.6rem] uppercase tracking-[0.4em] text-signal-400/70">
            Need Engine · 需求引擎 · Psyverse · 2026
          </p>
        </div>
      </section>

      <footer className="border-t border-flame-500/12 bg-ink-950 px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <div className="display text-xl text-ghost-50">Need Engine</div>
            <div className="zh mt-1 text-sm text-ghost-300">需求引擎</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ghost-500">
              <T v={{ en: "The nature of needs, desire, motivation, consumption, and civilizational dynamics.", zh: "需求、欲望、动机、消费与文明动力学的本质。" }} />
            </p>
          </div>
          <div>
            <div className="label-mono">Systems · 系统</div>
            <ul className="mt-4 space-y-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-ghost-500">
              {SECTIONS.slice(0, 6).map((s) => (
                <li key={s.id}><a href={`#${s.id}`} className="hover:text-flame-400">{s.num} · <T v={s.title} /></a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="label-mono">Companion archives</div>
            <ul className="mt-4 space-y-1.5 text-sm text-ghost-300">
              <li><a href="https://wealth-engine.psyverse.fun" className="hover:text-flame-300">Wealth Engine · 财富引擎</a></li>
              <li><a href="https://happiness-engine.psyverse.fun" className="hover:text-flame-300">Happiness Engine · 幸福引擎</a></li>
              <li><a href="https://mission-engine.psyverse.fun" className="hover:text-flame-300">Mission Engine · 使命引擎</a></li>
              <li className="pt-3"><a href="https://psyverse.fun" className="text-signal-400 hover:text-flame-300">↩ All Psyverse archives</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 h-px max-w-7xl rule-neon" />
        <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between text-[0.58rem] uppercase tracking-[0.3em] text-ghost-500">
          <div>© 2026 Gewenbo · Psyverse</div>
          <div>EN · 中文 · educational</div>
        </div>
      </footer>
    </main>
  );
}

export default function NeedEngine() {
  return (
    <LangProvider>
      <Body />
    </LangProvider>
  );
}
