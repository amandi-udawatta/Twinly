export const THE_BRAIN_BASE = "/the-brain";

export const THE_BRAIN_BACKGROUND = `${THE_BRAIN_BASE}/herobackground.png`;

export const THE_BRAIN_ASSETS = {
  mascot1: `${THE_BRAIN_BASE}/b1.png`,
  mascot2: `${THE_BRAIN_BASE}/b2.png`,
  mascot3: `${THE_BRAIN_BASE}/b3.png`,
} as const;

export const THE_BRAIN_BODY =
  "No complicated charts, no guesswork. Just snap a photo, stick a cute QR sticker on your pot, and let Twinly's intelligence engine do the remembering. We learn your plant's unique story and whisper exactly what it needs next, right when it needs it.";

export type BrainPathId = 1 | 2 | 3;

/** Percentage coordinates within the 500px diagram canvas */
export type BrainDiagramLayout = {
  id: BrainPathId;
  title: string;
  description: string;
  /** SVG path in 0–100 coordinate space */
  pathD: string;
  node: { left: string; top: string };
  glow: { left: string; top: string };
  card: { left: string; top: string };
  mascot: keyof typeof THE_BRAIN_ASSETS;
  /** Mascot visible from initial load (path 1 only) */
  mascotInitiallyVisible: boolean;
};

export const BRAIN_DIAGRAM: BrainDiagramLayout[] = [
  {
    id: 1,
    title: "Snap & Auto-Fill",
    description:
      "Just upload a photo. Twinly's vision engine instantly recognizes the species and auto-fills a custom profile.",
    pathD: "M 15 75 L 15 15 L 30 15",
    node: { left: "15%", top: "75%" },
    glow: { left: "30%", top: "15%" },
    card: { left: "34%", top: "6%" },
    mascot: "mascot1",
    mascotInitiallyVisible: true,
  },
  {
    id: 2,
    title: "Longitudinal AI Memory",
    description:
      "Twinly remembers your plant's journey and combines past data with local weather to predict exactly what it needs next",
    pathD: "M 45 75 L 45 40",
    node: { left: "45%", top: "75%" },
    glow: { left: "45%", top: "40%" },
    card: { left: "58%", top: "28%" },
    mascot: "mascot2",
    mascotInitiallyVisible: false,
  },
  {
    id: 3,
    title: "Daily Check-Ins via QR",
    description:
      "Stick a unique QR code on your pot. Scan it, snap a few angles, and log any quick notes.",
    pathD: "M 75 75 L 75 90 L 55 90",
    node: { left: "75%", top: "75%" },
    glow: { left: "55%", top: "90%" },
    card: { left: "8%", top: "62%" },
    mascot: "mascot3",
    mascotInitiallyVisible: false,
  },
];

export const DIAGRAM_BASELINE = {
  top: "75%",
  height: "1.5rem",
} as const;
