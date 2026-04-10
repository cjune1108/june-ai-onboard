import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SIDEBAR_COURSE_PROGRESS_LINK } from "./strings/learningSidebar";

/** Figma MCP asset — 视频缩略；若失效可换本地图 */
const VIDEO_POSTER =
  "https://www.figma.com/api/mcp/asset/4b38c5e4-3751-480d-bf3f-aae0f9593f56";

function SparkleIcon({ className }: { className?: string }) {
  const gid = useId().replace(/:/g, "");
  /** Shift path so visual centroid sits at viewBox center — spin reads as rotating on itself (Material-style). */
  const starDy = 12 - (2 + 6.2 + 7 + 8.8 + 13 + 8.8 + 7 + 6.2) / 8;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id={`lg-sp-${gid}`} x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <g transform={`translate(0 ${starDy})`}>
        <path d="M12 2l1.2 4.2L17 7l-3.8 1.8L12 13l-1.2-4.2L7 7l3.8-1.8L12 2z" fill={`url(#lg-sp-${gid})`} />
      </g>
    </svg>
  );
}

function IconHelp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5c.3-1.5 2.2-2 3.5-1.2 1 .7 1.2 2.1.3 3-.4.4-.8.7-1 1.2" strokeLinecap="round" />
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

function IconPencil({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCollapse({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden>
      <rect x="3.25" y="4" width="13.5" height="12" rx="1.75" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.25 4v12" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconLaptop({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M2 18h20" strokeLinecap="round" />
    </svg>
  );
}

/** Figma node 19:25386 — video glyph + #eff6ff circular container */
function IconVideo({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[#4A5565] ${className ?? ""}`}
      aria-hidden
    >
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
        <path
          d="M13.333 10.8324L17.6855 13.7341C17.7483 13.7758 17.8211 13.7998 17.8964 13.8034C17.9717 13.807 18.0466 13.7901 18.113 13.7545C18.1795 13.719 18.235 13.666 18.2737 13.6014C18.3125 13.5367 18.333 13.4628 18.333 13.3874V6.55741C18.333 6.4841 18.3137 6.41208 18.277 6.34862C18.2403 6.28516 18.1875 6.23252 18.1239 6.196C18.0603 6.15948 17.9882 6.14038 17.9149 6.14063C17.8416 6.14088 17.7697 6.16046 17.7063 6.19742L13.333 8.74908"
          stroke="currentColor"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.667 5H3.33366C2.41318 5 1.66699 5.74619 1.66699 6.66667V13.3333C1.66699 14.2538 2.41318 15 3.33366 15H11.667C12.5875 15 13.3337 14.2538 13.3337 13.3333V6.66667C13.3337 5.74619 12.5875 5 11.667 5Z"
          stroke="currentColor"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** Figma node 32:4442 — composite layers (`public/figma-challenge/`) */
function IconChallengeList({ className }: { className?: string }) {
  const base = `${import.meta.env.BASE_URL}figma-challenge`;
  const img = "pointer-events-none absolute max-w-none select-none";
  return (
    <span
      className={`relative isolate inline-block h-5 w-5 shrink-0 overflow-hidden rounded-[8px] bg-[#ffeac9] ${className ?? ""}`}
      aria-hidden
    >
      <span className="absolute left-0 top-0 block h-[42px] w-[42px] origin-top-left scale-[calc(20/42)]">
        {/* stack bottom → top */}
        <img src={`${base}/v6.svg`} alt="" className={`${img} left-0 top-0 h-[37.957px] w-[39.412px]`} />
        <img src={`${base}/v5.svg`} alt="" className={`${img} left-[9.75px] top-[25.2px] h-[12.76px] w-[20.99px]`} />
        <img src={`${base}/v4.svg`} alt="" className={`${img} left-[6.96px] top-[23.5px] h-[16.15px] w-[26.574px]`} />
        <img src={`${base}/v1.svg`} alt="" className={`${img} left-[6.96px] top-[31.58px] h-[10.64px] w-[26.577px]`} />
        <img src={`${base}/v7.svg`} alt="" className={`${img} left-[12.35px] top-[12.29px] h-[19.489px] w-[15.413px]`} />
        <img src={`${base}/v8.svg`} alt="" className={`${img} left-[17.7px] top-[12.29px] h-[13.328px] w-[11.932px]`} />
      </span>
    </span>
  );
}

function IconTranscript({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 6h16M4 10h12M4 14h16M4 18h10" strokeLinecap="round" />
    </svg>
  );
}

function IconNote({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M8 4h10a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 012-2z" strokeLinejoin="round" />
    </svg>
  );
}

function IconFiles({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M6 6h7l3 3v11a1 1 0 01-1 1H6a1 1 0 01-1-1V7a1 1 0 011-1z" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h4" strokeLinecap="round" />
    </svg>
  );
}

function IconPractice({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M6.5 6.5l11 11M8 4l2 4M14 16l2 4M4 8l4 2M16 14l4 2" strokeLinecap="round" />
    </svg>
  );
}

type OutlineItem = {
  id: string;
  icon: "laptop" | "video" | "challenge" | "reading";
  title: string;
  meta: string;
  selected: boolean;
  badge?: string;
};

const INITIAL_OUTLINE_ITEMS: OutlineItem[] = [
  {
    id: "1",
    icon: "video",
    title: "Working with large data sets",
    meta: "Video • 15min",
    selected: true,
  },
  {
    id: "2",
    icon: "video",
    title: "Why good prompts matter",
    meta: "Video • 4min",
    selected: false,
  },
  {
    id: "3",
    icon: "video",
    title: "Roles, Context & Framing",
    meta: "Video • 4min",
    selected: false,
  },
  {
    id: "4",
    icon: "video",
    title: "Few-shot example formatting",
    meta: "Video • 4min",
    selected: false,
  },
  {
    id: "5",
    icon: "challenge",
    title: "Iteration & Debugging Prompts",
    meta: "Practice • 15min",
    selected: false,
  },
];

/** Appended when user taps Continue Learning on session personalization complete (~30 min total; last = practice). */
const POST_CONTINUE_LEARNING_OUTLINE: OutlineItem[] = [
  {
    id: "post-sess-1",
    icon: "reading",
    title: "Semantic HTML structure and accessibility basics",
    meta: "Reading • 12min",
    selected: false,
  },
  {
    id: "post-sess-2",
    icon: "video",
    title: "Links, anchors, and internal navigation",
    meta: "Video • 8min",
    selected: false,
  },
  {
    id: "post-sess-3",
    icon: "challenge",
    title: "Mini-project: build a page with headings and links",
    meta: "Practice • 10min",
    selected: false,
  },
];

/** Practice complete — Add to my learning plan (sidebar outline) */
const AI_SUGGESTED_PLAN_ITEM_ID = "ai-suggested-db-python";
const AI_SUGGESTED_PLAN_ITEM: OutlineItem = {
  id: AI_SUGGESTED_PLAN_ITEM_ID,
  icon: "video",
  title: "Accessing Databases with Python",
  meta: "Video • 4m",
  selected: false,
  badge: "AI suggested materials",
};

/** Lab / practice flow: selected row is a practice item with no other practice below it (so adding a video after it still keeps this view). */
function isSelectedLastChallengeInOutline(items: OutlineItem[], selectedId: string | undefined): boolean {
  if (!selectedId) return false;
  const idx = items.findIndex((o) => o.id === selectedId);
  if (idx === -1) return false;
  if (items[idx].icon !== "challenge") return false;
  for (let i = idx + 1; i < items.length; i++) {
    if (items[i].icon === "challenge") return false;
  }
  return true;
}

/** Figma node 8:14049 — post-personalization plan */
const GENERATED_OUTLINE_ITEMS: OutlineItem[] = [
  { id: "g1", icon: "reading", title: "CSS box model", meta: "Reading · 8 min", selected: true },
  { id: "g2", icon: "video", title: "Connect images via CSS", meta: "Video · 6 min", selected: false },
  { id: "g3", icon: "reading", title: "The beauty of visualizing via CSS", meta: "Reading · 8 min", selected: false },
  { id: "g4", icon: "video", title: "A recipe for a powerful visualization", meta: "Video · 5 min", selected: false },
  { id: "g5", icon: "challenge", title: "CSS button", meta: "Practice · 8 min", selected: false },
];

function IconReading({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 006.5 17H20" strokeLinecap="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeLinejoin="round" />
      <path d="M8 7h8M8 11h5" strokeLinecap="round" />
    </svg>
  );
}

function OutlineIcon({ type }: { type: OutlineItem["icon"] }) {
  const c = "h-5 w-5 shrink-0 text-[#5b6780]";
  if (type === "laptop") return <IconLaptop className={c} />;
  if (type === "video") return <IconVideo />;
  if (type === "reading") return <IconReading className={c} />;
  return <IconChallengeList className={c} />;
}

/** Figma 33:5228 — lab exercise (XP chip gem + hero art) */
const LAB_EXERCISE_XP_GEM = "https://www.figma.com/api/mcp/asset/702b7fa0-26ea-484e-a7cc-d13dc935828e";
const LAB_EXERCISE_ILLUSTRATION =
  "https://www.figma.com/api/mcp/asset/669a6f61-2dd4-4282-a0b3-4aa139f4bcee";

function IconLabTrophy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M4 3h8v1.2c0 1.9-1.2 3.5-3 4.1V9H7V8.3c-1.8-.6-3-2.2-3-4.1V3z"
        stroke="#b45309"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M5.5 9h5v1.5H5.5V9z" fill="#f59e0b" />
      <path d="M6 12.5h4v1H6v-1z" fill="#b45309" />
    </svg>
  );
}

function IconLabHonors({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="#6366f1" strokeWidth="1.2" />
      <path d="M8 4.8v2.4M8 11.2V8.8M5.2 8h5.6" stroke="#6366f1" strokeWidth="1" strokeLinecap="round" opacity={0.35} />
      <path d="M5.5 8.2l2 2 3.2-3.5" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconClockOutline({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="10" cy="10" r="7.25" stroke="#5b6780" strokeWidth="1.4" />
      <path d="M10 6.2V10l2.8 1.6" stroke="#5b6780" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTimerOutline({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="10" cy="10" r="7.25" stroke="#5b6780" strokeWidth="1.4" />
      <path d="M10 5.5v5l3 1.75" stroke="#5b6780" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 3.5h5" stroke="#5b6780" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/** Figma 33:6302 — practice complete (after Launch) */
const PRACTICE_COMPLETE_XP_ICON = "https://www.figma.com/api/mcp/asset/21f8219a-44ec-4937-8f2d-2757d53792cb";
const PRACTICE_COMPLETE_ILLUSTRATION =
  "https://www.figma.com/api/mcp/asset/24922ad7-e4b9-4103-9c7c-60ba14e1483f";
const PRACTICE_COMPLETE_ARROW_ICON = "https://www.figma.com/api/mcp/asset/58ed928d-6cb2-4cbd-ac68-71d04e779c9a";
const PRACTICE_RECOMMEND_THUMB =
  "https://www.figma.com/api/mcp/asset/d1e75ca7-6f31-44cc-a2c3-761a882ec25f";

function IconListCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M3.5 8.2l2.8 2.8L12.5 4"
        stroke="#0f1114"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PracticeCompletePanel({
  onFinishSession,
  onExtendSession,
  onAddToLearningPlan,
  suggestedPlanAdded,
}: {
  onFinishSession: () => void;
  onExtendSession: () => void;
  onAddToLearningPlan: () => void;
  suggestedPlanAdded: boolean;
}) {
  const strengths = [
    "Describe upstream & downstream roles in data pipeline",
    "Distinguish correlation & causation",
  ] as const;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="shrink-0 px-[20px] pt-[20px]">
        <div className="flex w-full shrink-0 flex-col gap-8 rounded-lg bg-[#f0f6ff] px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-12 lg:px-10 lg:py-14">
          <div className="min-w-0 flex-1">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#0f1114] md:text-[40px] md:leading-[48px] md:tracking-[-0.025em]">
              Practice complete!
            </h2>
            <div className="mt-4 flex items-center gap-2">
              <img src={PRACTICE_COMPLETE_XP_ICON} alt="" className="h-6 w-6 object-contain" width={24} height={24} />
              <span className="text-xl font-semibold leading-6 tracking-tight text-[#c74504]">+ 30XP</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onFinishSession}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0056d2] px-5 text-base font-semibold text-white shadow-sm hover:brightness-110"
              >
                Finish session
                <img src={PRACTICE_COMPLETE_ARROW_ICON} alt="" className="h-5 w-5 object-contain" width={20} height={20} />
              </button>
              <button
                type="button"
                onClick={onExtendSession}
                className="text-base font-semibold text-[#0056d2] underline-offset-2 hover:underline"
              >
                Extend today&apos;s session
              </button>
            </div>
          </div>
          <div className="mx-auto flex h-36 w-full max-w-[280px] shrink-0 items-center justify-center md:mx-0 md:h-[160px] lg:max-w-[320px]">
            <img
              src={PRACTICE_COMPLETE_ILLUSTRATION}
              alt=""
              className="h-full w-full object-contain object-center"
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col bg-white px-[20px] py-10 md:py-12">
        <div className="flex min-h-0 flex-col gap-10 px-4 md:px-8 lg:px-10">
        <section className="flex w-full min-w-0 flex-col gap-4">
          <h3 className="text-xl font-semibold leading-6 tracking-tight text-[#0f1114]">What you did well</h3>
          <ul className="flex flex-col gap-2">
            {strengths.map((line) => (
              <li key={line} className="flex gap-2">
                <IconListCheck className="mt-1 h-4 w-4 shrink-0" />
                <p className="text-base font-normal leading-6 text-[#0f1114]">{line}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex w-full min-w-0 flex-col gap-4">
          <h3 className="text-xl font-semibold leading-6 tracking-tight text-[#0f1114]">
            Opportunity to dive into your skill gap
          </h3>
          <div className="flex w-full min-w-0 flex-col gap-4">
            <p className="text-base font-semibold leading-5 tracking-tight text-[#0f1114]">Product development lifecycle</p>
            <div className="w-full min-w-0 space-y-1 text-sm font-normal leading-5 text-[#0f1114] md:text-base md:leading-6">
              <p>Based on your recent work, it seems that you are less comfortable working with large data sets.</p>
              <p>It might help you to spend a bit of time learning this core skill before continuing in your path.</p>
            </div>

            <div className="w-full rounded-lg bg-[#f0f6ff] p-3 md:p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 flex-1 gap-3">
                  <div className="flex h-12 w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f1e8ff]">
                    <img
                      src={PRACTICE_RECOMMEND_THUMB}
                      alt=""
                      className="h-12 w-[72px] rounded-lg object-cover"
                      width={72}
                      height={48}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-normal leading-5 tracking-tight text-[#0f1114]">
                      Accessing Databases with Python
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm font-normal text-[#5b6780]">
                      <span>Video</span>
                      <span className="flex items-center gap-1">
                        <IconClockOutline className="h-4 w-4 shrink-0" />
                        4m
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onAddToLearningPlan}
                  disabled={suggestedPlanAdded}
                  className={
                    suggestedPlanAdded
                      ? "shrink-0 cursor-default rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold leading-5 text-[#8b95a8]"
                      : "shrink-0 rounded-lg border border-[#0056d2] bg-white px-3 py-2 text-sm font-semibold leading-5 text-[#0056d2] hover:bg-sky-50/80"
                  }
                >
                  {suggestedPlanAdded ? "Added to your plan" : "Add to my learning plan"}
                </button>
              </div>
            </div>
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}

/** Figma node 33:5228 — main column when last outline row (practice lab) is selected */
function LabExercisePanel({ onLaunch }: { onLaunch: () => void }) {
  const bodyCopy =
    "Based on your goal to increase your proficiency with web page creation, we have customized this activity to be an example in your industry: create your stores own website.";

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-4 md:p-6">
      <div className="mx-auto w-full max-w-[818px] shrink-0 overflow-hidden rounded-2xl border border-[#dae1ed] bg-white shadow-sm">
        <div className="relative overflow-hidden bg-[#e3eeff] px-6 py-8 md:px-10 md:py-10">
          <div className="relative z-[1] flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 max-w-xl flex-1">
              <p className="text-base font-normal leading-6 text-[#5b6780]">Lab exercise</p>
              <h2 className="mt-2 text-3xl font-semibold leading-[1.12] tracking-tight text-[#0f1114] md:text-4xl md:leading-[42px] md:tracking-[-0.02em]">
                Jamie, it&apos;s time to create your store&apos;s website!
              </h2>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onLaunch}
                  className="rounded-lg bg-[#0056d2] px-5 py-2.5 text-base font-semibold leading-6 tracking-wide text-white shadow-[0_4px_6px_0_rgba(0,0,0,0.08)] hover:brightness-110"
                >
                  Launch
                </button>
                <div className="flex items-center gap-2 rounded-lg py-1.5 pl-1 pr-2">
                  <img src={LAB_EXERCISE_XP_GEM} alt="" className="h-5 w-5 object-contain" width={20} height={20} />
                  <span className="text-base font-semibold leading-5 tracking-tight text-[#c74504]">30XP</span>
                </div>
              </div>
            </div>
            <div className="relative mx-auto flex h-44 w-full max-w-[280px] shrink-0 items-end justify-center lg:mx-0 lg:h-52 lg:w-[300px]">
              <img
                src={LAB_EXERCISE_ILLUSTRATION}
                alt=""
                className="max-h-full w-full object-contain object-bottom"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#dae1ed] bg-white px-6 py-8 md:px-10 md:py-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
            <div className="min-w-0 flex-1 lg:max-w-[460px]">
              <p className="text-base font-normal leading-6 text-black/80">{bodyCopy}</p>
              <ul className="mt-6 flex flex-col gap-3">
                <li className="flex gap-2">
                  <IconLabTrophy className="mt-0.5 h-4 w-4 shrink-0" />
                  <p className="text-base font-normal leading-6 text-[#0f1114]">Get extra 30 XP!</p>
                </li>
                <li className="flex gap-2">
                  <IconLabHonors className="mt-0.5 h-4 w-4 shrink-0" />
                  <p className="text-base font-normal leading-6 text-[#0f1114]">
                    Prove your skillsets—get more personalized content based on your great performance!
                  </p>
                </li>
              </ul>
            </div>
            <aside className="w-full shrink-0 lg:max-w-[280px] lg:flex-1">
              <div className="rounded-lg border border-[#dae1ed] bg-white p-4">
                <p className="text-base font-semibold leading-5 tracking-tight text-[#0f1114]">What to expect</p>
                <ul className="mt-3 flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <IconClockOutline className="h-5 w-5 shrink-0 text-[#5b6780]" />
                    <span className="text-base font-normal leading-6 text-[#0f1114]">Due Feb 19, 2026</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconTimerOutline className="h-5 w-5 shrink-0 text-[#5b6780]" />
                    <span className="text-base font-normal leading-6 text-[#0f1114]">60 min per attempt</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <SparkleIcon className="h-4 w-4 shrink-0" />
                    <span className="text-base font-normal leading-6 text-[#0f1114]">Reviewed by AI</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Default copy — before personalization */
const INITIAL_GOAL_DESCRIPTION =
  "Understand HTML advanced concepts and be able to build a HTML webpage and add links to webpage.";

/** Sample goal after personalization (CSS path) */
const PERSONALIZED_GOAL_DESCRIPTION =
  "Learn practical CSS—Flexbox, Grid, and responsive layout—to ship polished, modern web interfaces.";

/** Figma node 8:14543 — Change time */
type SessionTimeChoice = "15" | "30" | "60" | "custom";

const SESSION_TIME_OPTIONS: {
  id: SessionTimeChoice;
  title: string;
  subtitle: string;
  xp: string | null;
  recommended?: boolean;
}[] = [
  { id: "15", title: "15 minutes", subtitle: "Quick session", xp: "20 XP" },
  { id: "30", title: "30 minutes", subtitle: "Based on your learning plan", xp: "60 XP", recommended: true },
  { id: "60", title: "1 hour", subtitle: "Extended session", xp: "120 XP" },
  { id: "custom", title: "Custom time", subtitle: "Set your own duration", xp: null },
];

function sessionTimeDisplay(id: SessionTimeChoice): string {
  if (id === "15") return "15min";
  if (id === "30") return "30min";
  if (id === "60") return "1h";
  return "Custom";
}

/** Figma node 32:4926 — completion modal */
const COURSE_PERSONALIZATION_COMPLETE_HERO =
  "https://www.figma.com/api/mcp/asset/669a6f61-2dd4-4282-a0b3-4aa139f4bcee";
const COURSE_PERSONALIZATION_TARGET_ASSET =
  "https://www.figma.com/api/mcp/asset/456ca58c-712a-4aae-970b-f0ca8d0baefd";
const COURSE_PERSONALIZATION_XP_BADGE_ASSET =
  "https://www.figma.com/api/mcp/asset/67d7f598-5a86-4136-b46e-d84b43a8bc9c";

function sessionCompleteBadgeText(id: SessionTimeChoice): string {
  if (id === "15") return "15 minute session";
  if (id === "30") return "30 minute session";
  if (id === "60") return "1 hour session";
  return "Custom session";
}

function sessionCompleteXpCompact(id: SessionTimeChoice): string | null {
  const xp = SESSION_TIME_OPTIONS.find((o) => o.id === id)?.xp;
  if (!xp) return null;
  return xp.replace(/\s+/g, "");
}

/** Figma 8:15001 — in-dialog session personalization log (long stream + auto-scroll) */
const SESSION_TIME_PERSONALIZATION_STEPS = [
  "Thinking…",
  "Analyzing course module 1 content",
  "Analyze career goal and skill level",
  "Removing intro course and simple tasks",
  "Analyzing course module 2 content",
  "Estimating session fit for selected duration…",
  "Reordering practice items for your time budget…",
  "Trimming optional readings to hit session length…",
  "Checking overlap with complementary modules…",
  "Scoring content relevance against today’s goal…",
  "Applying difficulty adjustments for your skill level…",
  "Resolving dependencies between outline items…",
  "Balancing video vs reading minutes…",
  "Validating XP allocation for the updated plan…",
  "Packaging updated session scope…",
  "Finalizing personalized session outline…",
] as const;

function thinkingLogLineClass(index: number, processingLine: number): string {
  const current = index === processingLine;
  if (current) {
    return "text-sm font-medium leading-5 text-[#2563eb] motion-reduce:animate-none animate-fade-in";
  }
  return "text-sm font-normal leading-5 text-[#0f1114]";
}

function timeSessionPersonalizationPercent(lineIndex: number, totalLines: number): number {
  if (totalLines <= 1) return 100;
  const max = totalLines - 1;
  return Math.round(35 + (lineIndex / max) * 65);
}

function IconChevronRightTime({ className, active }: { className?: string; active?: boolean }) {
  const stroke = active ? "#0056d2" : "#9ca3af";
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M7.5 5l5 5-5 5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconModalClose({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function IconPlusGoal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconSendGoal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

const GOAL_PERSONALIZATION_STEPS = [
  "Thinking…",
  "Analyzing course module 1 content",
  "Analyze career goal and skill level",
  "Removing intro course and simple tasks",
  "Analyzing course module 2 content",
  "Searching for CSS-specific curriculum modules…",
  "Identifying core CSS concepts: Box Model, Flexbox, Grid…",
  "Filtering out non-CSS related web development topics…",
  "Evaluating difficulty level for advanced selectors…",
  "Mapping CSS properties to practical project examples…",
  "Cross-referencing industry standards for modern CSS…",
  "Optimizing learning path for visual learners…",
  "Balancing theory with hands-on layout exercises…",
  "Checking prerequisites against your stated goal…",
  "Drafting a shorter path for returning learners…",
  "Finalizing updated module structure…",
] as const;

function goalCompletionPercent(lineIndex: number, totalLines: number): number {
  if (totalLines <= 1) return 100;
  const max = totalLines - 1;
  return Math.round(30 + (lineIndex / max) * 70);
}

function GoalDialog({
  open,
  onClose,
  outlineItems,
  todayGoalDescription,
  onApplyGeneratedPlan,
}: {
  open: boolean;
  onClose: () => void;
  outlineItems: readonly OutlineItem[];
  todayGoalDescription: string;
  onApplyGeneratedPlan: (items: OutlineItem[]) => void;
}) {
  const [view, setView] = useState<"default" | "processing" | "complete">("default");
  const [adjustDraft, setAdjustDraft] = useState("");
  const [processingLine, setProcessingLine] = useState(0);
  const thinkingListRef = useRef<HTMLUListElement>(null);
  const thinkingLogTailRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setView("default");
    setAdjustDraft("");
    setProcessingLine(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const submitAdjust = () => {
    const t = adjustDraft.trim();
    if (!t || view !== "default") return;
    setAdjustDraft("");
    setProcessingLine(0);
    setView("processing");
  };

  const stepCount = GOAL_PERSONALIZATION_STEPS.length;
  const completionPct = view === "processing" ? goalCompletionPercent(processingLine, stepCount) : 0;

  useEffect(() => {
    if (view !== "processing") return;
    const maxIdx = Math.max(0, stepCount - 1);
    setProcessingLine(0);
    if (maxIdx === 0) return;

    let line = 0;
    const id = window.setInterval(() => {
      if (line >= maxIdx) {
        window.clearInterval(id);
        return;
      }
      line += 1;
      setProcessingLine(line);
    }, 380);

    return () => window.clearInterval(id);
  }, [view, stepCount]);

  /** Figma 8:14049 — after 100%, switch to result summary */
  useEffect(() => {
    if (view !== "processing") return;
    if (completionPct < 100) return;
    const t = window.setTimeout(() => setView("complete"), 380);
    return () => window.clearTimeout(t);
  }, [view, completionPct]);

  /** Cursor-style: stream grows downward; keep latest line in view */
  useLayoutEffect(() => {
    if (view !== "processing") return;
    const list = thinkingListRef.current;
    const tail = thinkingLogTailRef.current;
    if (!list || !tail) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
    const run = () => tail.scrollIntoView({ block: "end", behavior });
    run();
    requestAnimationFrame(run);
  }, [view, processingLine]);

  if (!open) return null;

  const base = import.meta.env.BASE_URL;
  const personalizationDone = view === "processing" && completionPct >= 100;

  const handleConfirmPlan = () => {
    onApplyGeneratedPlan(GENERATED_OUTLINE_ITEMS);
    onClose();
  };

  const handleRegenerateFromComplete = () => {
    setProcessingLine(0);
    setView("processing");
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-dialog-title"
        className="flex h-[min(568px,90vh)] w-full max-w-[706px] flex-col overflow-hidden rounded-2xl border border-[#dae1ed] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 p-6 pb-3">
          <h2 id="goal-dialog-title" className="text-2xl font-semibold leading-7 tracking-tight text-[#0f1114]">
            Goal
          </h2>
          <button
            type="button"
            className="rounded-lg p-1.5 text-[#5b6780] hover:bg-slate-100"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <IconModalClose className="h-6 w-6" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden px-6 pb-4">
          <div className="flex min-h-[20px] w-full shrink-0 items-center gap-2">
            <img src={`${base}goal-modal-target.svg`} alt="" className="h-4 w-4 shrink-0" width={16} height={16} />
            <p className="text-sm font-semibold leading-[18px] tracking-tight text-[#5b6780]">TODAY&rsquo;S GOAL</p>
            <span className="min-w-0 flex-1" aria-hidden />
            <img src={`${base}goal-modal-xp.png`} alt="" className="h-5 w-5 shrink-0 object-contain" width={20} height={20} />
            <p className="shrink-0 text-right text-base font-semibold leading-5 tracking-tight text-[#c74504]">
              {view === "complete" ? "90XP" : "60XP"}
            </p>
          </div>

          {view === "default" ? (
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
              <p className="text-base font-normal leading-6 text-[#0f1114]">{todayGoalDescription}</p>

              <div className="mt-2.5 rounded-xl border border-[#e8eef7] bg-white px-6 py-6">
                <ul className="flex flex-col gap-2">
                  {outlineItems.map((row) => (
                    <li key={row.id}>
                      <p className="text-sm font-semibold leading-snug text-[#0f1114]">{row.title}</p>
                      <p className="mt-0.5 text-xs font-normal leading-[18px] text-[#5b6780]">{row.meta}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : view === "processing" ? (
            <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden">
              <p className="shrink-0 text-base font-medium leading-6 text-[#0f1114]">Personalization in progress</p>

              <div className="flex min-h-0 h-[280px] shrink-0 flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
                <ul
                  ref={thinkingListRef}
                  className="flex min-h-0 flex-1 flex-col gap-3 scroll-pb-2 overflow-y-auto overflow-x-hidden overscroll-contain px-6 py-6 [overflow-anchor:none]"
                  aria-label="Personalization progress"
                  aria-live="polite"
                  aria-relevant="additions"
                >
                  {GOAL_PERSONALIZATION_STEPS.slice(0, processingLine + 1).map((line, i) => (
                    <li
                      key={i}
                      ref={i === processingLine ? thinkingLogTailRef : undefined}
                      data-step={i}
                      className={thinkingLogLineClass(i, processingLine)}
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
              <p className="text-base font-normal leading-6 text-[#0f1114]">{PERSONALIZED_GOAL_DESCRIPTION}</p>

              <div className="mt-2.5 rounded-xl border border-[#e8eef7] bg-white px-6 py-6">
                <ul className="flex flex-col gap-2">
                  {GENERATED_OUTLINE_ITEMS.map((row) => (
                    <li key={row.id}>
                      <p className="text-sm font-semibold leading-snug text-[#0f1114]">{row.title}</p>
                      <p className="mt-0.5 text-xs font-normal leading-[18px] text-[#5b6780]">{row.meta}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 bg-white px-5 pb-6 pt-2">
          <div className="flex flex-col gap-2">
            {view === "complete" ? (
              <div className="flex w-full items-center gap-2 rounded-lg bg-[#f2f5fa] p-2 text-[#5b6780]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#0056d2]" aria-hidden>
                  <IconPlusGoal className="h-5 w-5" />
                </span>
                <span className="py-1 text-base font-normal leading-6">Adjust my goal</span>
              </div>
            ) : (
              <div className="flex w-full items-center gap-1 rounded-lg bg-[#f2f5fa] p-1.5 pl-1 focus-within:ring-2 focus-within:ring-[#0056d2]/25">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#0056d2]" aria-hidden>
                  <IconPlusGoal className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  className="min-w-0 flex-1 bg-transparent py-2 text-base font-normal leading-6 text-[#0f1114] outline-none placeholder:text-[#5b6780] disabled:opacity-60"
                  placeholder="Adjust my goal"
                  value={adjustDraft}
                  onChange={(e) => setAdjustDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submitAdjust();
                    }
                  }}
                  disabled={view === "processing"}
                  aria-label="Adjust my goal"
                />
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[#0056d2] hover:bg-white/80 disabled:pointer-events-none disabled:opacity-35"
                  aria-label="Send"
                  disabled={!adjustDraft.trim() || view === "processing"}
                  onClick={submitAdjust}
                >
                  <IconSendGoal className="h-5 w-5" />
                </button>
              </div>
            )}

            {view === "processing" ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-normal tabular-nums leading-4 text-[#8b95a8]">
                  Generation completed {completionPct}%
                </p>
                <button
                  type="button"
                  disabled={!personalizationDone}
                  className={
                    personalizationDone
                      ? "inline-flex w-full shrink-0 items-center justify-center rounded-lg bg-[#0056d2] px-4 py-2.5 text-base font-semibold text-white hover:brightness-110 sm:w-auto sm:self-end"
                      : "inline-flex w-full shrink-0 cursor-not-allowed items-center justify-center rounded-lg bg-[#d0d8e4] px-4 py-2.5 text-base font-semibold text-white/95 sm:w-auto sm:self-end"
                  }
                >
                  Regenerate my plan
                </button>
              </div>
            ) : view === "complete" ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleRegenerateFromComplete}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-[#0056d2] bg-white px-4 py-2.5 text-base font-semibold text-[#0056d2] hover:bg-slate-50 sm:w-auto"
                >
                  Regenerate my plan
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPlan}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#0056d2] px-4 py-2.5 text-base font-semibold text-white hover:brightness-110 sm:w-auto"
                >
                  Confirm
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-lg bg-[#0056d2] px-4 py-2.5 text-base font-semibold text-white hover:brightness-110 sm:w-auto sm:self-end"
              >
                Regenerate my plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function ChangeTimeDialog({
  open,
  onClose,
  sessionTimeId,
  onApplySessionTime,
  goalDescription,
  onContinueLearning,
}: {
  open: boolean;
  onClose: () => void;
  sessionTimeId: SessionTimeChoice;
  onApplySessionTime: (id: SessionTimeChoice) => void;
  goalDescription: string;
  onContinueLearning: () => void;
}) {
  const [phase, setPhase] = useState<"pick" | "personalizing" | "complete">("pick");
  const [selected, setSelected] = useState<SessionTimeChoice>(sessionTimeId);
  const [processingLine, setProcessingLine] = useState(0);
  const sessionThinkingRef = useRef<HTMLUListElement>(null);
  const sessionLogTailRef = useRef<HTMLLIElement | null>(null);

  /** Only reset when the dialog opens. If `sessionTimeId` is included in deps, `onApplySessionTime` at 100% updates the parent and this effect re-runs, forcing phase back to "pick" and skipping "complete". */
  useEffect(() => {
    if (!open) return;
    setPhase("pick");
    setSelected(sessionTimeId);
    setProcessingLine(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const sessionStepCount = SESSION_TIME_PERSONALIZATION_STEPS.length;
  const sessionPct =
    phase === "personalizing" ? timeSessionPersonalizationPercent(processingLine, sessionStepCount) : 0;

  useEffect(() => {
    if (!open || phase !== "personalizing") return;
    const maxIdx = Math.max(0, sessionStepCount - 1);
    setProcessingLine(0);
    if (maxIdx === 0) return;

    let line = 0;
    const id = window.setInterval(() => {
      if (line >= maxIdx) {
        window.clearInterval(id);
        return;
      }
      line += 1;
      setProcessingLine(line);
    }, 380);

    return () => window.clearInterval(id);
  }, [open, phase, sessionStepCount]);

  useEffect(() => {
    if (phase !== "personalizing") return;
    if (sessionPct < 100) return;
    const t = window.setTimeout(() => {
      onApplySessionTime(selected);
      setPhase("complete");
    }, 400);
    return () => window.clearTimeout(t);
  }, [phase, sessionPct, selected, onApplySessionTime]);

  /** Cursor-style: keep the latest line pinned into view inside the fixed-height log */
  useLayoutEffect(() => {
    if (phase !== "personalizing") return;
    const list = sessionThinkingRef.current;
    const tail = sessionLogTailRef.current;
    if (!list || !tail) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
    const run = () => tail.scrollIntoView({ block: "end", behavior });
    run();
    requestAnimationFrame(run);
  }, [phase, processingLine]);

  if (!open) return null;

  const titleId = phase === "complete" ? "course-personalization-complete-title" : "change-time-title";

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex w-full max-w-[480px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] ${
          phase === "complete" ? "max-h-[min(568px,90vh)]" : "h-[min(568px,90vh)] border border-[#dae1ed] shadow-xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {phase === "complete" ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div
              className="relative flex h-[222px] shrink-0 items-end justify-center overflow-hidden bg-[#f1e8ff]"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 280px 170px at 50% 50%, rgba(241,232,255,0.85) 0%, rgba(241,232,255,1) 70%)",
              }}
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img
                  src={COURSE_PERSONALIZATION_COMPLETE_HERO}
                  alt=""
                  className="absolute left-0 top-[-31.64%] h-[131.64%] w-full max-w-none object-cover object-bottom"
                />
              </div>
              <button
                type="button"
                className="absolute right-2 top-2 z-10 rounded-lg bg-white/90 p-2 text-[#5b6780] shadow-sm backdrop-blur-sm hover:bg-white"
                aria-label="Close dialog"
                onClick={onClose}
              >
                <IconModalClose className="h-6 w-6" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 pb-6 pt-[18px]">
              <div className="flex shrink-0 flex-col gap-2">
                <h2
                  id="course-personalization-complete-title"
                  className="text-2xl font-semibold leading-7 tracking-tight text-[#0f1114]"
                >
                  Course personalization is complete
                </h2>
                <span className="inline-flex w-fit rounded-full bg-[#e3eeff] px-3 py-1 text-sm font-normal leading-5 text-[#0f1114]">
                  {sessionCompleteBadgeText(selected)}
                </span>
              </div>

              <div className="shrink-0 rounded-xl bg-white p-4 ring-1 ring-[#e8eef7]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <img
                      src={COURSE_PERSONALIZATION_TARGET_ASSET}
                      alt=""
                      className="h-4 w-4 shrink-0"
                      width={16}
                      height={16}
                    />
                    <span className="text-base font-semibold leading-5 tracking-tight text-[#0f1114]">GOAL</span>
                  </div>
                  {sessionCompleteXpCompact(selected) ? (
                    <div className="flex shrink-0 items-center gap-1.5">
                      <img
                        src={COURSE_PERSONALIZATION_XP_BADGE_ASSET}
                        alt=""
                        className="h-5 w-5 object-contain"
                        width={20}
                        height={20}
                      />
                      <span className="text-sm font-semibold leading-[18px] tracking-tight text-[#c74504]">
                        {sessionCompleteXpCompact(selected)}
                      </span>
                    </div>
                  ) : null}
                </div>
                <p className="mt-2.5 text-base font-normal leading-6 text-[#0f1114]">{goalDescription}</p>
              </div>

              <div className="mt-auto shrink-0 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onContinueLearning();
                    onClose();
                  }}
                  className="w-full rounded-lg bg-[#0056d2] py-3.5 text-center text-base font-semibold text-white shadow-[0_4px_6px_0_rgba(0,0,0,0.1)] hover:brightness-110"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex shrink-0 items-start justify-between gap-4 p-6 pb-2">
              <h2 id="change-time-title" className="text-2xl font-semibold leading-7 tracking-tight text-[#0f1114]">
                Change time
              </h2>
              <button
                type="button"
                className="rounded-lg p-1.5 text-[#5b6780] hover:bg-slate-100"
                aria-label="Close dialog"
                onClick={onClose}
              >
                <IconModalClose className="h-6 w-6" />
              </button>
            </div>

            {phase === "pick" ? (
          <>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-6 pb-4">
              {SESSION_TIME_OPTIONS.map((opt) => {
                const isSel = selected === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelected(opt.id)}
                    className={`flex w-full items-center justify-between gap-4 rounded-[14px] border-2 px-[18px] py-3 text-left transition ${
                      isSel ? "border-[#2b7fff] bg-[#eff6ff]" : "border-[#e5e7eb] bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-semibold leading-6 text-[#101828]">{opt.title}</span>
                        {opt.recommended ? (
                          <span className="rounded-full bg-[#155dfc] px-2 py-0.5 text-[11px] font-semibold uppercase leading-4 tracking-wide text-white">
                            Recommended
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm font-medium leading-5 text-[#4a5565]">{opt.subtitle}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {opt.xp ? <span className="text-base font-medium tabular-nums text-[#4a5565]">{opt.xp}</span> : null}
                      <IconChevronRightTime className="h-5 w-5 shrink-0" active={isSel} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-5">
              <button
                type="button"
                onClick={() => {
                  setProcessingLine(0);
                  setPhase("personalizing");
                }}
                className="w-full rounded-lg bg-[#0056d2] py-3 text-center text-base font-semibold text-white hover:brightness-110"
              >
                Personalize my session
              </button>
            </div>
          </>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col px-6 pb-6">
            <div className="flex shrink-0 flex-col items-center pt-2">
              <SparkleIcon className="block h-10 w-10 shrink-0 origin-center animate-spin motion-reduce:animate-none" />
              <p className="mt-4 text-center text-base font-semibold leading-6 tracking-tight text-[#101828]">
                Personalization in progress {sessionPct}%
              </p>
            </div>

            <div className="mt-4 flex h-[min(280px,38vh)] min-h-[200px] shrink-0 flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
              <ul
                ref={sessionThinkingRef}
                className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden overscroll-contain px-6 py-6 [overflow-anchor:none]"
                aria-label="Session personalization progress"
                aria-live="polite"
                aria-relevant="additions"
              >
                {SESSION_TIME_PERSONALIZATION_STEPS.slice(0, processingLine + 1).map((line, i) => (
                  <li
                    key={i}
                    ref={i === processingLine ? sessionLogTailRef : undefined}
                    className={thinkingLogLineClass(i, processingLine)}
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

/** Figma 34:7544 — modules shown in "Personalized Learning Path" (Course progress trigger) */
const PERSONALIZED_LEARNING_PATH_COURSE_LABEL = "Generative AI content creation";
const PERSONALIZED_LEARNING_PATH_PROGRESS_PCT = 18;

const PERSONALIZED_LEARNING_PATH_MODULES: readonly { title: string; description: string; recommended: boolean }[] = [
  {
    title: "HTML webpage basics",
    description: "Understand HTML advanced concepts and be able to build a HTML webpage.",
    recommended: true,
  },
  {
    title: "Working with large data sets",
    description: "Prepare, explore, and summarize structured data so models and stakeholders can trust your inputs.",
    recommended: false,
  },
  {
    title: "Why good prompts matter",
    description: "Write clear instructions, constraints, and success criteria to get reliable outputs from GenAI tools.",
    recommended: false,
  },
  {
    title: "Roles, context & framing",
    description: "Set persona, audience, and background so the model stays on task across longer sessions.",
    recommended: false,
  },
  {
    title: "Few-shot example formatting",
    description: "Curate short labeled examples that teach format and tone without overwhelming the context window.",
    recommended: false,
  },
  {
    title: "Iteration & debugging prompts",
    description: "Refine prompts from failures, compare variants, and document what works for your team.",
    recommended: false,
  },
];

function PersonalizedLearningPathDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="personalized-learning-path-title"
        className="flex max-h-[min(715px,90vh)] w-full max-w-[635px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start gap-1 p-6 pb-4">
          <div className="min-w-0 flex-1 pr-2">
            <h2
              id="personalized-learning-path-title"
              className="text-[30px] font-semibold leading-9 tracking-[-0.015em] text-[#0f1114]"
            >
              Personalized Learning Path
            </h2>
            <p className="mt-1 text-base font-normal leading-6 text-[#1f1f1f]">
              Course content may be personalized further based on your performance.
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg p-1.5 text-[#0f1114] hover:bg-slate-100"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <IconModalClose className="h-6 w-6" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-6 pb-4">
          <div className="flex shrink-0 flex-col gap-1.5">
            <div className="flex items-center justify-between gap-4 text-base font-normal leading-6 text-[#0f1114]">
              <span className="min-w-0">{PERSONALIZED_LEARNING_PATH_COURSE_LABEL}</span>
              <span className="shrink-0 tabular-nums">{PERSONALIZED_LEARNING_PATH_PROGRESS_PCT}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-sm bg-[#dae1ed]">
              <div
                className="h-full rounded-sm bg-[#0056d2]"
                style={{ width: `${PERSONALIZED_LEARNING_PATH_PROGRESS_PCT}%` }}
              />
            </div>
          </div>

          <ul className="flex flex-col gap-2">
            {PERSONALIZED_LEARNING_PATH_MODULES.map((mod, idx) => (
              <li
                key={idx}
                className="rounded-2xl border border-[#dae1ed] bg-white p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold leading-5 tracking-[-0.03px] text-[#0f1114]">{mod.title}</p>
                    <p className="mt-2 text-xs font-normal leading-[18px] text-[#0f1114]">{mod.description}</p>
                  </div>
                  {mod.recommended ? (
                    <span className="shrink-0 rounded-full bg-[#155dfc] px-2 py-0.5 text-xs font-semibold uppercase leading-4 tracking-wide text-white">
                      Recommended
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 justify-end border-t border-slate-100 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#0056d2] px-8 py-2 text-base font-semibold text-white hover:brightness-110"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function LearningPage() {
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [courseProgressDialogOpen, setCourseProgressDialogOpen] = useState(false);
  const [sessionTimeId, setSessionTimeId] = useState<SessionTimeChoice>("30");
  const [outlineItems, setOutlineItems] = useState<OutlineItem[]>(() => INITIAL_OUTLINE_ITEMS.map((o) => ({ ...o })));
  const [practiceLaunched, setPracticeLaunched] = useState(false);
  const [todayGoalDescription, setTodayGoalDescription] = useState(INITIAL_GOAL_DESCRIPTION);
  const closeGoalDialog = useCallback(() => setGoalDialogOpen(false), []);
  const applyGeneratedPlan = useCallback((items: OutlineItem[]) => {
    setOutlineItems(items.map((o) => ({ ...o })));
    setTodayGoalDescription(PERSONALIZED_GOAL_DESCRIPTION);
  }, []);

  const applySessionTime = useCallback((id: SessionTimeChoice) => {
    setSessionTimeId(id);
  }, []);

  const appendPostContinueLearningOutline = useCallback(() => {
    setOutlineItems((prev) => {
      const appendIds = new Set(POST_CONTINUE_LEARNING_OUTLINE.map((r) => r.id));
      if (prev.some((row) => appendIds.has(row.id))) return prev;
      return [...prev, ...POST_CONTINUE_LEARNING_OUTLINE.map((row) => ({ ...row }))];
    });
  }, []);

  const selectedOutline = outlineItems.find((o) => o.selected);
  const showLabExerciseView = Boolean(
    selectedOutline && isSelectedLastChallengeInOutline(outlineItems, selectedOutline.id)
  );

  useEffect(() => {
    if (!showLabExerciseView) setPracticeLaunched(false);
  }, [showLabExerciseView]);

  const finishPracticeSession = useCallback(() => {
    setPracticeLaunched(false);
    setOutlineItems((prev) => prev.map((row, i) => ({ ...row, selected: i === 0 })));
  }, []);

  const extendPracticeSession = useCallback(() => {
    setTimeDialogOpen(true);
  }, []);

  const suggestedPlanAdded = outlineItems.some((o) => o.id === AI_SUGGESTED_PLAN_ITEM_ID);

  const addSuggestedPlanItem = useCallback(() => {
    setOutlineItems((prev) => {
      if (prev.some((r) => r.id === AI_SUGGESTED_PLAN_ITEM_ID)) return prev;
      return [...prev, { ...AI_SUGGESTED_PLAN_ITEM }];
    });
  }, []);

  const openCourseProgressDialog = useCallback(() => {
    setCourseProgressDialogOpen(true);
  }, []);

  const closeCourseProgressDialog = useCallback(() => {
    setCourseProgressDialogOpen(false);
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f2f5fa] font-sans text-[#0f1114]">
      <header className="z-10 flex shrink-0 items-center justify-between bg-[#f2f5fa] px-4 py-4 pr-5">
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
          <button type="button" className="rounded-lg p-2 hover:bg-black/5 hover:text-[#5b6780]" aria-label="Help">
            <IconHelp className="h-6 w-6" />
          </button>
          <button type="button" className="rounded-lg p-2 hover:bg-black/5 hover:text-[#5b6780]" aria-label="Language">
            <IconGlobe className="h-6 w-6" />
          </button>
          <button type="button" className="rounded-lg p-2 hover:bg-black/5" aria-label="AI">
            <SparkleIcon className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#002761] text-sm font-semibold text-white hover:brightness-110"
            aria-label="Account"
          >
            N
          </button>
        </nav>
      </header>

      <div className="flex min-h-0 flex-1 gap-4 overflow-hidden p-4">
        {/* 左：课程大纲 */}
        <aside className="relative z-30 flex w-72 min-w-[280px] max-w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {/* 固定头部：不用 sticky，避免在 overflow 容器内点击被滚动层抢走 */}
          <div className="shrink-0 border-b border-slate-100 bg-white px-4 pb-3 pt-4">
            <div className="flex items-start justify-between gap-2">
              <h1 className="min-w-0 text-lg font-semibold leading-6 tracking-tight text-[#0f1114]">
                Generative AI Content Creation
              </h1>
              <button type="button" className="shrink-0 rounded-lg p-1 text-[#5b6780] hover:bg-slate-100" aria-label="Collapse panel">
                <IconCollapse className="h-5 w-5" />
              </button>
            </div>
            <button
              type="button"
              className="mt-1 block w-full cursor-pointer rounded-md py-2 text-left text-xs font-normal text-[#0056d2] outline-offset-2 hover:bg-sky-50/60 hover:underline focus-visible:ring-2 focus-visible:ring-[#0056d2]/30"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openCourseProgressDialog();
              }}
            >
              {SIDEBAR_COURSE_PROGRESS_LINK}
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            <div className="rounded-xl bg-gradient-to-br from-white to-[#f2f5fa] p-3 ring-1 ring-slate-100">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm font-semibold text-[#0f1114]">Today&apos;s goal</span>
                  <button
                    type="button"
                    className="text-sm font-semibold text-[#0f1114] underline decoration-[#0f1114] underline-offset-2 hover:text-[#0056d2] hover:decoration-[#0056d2]"
                    aria-label={`Session length ${sessionTimeDisplay(sessionTimeId)}, change`}
                    onClick={() => setTimeDialogOpen(true)}
                  >
                    {sessionTimeDisplay(sessionTimeId)}
                  </button>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-lg p-1 text-[#5b6780] hover:bg-white/80"
                  aria-label="Edit goal"
                  onClick={() => setGoalDialogOpen(true)}
                >
                  <IconPencil className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-xs leading-[18px] text-[#0f1114]">{todayGoalDescription}</p>
            </div>

            <ul className="mt-4 space-y-1">
              {outlineItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setOutlineItems((prev) =>
                        prev.map((row) => ({ ...row, selected: row.id === item.id }))
                      )
                    }
                    className={`flex w-full gap-3 rounded-lg px-2 py-2.5 text-left transition ${
                      item.selected
                        ? "border-l-[3px] border-[#0056d2] bg-sky-50/80 pl-[5px]"
                        : "border-l-[3px] border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <OutlineIcon type={item.icon} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug text-[#0f1114]">{item.title}</p>
                      <p className="mt-0.5 text-xs text-[#5b6780]">{item.meta}</p>
                      {item.badge ? (
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{item.badge}</p>
                      ) : null}
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-slate-100 pt-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#8b95a8]">Future Learning</p>
              <div className="mt-2 flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 14l4-4-4-4M12 20h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">Next goal</p>
                  <p className="mt-1 text-xs leading-[18px] text-[#5b6780]">
                    Understand GitHub advanced concepts and be able to utilize the platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* 中：播放器或 Lab（Figma 33:5228 — 选中大纲最后一项） */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {showLabExerciseView ? (
            practiceLaunched ? (
              <PracticeCompletePanel
                onFinishSession={finishPracticeSession}
                onExtendSession={extendPracticeSession}
                onAddToLearningPlan={addSuggestedPlanItem}
                suggestedPlanAdded={suggestedPlanAdded}
              />
            ) : (
              <LabExercisePanel onLaunch={() => setPracticeLaunched(true)} />
            )
          ) : (
            <div className="flex min-h-0 flex-1 flex-col p-4 md:p-6">
              <div className="relative mx-auto aspect-video w-full min-w-0 max-w-5xl overflow-hidden rounded-xl bg-slate-900 shadow-inner ring-1 ring-black/10">
                <img
                  src={VIDEO_POSTER}
                  alt=""
                  className="h-full w-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" aria-hidden />
                {(
                  [
                    ["left-3 top-3", "tl"],
                    ["right-3 top-3", "tr"],
                    ["left-3 bottom-3", "bl"],
                    ["right-3 bottom-3", "br"],
                  ] as const
                ).map(([pos, id]) => (
                  <span
                    key={id}
                    className={`absolute ${pos} h-2.5 w-2.5 rounded-full border border-white/90 bg-[#0056d2]/90 shadow-sm`}
                    aria-hidden
                  />
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-semibold tracking-tight text-[#0f1114]">
                  {selectedOutline?.title ?? "CSS advanced"}
                </h2>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-[#0f1114] shadow-sm hover:bg-slate-50"
                >
                  <IconNote className="h-4 w-4 text-[#5b6780]" />
                  Save note
                </button>
              </div>

              <div className="flex flex-1 flex-col justify-end pt-6">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0f1114] shadow-sm transition hover:bg-slate-50"
                  >
                    Go to next item <span aria-hidden>→</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* 右：工具栏 */}
        <aside className="flex w-[72px] shrink-0 flex-col items-center gap-1 overflow-y-auto rounded-2xl border border-slate-200/80 bg-white py-4 shadow-sm">
          {(
            [
              { Icon: IconTranscript, label: "Transcript", active: false },
              { Icon: IconNote, label: "Notes", active: false },
              { Icon: IconFiles, label: "Files", active: false },
              { Icon: SparkleIcon, label: "Resources", active: true },
              { Icon: IconPractice, label: "Practice", active: false },
            ] as const
          ).map(({ Icon, label, active }) => (
            <button
              key={label}
              type="button"
              className={`flex w-full flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-medium leading-tight ${
                active ? "text-[#5b36c7]" : "text-[#8b95a8] hover:bg-slate-50 hover:text-[#5b6780]"
              }`}
            >
              <Icon className={`h-6 w-6 ${active ? "" : "opacity-90"}`} />
              <span className="max-w-[64px] text-center">{label}</span>
            </button>
          ))}
        </aside>
      </div>

      <GoalDialog
        open={goalDialogOpen}
        onClose={closeGoalDialog}
        outlineItems={outlineItems}
        todayGoalDescription={todayGoalDescription}
        onApplyGeneratedPlan={applyGeneratedPlan}
      />
      <ChangeTimeDialog
        open={timeDialogOpen}
        onClose={() => setTimeDialogOpen(false)}
        sessionTimeId={sessionTimeId}
        onApplySessionTime={applySessionTime}
        goalDescription={todayGoalDescription}
        onContinueLearning={appendPostContinueLearningOutline}
      />
      <PersonalizedLearningPathDialog open={courseProgressDialogOpen} onClose={closeCourseProgressDialog} />
    </div>
  );
}
