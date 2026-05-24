"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { T, useLang } from "./lang";
import { LIFE_FORMS, PRIMAL_DRIVES } from "./content";

/* ─── types ─────────────────────────────────────────── */
type FormIdx = number; // 0–5 index into LIFE_FORMS

/* ─── helpers ───────────────────────────────────────── */
function prevHas(formIdx: FormIdx): Set<string> {
  if (formIdx === 0) return new Set<string>();
  return new Set(LIFE_FORMS[formIdx - 1].has);
}

/* ─── small sub-components ──────────────────────────── */

/** Glowing cell in the matrix */
function DriveCell({
  lit,
  accent,
  isNew,
  isRowActive,
}: {
  lit: boolean;
  accent: string;
  isNew: boolean;
  isRowActive: boolean;
}) {
  const base =
    "w-full h-full rounded-md flex items-center justify-center transition-all duration-500";

  if (!lit) {
    return (
      <div
        className={`${base} border border-ghost-500/10 bg-ink-900/60`}
        aria-hidden="true"
      >
        <span className="block h-1.5 w-1.5 rounded-full bg-ghost-500/20" />
      </div>
    );
  }

  return (
    <div
      className={`${base} ${isNew ? "pulse crave-beat" : ""}`}
      style={{
        background: `${accent}18`,
        border: `1px solid ${accent}55`,
        boxShadow: isRowActive
          ? `0 0 14px ${accent}66, inset 0 0 8px ${accent}22`
          : isNew
          ? `0 0 10px ${accent}55`
          : `0 0 6px ${accent}33`,
      }}
      aria-hidden="true"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="4" fill={accent} opacity={isNew ? 0.95 : 0.7} />
        {isNew && (
          <circle
            cx="7"
            cy="7"
            r="6"
            stroke={accent}
            strokeWidth="1"
            opacity="0.4"
          />
        )}
      </svg>
    </div>
  );
}

/** Column header with hover-tooltip for drive gloss */
function DriveHeader({ drive }: { drive: (typeof PRIMAL_DRIVES)[number] }) {
  const { lang } = useLang();
  const [hover, setHover] = useState(false);

  return (
    <th
      className="relative select-none px-1 pb-3 pt-1"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex flex-col items-center gap-1.5">
        {/* color dot */}
        <span
          className="block h-2 w-2 rounded-full transition-all duration-300"
          style={{
            background: drive.accent,
            boxShadow: hover ? `0 0 8px ${drive.accent}` : "none",
          }}
        />
        {/* label */}
        <span
          className={`label-mono block text-center text-[0.6rem] leading-tight transition-colors duration-200 ${lang === "zh" ? "zh" : ""}`}
          style={{ color: hover ? drive.accent : `${drive.accent}bb` }}
        >
          {drive.name[lang]}
        </span>
      </div>

      {/* hover gloss tooltip */}
      {hover && (
        <div
          className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-36 -translate-x-1/2 rounded-lg border bg-ink-900 px-3 py-2 text-center text-[0.65rem] leading-snug text-ghost-300 shadow-xl"
          style={{ borderColor: `${drive.accent}44` }}
        >
          {drive.gloss[lang]}
        </div>
      )}
    </th>
  );
}

