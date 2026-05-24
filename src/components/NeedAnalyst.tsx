"use client";

import { useMemo, useState } from "react";
import { T, useLang } from "./lang";
import {
  ANALYST_LENSES,
  ANALYST_TOPICS,
  type AnalystLens,
  type AnalystTopic,
} from "./content";

/** Lens lookup by key, built once at module level. */
const LENS_BY_KEY: Record<string, AnalystLens> = ANALYST_LENSES.reduce(
  (acc, l) => {
    acc[l.key] = l;
    return acc;
  },
  {} as Record<string, AnalystLens>
);

export default function NeedAnalyst() {
  const { lang } = useLang();
  const [topicKey, setTopicKey] = useState<string>(ANALYST_TOPICS[0].key);
  const [focusLens, setFocusLens] = useState<string | null>(null);

  const topic: AnalystTopic = useMemo(
    () => ANALYST_TOPICS.find((t) => t.key === topicKey) ?? ANALYST_TOPICS[0],
    [topicKey]
  );

  /** Lens keys actually present in this topic's views, preserving order. */
  const lensesInTopic = useMemo(() => {
    const seen = new Set<string>();
    const out: AnalystLens[] = [];
    for (const v of topic.views) {
      if (!seen.has(v.lens) && LENS_BY_KEY[v.lens]) {
        seen.add(v.lens);
        out.push(LENS_BY_KEY[v.lens]);
      }
    }
    return out;
  }, [topic]);

  /** Keys that answer this topic (for dimming the others in the master lens row). */
  const activeKeys = useMemo(
    () => new Set(topic.views.map((v) => v.lens)),
    [topic]
  );

  const visibleViews = useMemo(
    () =>
      focusLens ? topic.views.filter((v) => v.lens === focusLens) : topic.views,
    [topic, focusLens]
  );

  function askTopic(key: string) {
    setTopicKey(key);
    setFocusLens(null);
  }

  return (
    <div className="terminal rounded-2xl p-5 md:p-7">

      {/* ── TITLE BAR ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-b border-flame-500/15 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          {/* macOS-style dots */}
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-flame-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-ember-400/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-signal-400/50" />
          </span>
          <span className="label-mono tracking-[0.18em] text-flame-300">
            need.analyst //
          </span>
        </div>
        <span className="mono text-[0.62rem] tracking-[0.2em] text-ghost-500">
          <span className="pulse">●</span>{" "}
          {lang === "zh" ? "6 门学科在线" : "6 DISCIPLINES ONLINE"}
        </span>
      </div>

      {/* ── ALL-LENS ROW (dim those not in current topic) ──────────── */}
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5">
        {ANALYST_LENSES.map((l) => {
          const active = activeKeys.has(l.key);
          return (
            <span
              key={l.key}
              className="flex items-center gap-2 transition-opacity duration-300"
              style={{ opacity: active ? 1 : 0.28 }}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: l.accent,
                  boxShadow: active ? `0 0 7px ${l.accent}bb` : "none",
                }}
              />
              <span
                className="mono text-[0.68rem] tracking-wide"
                style={{ color: active ? l.accent : "#6b6453" }}
              >
                <T v={l.role} />
              </span>
            </span>
          );
        })}
      </div>

      {/* ── TOPIC QUESTION BUTTONS ─────────────────────────────────── */}
      <div className="mt-5">
        <p className="label-mono mb-2.5">
          <T v={{ en: "Ask the engine", zh: "向引擎提问" }} />
        </p>
        <div className="flex flex-col gap-2">
          {ANALYST_TOPICS.map((tp) => {
            const on = tp.key === topic.key;
            return (
              <button
                key={tp.key}
                onClick={() => askTopic(tp.key)}
                aria-pressed={on}
                className={`group flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-left transition ${
                  on
                    ? "border-flame-500/40 bg-ink-800"
                    : "border-ink-700 bg-ink-900/40 hover:border-ink-600"
                }`}
              >
                <span
                  className={`mono shrink-0 text-sm ${
                    on
                      ? "text-flame-400"
                      : "text-ghost-500 group-hover:text-flame-400/60"
                  }`}
                >
                  ›
                </span>
                <span
                  className={`text-sm leading-snug ${
                    on ? "text-ghost-50" : "text-ghost-300"
                  }`}
                >
                  <T v={tp.q} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── PROMPT LINE ────────────────────────────────────────────── */}
      <div className="mt-5 rounded-md border border-flame-500/20 bg-ink-950/70 px-3.5 py-3">
        <p className="mono flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="text-flame-500">need@engine:~$</span>
          <span className="text-ember-400">analyze</span>
          <span className="text-ghost-50">
            &quot;<T v={topic.q} />&quot;
          </span>
          <span className="caret text-flame-300">▍</span>
        </p>
      </div>

      {/* ── LENS FILTER ────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mono mr-1 text-[0.62rem] tracking-[0.18em] text-ghost-500">
          <T v={{ en: "LENS", zh: "视角" }} />
        </span>
        <button
          onClick={() => setFocusLens(null)}
          aria-pressed={focusLens === null}
          className={`mono rounded-full border px-2.5 py-1 text-[0.68rem] transition ${
            focusLens === null
              ? "border-flame-500/50 bg-flame-500/15 text-flame-300"
              : "border-ink-700 text-ghost-500 hover:border-ink-600 hover:text-ghost-300"
          }`}
        >
          <T v={{ en: "All", zh: "全部" }} />
        </button>
        {lensesInTopic.map((l) => {
          const on = focusLens === l.key;
          return (
            <button
              key={l.key}
              onClick={() => setFocusLens(on ? null : l.key)}
              aria-pressed={on}
              className="mono flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] transition"
              style={{
                borderColor: on ? l.accent : "rgba(107,100,83,0.35)",
                color: on ? l.accent : "#6b6453",
                backgroundColor: on ? `${l.accent}20` : "transparent",
              }}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: l.accent }}
              />
              <T v={l.role} />
            </button>
          );
        })}
      </div>

      {/* ── RESPONSE CARDS ─────────────────────────────────────────── */}
      <div className="mt-4 flex flex-col gap-3">
        {visibleViews.map((v, i) => {
          const lens = LENS_BY_KEY[v.lens];
          if (!lens) return null;
          return (
            <article
              key={`${topic.key}-${v.lens}-${i}`}
              className="rise-in rounded-md border-l-2 bg-ink-900/50 py-3.5 pl-4 pr-4"
              style={{
                borderLeftColor: lens.accent,
                animationDelay: `${i * 0.13}s`,
              }}
            >
              <header className="mb-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: lens.accent,
                      boxShadow: `0 0 7px ${lens.accent}bb`,
                    }}
                  />
                  <span
                    className={`display text-base ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: lens.accent }}
                  >
                    <T v={lens.role} />
                  </span>
                </span>
                <span className="mono text-[0.62rem] tracking-wide text-ghost-500">
                  <T v={lens.blurb} />
                </span>
              </header>
              <p className="max-w-2xl text-sm leading-relaxed text-ghost-200">
                <T v={v.text} />
              </p>
            </article>
          );
        })}
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <p className="mono mt-5 border-t border-flame-500/10 pt-3 text-[0.62rem] leading-relaxed text-ghost-500">
        <T
          v={{
            en: "// The engine reads needs by their trade-offs, not their slogans. Open questions are stated as open.",
            zh: "// 引擎以取舍阅读需求，而非口号。悬而未决的问题，照实陈述为悬而未决。",
          }}
        />
      </p>
    </div>
  );
}
