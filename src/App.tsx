import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/** 分析日志示例：足够多行以便在固定高度内随进度滚动 */
const ANALYSIS_STEPS = [
  { key: "thinking", text: "Thinking...", muted: true, small: true },
  { key: "scan", text: "Scanning course outline and prerequisites" },
  { key: "m1", text: "Analyzing course module 1 content" },
  { key: "objectives", text: "Identifying key learning objectives for your role" },
  { key: "benchmarks", text: "Mapping skills to industry-relevant benchmarks" },
  { key: "career", text: "Analyze career goal and skill level" },
  { key: "intro", text: "Removing intro course and simple tasks" },
  { key: "sequence", text: "Reordering modules to match your goal timeline" },
  { key: "m2", text: "Analyzing course module 2 content" },
  { key: "labs", text: "Drafting personalized hands-on lab scenarios" },
  { key: "reading", text: "Balancing reading load vs. applied exercises" },
  { key: "rubric", text: "Aligning assessments with your skill gaps" },
  { key: "assets", text: "Selecting supplemental datasets and templates" },
  { key: "checkpoints", text: "Preparing weekly checkpoints and recap prompts" },
  { key: "qa", text: "Running consistency checks across personalized units" },
] as const;

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="sparkleGrad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l1.2 4.2L17 7l-3.8 1.8L12 13l-1.2-4.2L7 7l3.8-1.8L12 2z"
        fill="url(#sparkleGrad)"
      />
      <path
        d="M19 11l.6 2.1L21 14l-2.1.9L19 17l-.6-2.1L16 14l2.1-.9L19 11z"
        fill="url(#sparkleGrad)"
        opacity={0.85}
      />
    </svg>
  );
}

function IconHelp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5c.3-1.5 2.2-2 3.5-1.2 1 .7 1.2 2.1.3 3-.4.4-.8.7-1 1.2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconGlobe({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3.2 2.5 14.8 0 18M12 3c-2.5 3.2-2.5 14.8 0 18" strokeLinecap="round" />
    </svg>
  );
}

function IconMic({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3z" strokeLinejoin="round" />
      <path d="M19 11a7 7 0 01-14 0M12 18v3" strokeLinecap="round" />
    </svg>
  );
}

function IconArrowUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M12 19V5M12 5l-6 6M12 5l6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Figma `navigation/SplitScreen` (27:37218) — 分栏 / 收起侧栏，非网格「#」 */
function IconNavigationSplitScreen({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden>
      <rect x="3.25" y="4" width="13.5" height="12" rx="1.75" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.25 4v12" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconPlusSquare({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  );
}

function IconGear({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path
        d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM19.4 15a1.7 1.7 0 00.4 1.8l.1.1a2 2 0 01-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.4 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.4l-.1.1a2 2 0 01-2.8-2.8l.1-.1a1.7 1.7 0 00.4-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.4-1.8l-.1-.1a2 2 0 012.8-2.8l.1.1a1.7 1.7 0 001.8.4h.1a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.4l.1-.1a2 2 0 012.8 2.8l-.1.1a1.7 1.7 0 00-.4 1.8 1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function IconChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPlusSmall({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function IconLightbulb({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 18a1 1 0 001-1v-1H11v1a1 1 0 001 1zm5-7a5 5 0 11-10 0c0 2 2 3 2 5h6c0-2 2-3 2-5z"
        fill="#EAB308"
        stroke="#CA8A04"
        strokeWidth="0.5"
      />
    </svg>
  );
}

/** Figma 43:9775 — plan card clock */
function IconClockOutline({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" strokeLinecap="round" />
    </svg>
  );
}

function IconPencilSmall({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Figma 43:9503 — XP row accent */
function IconXpAccent({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 3c.8 2 3 3.5 3 6.2a3 3 0 11-6 0C7 6.5 9.2 5 10 3z"
        fill="#c74504"
        fillOpacity={0.95}
      />
    </svg>
  );
}

const TIME_SAVED_ROWS = [
  {
    dot: "green" as const,
    text: "8 Introduction videos removed since you already have basic HTML & CSS knowledge",
    trailing: "chevron" as const,
  },
  {
    dot: "green" as const,
    text: "5 readings skipped",
    trailing: "chevron" as const,
  },
  {
    dot: "blue" as const,
    text: "2 practice added to help you apply it in real world",
    trailing: "chevron" as const,
  },
  {
    dot: "blue" as const,
    text: "Advanced JavaScript and Github technologies are listed as optional because it is not relevant to your goal",
    trailing: "plus" as const,
  },
];

export default function App() {
  const [progress, setProgress] = useState(0);
  const [composerFocused, setComposerFocused] = useState(false);
  /** After “Start my personalized learning journey” — hide that CTA and show Figma 43:9775 today’s plan block */
  const [personalizedJourneyStarted, setPersonalizedJourneyStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const analysisScrollRef = useRef<HTMLDivElement>(null);
  const mainContentScrollRef = useRef<HTMLDivElement>(null);

  const analysisComplete = progress >= 100;

  useEffect(() => {
    const start = performance.now();
    const duration = 4200;
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 2;
      setProgress(Math.round(eased * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  /** 进度增长时，分析日志在固定可视区内同步下滚 */
  useLayoutEffect(() => {
    if (analysisComplete) return;
    const el = analysisScrollRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
    el.scrollTop = maxScroll * (progress / 100);
  }, [progress, analysisComplete]);

  /** 主内容区始终滚到底部，保证最新生成的内容（靠近底部）可见 */
  useLayoutEffect(() => {
    const el = mainContentScrollRef.current;
    if (!el) return;
    const top = Math.max(0, el.scrollHeight - el.clientHeight);
    const smooth = analysisComplete || personalizedJourneyStarted;
    el.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  }, [progress, analysisComplete, personalizedJourneyStarted]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f2f5fa] font-sans text-[#0f1114]">
      <header className="z-10 flex shrink-0 items-center justify-between border-b border-transparent bg-[#f2f5fa] py-4 pl-4 pr-5">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-[#0056d2]">coursera</span>
          <span className="hidden h-5 w-px bg-slate-300 sm:block" aria-hidden />
          <span className="hidden items-baseline gap-0.5 text-lg font-semibold sm:flex" aria-label="Google">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </span>
        </div>
        <nav className="flex items-center gap-2 text-[#8b95a8]" aria-label="Utility">
          <button type="button" className="rounded-lg p-2 transition hover:bg-black/5 hover:text-[#5b6780]" aria-label="Help">
            <IconHelp className="h-6 w-6" />
          </button>
          <button type="button" className="rounded-lg p-2 transition hover:bg-black/5 hover:text-[#5b6780]" aria-label="Language">
            <IconGlobe className="h-6 w-6" />
          </button>
          <button type="button" className="rounded-lg p-2 transition hover:bg-black/5" aria-label="AI assistant">
            <SparkleIcon className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#002761] text-sm font-semibold text-white transition hover:brightness-110"
            aria-label="Account"
          >
            N
          </button>
        </nav>
      </header>

      {/* 中间：侧栏 + 主卡片（卡片内：上滚动区 + 底部固定对话框） */}
      <div className="flex min-h-0 flex-1 gap-4 pb-5 pl-4 pr-5">
          <aside className="flex w-10 shrink-0 flex-col items-center rounded-2xl bg-white py-3 shadow-sm md:w-[52px] md:py-4">
            <button
              type="button"
              className="rounded-lg p-2 text-[#5b6780] hover:bg-slate-100"
              aria-label="Toggle split view or sidebar"
            >
              <IconNavigationSplitScreen className="h-5 w-5" />
            </button>
          </aside>

          <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
              <div
                role="region"
                aria-label="Coach chat"
                className="flex shrink-0 items-center justify-end border-b border-slate-100 px-4 py-3 md:px-5"
              >
                <div className="flex items-center gap-1">
                  <button type="button" className="rounded-lg p-2 text-[#5b6780] hover:bg-slate-100" aria-label="New chat">
                    <IconPlusSquare className="h-5 w-5" />
                  </button>
                  <button type="button" className="rounded-lg p-2 text-[#5b6780] hover:bg-slate-100" aria-label="Settings">
                    <IconGear className="h-5 w-5" />
                  </button>
                  <button type="button" className="rounded-lg p-2 text-[#5b6780] hover:bg-slate-100" aria-label="Close">
                    <IconClose className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                <div
                  ref={mainContentScrollRef}
                  className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-8 md:px-10 lg:px-16"
                >
                  <div className="mx-auto w-full max-w-[749px] space-y-7">
                <div className="space-y-4">
                  <h1 className="text-[28px] font-semibold leading-9 tracking-tight text-black">
                    Hi June!
                    <br />
                    Welcome to Generative AI Content Creation course!
                  </h1>
                  <div className="space-y-3 text-base leading-6 text-[#1e2229]">
                    <p>Based on what we know about you, we can already personalize the content of this course.</p>
                    <p>
                      Personalizing the content will still ensure that you meet the skill targets of the course, while
                      making it more effective to your specific role and any skills you already have
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <article className="rounded-lg bg-[#f0f8ff] p-3 transition hover:bg-[#e6f2ff] hover:shadow-md">
                    <div className="min-w-0 space-y-0.5">
                      <h2 className="text-base font-semibold tracking-wide text-[#0f1114]">Relevant skills</h2>
                      <p className="text-sm leading-5 text-[#0f1114]">ChatGPT, Data Sets</p>
                    </div>
                  </article>
                  <article className="rounded-lg bg-[#f0f8ff] p-3 transition hover:bg-[#e6f2ff] hover:shadow-md">
                    <div className="min-w-0 space-y-0.5">
                      <h2 className="text-base font-semibold tracking-wide text-[#0f1114]">Your goal</h2>
                      <p className="text-sm leading-5 text-[#0f1114]">
                        Leverage Generative AI in my product manager role and focus on Claude Code &amp; Cursor vibe
                        coding tools
                      </p>
                    </div>
                  </article>
                </div>

                {!analysisComplete ? (
                  <section className="space-y-3.5" aria-live="polite" aria-busy={progress < 100}>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-6 text-[#101828]">
                        Analyzing course {progress}%
                      </p>
                      <div className="mt-2 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-[#7c69ef] transition-[width] duration-300 ease-out"
                          style={{ width: `${Math.min(100, progress)}%` }}
                        />
                      </div>
                      <div
                        ref={analysisScrollRef}
                        className="mt-4 max-h-[132px] overflow-y-auto overflow-x-hidden scroll-smooth pr-1 [scrollbar-width:thin]"
                        aria-label="Analysis progress log"
                      >
                        <ul className="space-y-1.5">
                          {ANALYSIS_STEPS.map((item) => (
                            <li
                              key={item.key}
                              className={
                                "muted" in item && item.muted ? "text-[#9ca3af]" : "text-[#1f1f1f]"
                              }
                            >
                              <span
                                className={
                                  "small" in item && item.small ? "text-xs leading-[18px]" : "text-sm leading-5"
                                }
                              >
                                {item.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>
                ) : (
                  <section className="animate-fade-in space-y-4" aria-label="Personalization result">
                    <p className="text-base leading-6 text-[#1e2229]">
                      We have analyzed the course content and personalized the course for you.
                    </p>
                    <div className="rounded-[14px] border border-[#dbeafe] bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 space-y-2">
                          <p className="text-[12px] font-medium uppercase tracking-wide text-[#6a7282]">
                            Learning time saved
                          </p>
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="text-[30px] font-bold leading-9 tracking-tight text-[#101828]">58</span>
                            <span className="text-sm leading-5 text-[#4a5565]">minutes</span>
                          </div>
                        </div>
                        <IconLightbulb className="h-8 w-8 shrink-0" />
                      </div>
                      <ul className="mt-6 space-y-4 border-t border-slate-100 pt-5">
                        {TIME_SAVED_ROWS.map((row, i) => (
                          <li key={i} className="flex gap-3">
                            <span
                              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                row.dot === "green" ? "bg-emerald-500" : "bg-[#0056d2]"
                              }`}
                              aria-hidden
                            />
                            <p className="min-w-0 flex-1 text-sm leading-5 text-[#1e2229]">{row.text}</p>
                            <span className="shrink-0 text-[#9ca3af]">
                              {row.trailing === "chevron" ? (
                                <IconChevronRight className="h-5 w-5" />
                              ) : (
                                <IconPlusSmall className="h-5 w-5" />
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {!personalizedJourneyStarted ? (
                        <button
                          type="button"
                          onClick={() => setPersonalizedJourneyStarted(true)}
                          className="mt-6 w-full rounded-lg bg-[#0056d2] px-8 py-3 text-center text-sm font-semibold leading-6 text-white transition hover:bg-[#0046b0]"
                        >
                          Start my personalized learning journey
                        </button>
                      ) : null}
                    </div>

                    {personalizedJourneyStarted ? (
                      <div
                        className="animate-fade-in space-y-4 pt-2"
                        aria-live="polite"
                        aria-label="Today’s plan from Coach"
                      >
                        <h2 className="text-[28px] font-semibold leading-9 tracking-tight text-black">
                          Greetings! Here is today&apos;s plan
                        </h2>
                        <div className="overflow-hidden rounded-2xl border border-[#dae1ed] bg-white p-5 shadow-sm md:p-6">
                          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
                            <div className="min-w-0 flex-1 space-y-2">
                              <p className="text-xs font-normal leading-4 text-[#5b6780]">Skills you will learn</p>
                              <p className="text-sm font-medium leading-5 tracking-tight text-[#0f1114]">
                                Prompt engineering basics
                              </p>
                              <p className="text-sm font-normal leading-5 text-[#0f1114]">
                                Based on your recent work, it seems that you are less comfortable working with large
                                data sets. It might help you to spend a bit of time learning this core skill before
                                continuing in your path.
                              </p>
                            </div>
                            <div className="w-full shrink-0 rounded-lg border border-[#dae1ed] bg-white p-4 lg:w-[224px]">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-base font-semibold leading-5 tracking-tight text-black">
                                  Today&apos;s plan
                                </p>
                                <button
                                  type="button"
                                  className="shrink-0 rounded-md p-1 text-[#5b6780] hover:bg-slate-100"
                                  aria-label="Edit today’s plan"
                                >
                                  <IconPencilSmall className="h-5 w-5" />
                                </button>
                              </div>
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-2 text-base font-normal leading-6 text-[#0f1114]">
                                  <IconClockOutline className="h-5 w-5 shrink-0 text-[#5b6780]" />
                                  <span>60min session</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <IconXpAccent className="h-5 w-5 shrink-0" />
                                  <span className="text-base font-semibold leading-5 tracking-tight text-[#c74504]">
                                    120 XP
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                              to="/learn"
                              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#0056d2] px-5 text-base font-semibold text-white transition hover:bg-[#0046b0]"
                            >
                              Start today&apos;s session
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </section>
                )}
                  </div>
                </div>

                {/* 卡片内底栏：不随上方内容滚动；距卡片下缘 16px = pb-4 */}
                <div className="shrink-0 bg-white px-4 pt-3 pb-4 md:px-10 lg:px-16">
                  <div className="mx-auto w-full max-w-[749px] space-y-3">
                    {analysisComplete ? (
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-[#0f1114] shadow-sm transition hover:bg-slate-50"
                        >
                          <span aria-hidden>📓</span>
                          Take a 2-min skill check
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-[#0f1114] shadow-sm transition hover:bg-slate-50"
                        >
                          Use standard curriculum
                        </button>
                      </div>
                    ) : null}
                    <div
                      role="textbox"
                      tabIndex={0}
                      onClick={() => inputRef.current?.focus()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") inputRef.current?.focus();
                      }}
                      className={`rounded-lg bg-[#f2f5fa] p-2 transition ${
                        composerFocused ? "ring-2 ring-[#0056d2] ring-offset-2" : "hover:bg-[#edf1f7]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-[#5b6780] hover:bg-white/80"
                          aria-label="Voice input"
                        >
                          <IconMic className="h-5 w-5" />
                        </button>
                        <input
                          ref={inputRef}
                          type="text"
                          placeholder="Message Coach"
                          className="min-w-0 flex-1 bg-transparent py-2 text-base text-[#0f1114] placeholder:text-[#5b6780] outline-none"
                          onFocus={() => setComposerFocused(true)}
                          onBlur={() => setComposerFocused(false)}
                          aria-label="Chat message"
                        />
                        <button
                          type="button"
                          className="rounded-lg bg-[#0056d2] p-2 text-white transition hover:bg-[#0046b0] active:bg-[#003d99]"
                          aria-label="Send"
                        >
                          <IconArrowUp className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-center text-sm leading-5 text-[#404b61]">
                      This feature is powered by AI, so check for mistakes and don&apos;t share sensitive information.{" "}
                      <a
                        href="#learn-more"
                        className="underline decoration-[#404b61] underline-offset-2 transition hover:text-[#0056d2]"
                      >
                        Learn More
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
    </div>
  );
}
