/** Visual tokens aligned with the Twinly landing page */
export type AppAppearance = "default" | "twinly";

export const dashboardShell =
  "min-h-screen bg-[#0d0d0d] font-poppins text-white";

/** Page title in Poppins (plant detail / check-in — no Lost Tumbler) */
export const twinlyPageTitlePoppins =
  "font-poppins text-[clamp(2.25rem,6vw,3.25rem)] font-semibold leading-none tracking-tight text-[#57B55D]";

export const twinlySectionTitle =
  "font-poppins text-lg font-semibold text-[#57B55D]";

export const twinlyInlineCard =
  "rounded-2xl border border-white/10 bg-black/30 p-4 font-poppins shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-md";

export const twinlyListRow =
  "rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-poppins text-sm text-white/85";

export const twinlyTabsList =
  "inline-flex h-auto w-full max-w-full flex-wrap gap-1 rounded-2xl border border-white/10 bg-black/40 p-1";

export const twinlyTabTrigger =
  "rounded-xl px-3 py-2 font-poppins text-sm font-medium text-white/60 transition-colors hover:text-white/90 data-active:bg-[#57B55D]/20 data-active:text-[#57B55D]";

export const twinlySelect =
  "w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 font-poppins text-sm text-white capitalize";

export const twinlyLabel = "font-poppins text-sm font-medium text-white/90";

export const dashboardPageTitle =
  "font-lost-tumbler text-[clamp(2.25rem,6vw,3.25rem)] uppercase leading-none tracking-tight text-[#57B55D]";

export const dashboardPageDescription =
  "font-poppins max-w-2xl text-sm italic leading-relaxed text-white/75 sm:text-base";

export const dashboardPanel =
  "rounded-2xl border border-white/10 bg-black/30 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md";

export const dashboardPanelTitle =
  "font-poppins text-xl font-semibold tracking-tight text-[#57B55D] sm:text-2xl";

export const dashboardPanelDescription =
  "font-poppins mt-2 text-sm italic leading-relaxed text-white/70";

export const dashboardBody =
  "font-poppins text-sm leading-relaxed text-white/85";

export const dashboardMuted =
  "font-poppins text-sm text-white/60";

export const dashboardLink =
  "font-poppins text-[#57B55D] underline-offset-4 transition-colors hover:text-[#6bc972] hover:underline";

export const dashboardCard =
  "overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm";

export const dashboardEmptyPanel =
  "flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/30 py-16 text-center backdrop-blur-md";

export const dashboardCtaPrimary =
  "inline-flex rounded-full bg-[#6B8F5C] px-6 py-2.5 font-poppins text-sm font-medium text-white shadow-md transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]";

export const dashboardCtaSecondary =
  "inline-flex rounded-full bg-[#9CA3AF] px-6 py-2.5 font-poppins text-sm font-medium text-white shadow-md transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]";

export const dashboardInput =
  "border-white/15 bg-black/40 text-white placeholder:text-white/40 focus-visible:border-[#57B55D]/50 focus-visible:ring-[#57B55D]/25";

export const dashboardFilterActive =
  "border-[#57B55D] bg-[#57B55D]/15 text-[#57B55D]";

export const dashboardFilterIdle =
  "border-white/20 text-white/60 hover:border-[#57B55D]/40 hover:text-white/90";

export const dashboardHealthGood = "text-[#57B55D]";
export const dashboardHealthMid = "text-amber-400";
export const dashboardHealthBad = "text-red-400";

export function dashboardHealthTone(score: number | null): string {
  if (score === null) return "text-white/50";
  if (score > 70) return dashboardHealthGood;
  if (score >= 50) return dashboardHealthMid;
  return dashboardHealthBad;
}
