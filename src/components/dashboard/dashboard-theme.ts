/** Visual tokens aligned with the Twinly landing page */
export const dashboardShell =
  "min-h-screen bg-[#0d0d0d] font-poppins text-white";

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

export const dashboardHealthGood = "text-[#57B55D]";
export const dashboardHealthMid = "text-amber-400";
export const dashboardHealthBad = "text-red-400";

export function dashboardHealthTone(score: number | null): string {
  if (score === null) return "text-white/50";
  if (score > 70) return dashboardHealthGood;
  if (score >= 50) return dashboardHealthMid;
  return dashboardHealthBad;
}
