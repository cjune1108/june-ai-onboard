import { Link } from "react-router-dom";

/** Figma node 31:4309 — static reference frame (exported to `public/prepare-screen.png`) */
export default function Prepare() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#f2f5fa]">
      <div className="flex min-h-0 flex-1 items-start justify-center overflow-auto p-2 sm:p-4">
        {/* 截图上的「Enroll for free」为位图，用与画布同比例的透明链接触发热区 */}
        <div className="relative w-full max-w-[1440px] shadow-sm ring-1 ring-black/5">
          <img
            src="/prepare-screen.png"
            alt="Prepare — Coursera proactive AI reference screen"
            className="block h-auto w-full select-none"
            width={1440}
            height={1021}
            decoding="async"
          />
          <Link
            to="/app"
            className="absolute left-[31%] top-[9%] z-10 block h-[5.5%] min-h-[44px] w-[16%] max-w-[220px] rounded-md bg-transparent hover:bg-[#0056d2]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0056d2] focus-visible:ring-offset-2"
            aria-label="Enroll for free — open interactive prototype"
            title="Enroll for free"
          />
        </div>
      </div>
      <div className="shrink-0 border-t border-slate-200/80 bg-white/90 px-4 py-3 text-center backdrop-blur-sm">
        <Link
          to="/app"
          className="text-sm font-semibold text-[#0056d2] underline-offset-4 hover:underline"
        >
          Continue to interactive prototype
        </Link>
      </div>
    </div>
  );
}