/* ─── main component ─────────────────────────────────── */
export default function DriveEmergence() {
  const { lang } = useLang();

  /* index of the currently-visible "top" form (0 = bacterium only, 5 = all) */
  const [current, setCurrent] = useState<FormIdx>(0);
  /* which form is highlighted/selected */
  const [selected, setSelected] = useState<FormIdx>(0);
  /* whether the auto-play is running */
  const [playing, setPlaying] = useState(false);
  /* track which drives were newly added on the last step */
  const [newDrives, setNewDrives] = useState<Set<string>>(
    new Set(LIFE_FORMS[0].has)
  );

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* advance by one step */
  const step = useCallback(() => {
    setCurrent((prev) => {
      const next = Math.min(prev + 1, LIFE_FORMS.length - 1);
      setSelected(next);
      // drives newly present at this level
      const prevSet = prevHas(next);
      const gained = new Set(
        LIFE_FORMS[next].has.filter((k) => !prevSet.has(k))
      );
      setNewDrives(gained);
      return next;
    });
  }, []);

  /* auto-clear pulse after 1.4 s */
  useEffect(() => {
    if (newDrives.size === 0) return;
    const t = setTimeout(() => setNewDrives(new Set()), 1400);
    return () => clearTimeout(t);
  }, [newDrives]);

  /* play / pause */
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => {
          const next = prev + 1;
          if (next >= LIFE_FORMS.length) {
            setPlaying(false);
            return prev;
          }
          setSelected(next);
          const prevSet = prevHas(next);
          const gained = new Set(
            LIFE_FORMS[next].has.filter((k) => !prevSet.has(k))
          );
          setNewDrives(gained);
          return next;
        });
      }, 1100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  /* reset */
  const reset = () => {
    setPlaying(false);
    setCurrent(0);
    setSelected(0);
    setNewDrives(new Set(LIFE_FORMS[0].has));
  };

  const canStep = current < LIFE_FORMS.length - 1;
  const atEnd = current === LIFE_FORMS.length - 1;

  const selectedForm = LIFE_FORMS[selected];

  /* bilingual strings */
  const UI = {
    kicker: { en: "drive emergence", zh: "驱力的涌现" },
    title: { en: "Ladder of Life", zh: "生命之梯" },
    caption: {
      en: "Needs are not invented all at once — they accumulate as life grows complex, and reappear, synthesized, in AI.",
      zh: "需求并非一次性被发明——它们随生命日益复杂而累积，并以合成的姿态，重现于人工智能之中。",
    },
    play: { en: "Play", zh: "播放" },
    pause: { en: "Pause", zh: "暂停" },
    stepBtn: { en: "Step", zh: "步进" },
    reset: { en: "Reset", zh: "重置" },
    aiTag: {
      en: "Need-shaped structure — no biology",
      zh: "需求形状的结构——无生物学",
    },
    era: { en: "Era", zh: "纪元" },
    drives: { en: "Drives", zh: "驱力" },
  };

  return (
    <div className="holo rounded-2xl p-5 md:p-7">
      {/* ── header ── */}
      <div className="mb-6">
        <p className="label-mono mb-2 text-ember-400">
          {UI.kicker[lang]}
        </p>
        <h3 className="display text-2xl text-ghost-50 md:text-3xl">
          <T v={UI.title} />
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ghost-300">
          <T v={UI.caption} />
        </p>
      </div>

      <div className="mb-6 h-px rule-neon opacity-50" />

      {/* ── matrix (scrollable on small screens) ── */}
      <div className="overflow-x-auto pb-1">
        <table
          className="w-full min-w-[520px] border-collapse"
          role="grid"
          aria-label={lang === "zh" ? "驱力涌现矩阵" : "Drive emergence matrix"}
        >
          {/* column headers = drives */}
          <thead>
            <tr>
              {/* row-label spacer */}
              <th className="w-36 pr-4 pb-3" aria-label=" " />
              {PRIMAL_DRIVES.map((d) => (
                <DriveHeader key={d.key} drive={d} />
              ))}
            </tr>
          </thead>

          <tbody>
            {LIFE_FORMS.map((form, fi) => {
              const visible = fi <= current;
              const isActive = fi === selected;
              const isAI = form.key === "ai";
              const prevSet = prevHas(fi);

              return (
                <tr
                  key={form.key}
                  onClick={() => {
                    if (!visible) return;
                    setSelected(fi);
                  }}
                  className={[
                    "group cursor-pointer transition-all duration-300",
                    visible ? "opacity-100" : "opacity-20 pointer-events-none",
                    isActive
                      ? "bg-ink-800/60 rounded-lg"
                      : "hover:bg-ink-800/30",
                  ].join(" ")}
                  aria-selected={isActive}
                  role="row"
                >
                  {/* life form label */}
                  <td className="py-2 pr-4 align-middle">
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-semibold leading-tight transition-colors duration-200 ${isAI ? "" : ""} ${lang === "zh" ? "zh" : "display"}`}
                        style={{
                          color: isActive ? "#f5f0e8" : "#9ca3af",
                        }}
                      >
                        {form.name[lang]}
                      </span>
                      <span className="label-mono mt-0.5 text-[0.58rem] text-ghost-500">
                        {form.era[lang]}
                      </span>
                      {isAI && (
                        <span
                          className="mt-1 inline-block rounded px-1.5 py-0.5 text-[0.55rem] font-mono leading-tight"
                          style={{
                            background: "#a855f722",
                            border: "1px solid #a855f744",
                            color: "#c084fc",
                          }}
                        >
                          {UI.aiTag[lang]}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* drive cells */}
                  {PRIMAL_DRIVES.map((drive) => {
                    const lit = form.has.includes(drive.key);
                    const isNew = visible && newDrives.has(drive.key) && !prevSet.has(drive.key) && fi === current;
                    return (
                      <td
                        key={drive.key}
                        className="px-1 py-2 align-middle"
                        style={{ width: "12%" }}
                      >
                        <div className="mx-auto h-9 w-full max-w-[44px]">
                          <DriveCell
                            lit={lit}
                            accent={drive.accent}
                            isNew={isNew}
                            isRowActive={isActive}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── controls ── */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {/* play / pause */}
        <button
          onClick={() => {
            if (atEnd) { reset(); return; }
            setPlaying((p) => !p);
          }}
          className="flex items-center gap-2 rounded-lg border border-ember-500/40 bg-ember-500/10 px-4 py-2 text-sm font-mono text-ember-300 transition hover:bg-ember-500/20 hover:border-ember-500/70 active:scale-95"
        >
          {atEnd ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2 L12 7 L2 12 Z" fill="currentColor" opacity="0.4" />
                <path d="M2 2 L2 12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              {UI.reset[lang]}
            </>
          ) : playing ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="3" y="2" width="3" height="10" rx="1" fill="currentColor" />
                <rect x="8" y="2" width="3" height="10" rx="1" fill="currentColor" />
              </svg>
              {UI.pause[lang]}
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 2 L12 7 L3 12 Z" fill="currentColor" />
              </svg>
              {UI.play[lang]}
            </>
          )}
        </button>

        {/* step */}
        <button
          onClick={step}
          disabled={!canStep || playing}
          className="flex items-center gap-2 rounded-lg border border-ghost-500/30 bg-ink-800 px-4 py-2 text-sm font-mono text-ghost-300 transition hover:border-ghost-500/60 hover:text-ghost-100 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 3 L9 7 L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10" y1="3" x2="10" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {UI.stepBtn[lang]}
        </button>

        {/* reset */}
        {(current > 0) && (
          <button
            onClick={reset}
            className="rounded-lg border border-ghost-500/20 bg-ink-900 px-3 py-2 text-xs font-mono text-ghost-500 transition hover:text-ghost-300 hover:border-ghost-500/40 active:scale-95"
          >
            {UI.reset[lang]}
          </button>
        )}

        {/* progress dots */}
        <div className="ml-auto flex items-center gap-1.5" aria-hidden="true">
          {LIFE_FORMS.map((f, fi) => (
            <button
              key={f.key}
              onClick={() => {
                if (fi <= current) setSelected(fi);
              }}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: fi === selected ? "1.5rem" : "0.5rem",
                background: fi <= current
                  ? fi === selected
                    ? "#ff9d3c"
                    : "#ff9d3c88"
                  : "#374151",
              }}
              aria-label={f.name[lang]}
            />
          ))}
        </div>
      </div>

      {/* ── selected form detail strip ── */}
      <div
        className="mt-5 overflow-hidden rounded-xl border transition-all duration-500"
        style={{
          borderColor: selectedForm.key === "ai" ? "#a855f744" : "#ff9d3c33",
          background: selectedForm.key === "ai" ? "#a855f70d" : "#ff9d3c0a",
        }}
      >
        <div className="flex flex-wrap items-start gap-x-6 gap-y-3 p-4 md:p-5">
          {/* name + era */}
          <div className="min-w-[120px]">
            <p
              className={`text-base font-semibold leading-tight text-ghost-50 ${lang === "zh" ? "zh" : "display"}`}
            >
              <T v={selectedForm.name} />
            </p>
            <p className="label-mono mt-1 text-ghost-500">
              <T v={selectedForm.era} />
            </p>
          </div>

          {/* active drive chips */}
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {PRIMAL_DRIVES.map((d) => {
              const active = selectedForm.has.includes(d.key);
              return (
                <span
                  key={d.key}
                  className={`rounded-md px-2 py-0.5 text-[0.65rem] font-mono transition-all duration-300 ${lang === "zh" ? "zh" : ""}`}
                  style={
                    active
                      ? {
                          background: `${d.accent}20`,
                          border: `1px solid ${d.accent}55`,
                          color: d.accent,
                        }
                      : {
                          background: "transparent",
                          border: "1px solid #374151",
                          color: "#4b5563",
                        }
                  }
                >
                  {d.name[lang]}
                </span>
              );
            })}
          </div>
        </div>

        {/* gloss */}
        <div className="border-t border-ghost-500/10 px-4 py-3 md:px-5">
          <p className={`text-sm leading-relaxed text-ghost-300 ${lang === "zh" ? "zh" : ""}`}>
            <T v={selectedForm.gloss} />
          </p>
        </div>
      </div>
    </div>
  );
}
