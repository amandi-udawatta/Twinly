export const SIGN_IN_BASE = "/sign in";

export const SIGN_IN_ASSETS = {
  leftBackground: `${SIGN_IN_BASE}/herobackground.png`,
  rightBackground: `${SIGN_IN_BASE}/s2.png`,
  mascot: `${SIGN_IN_BASE}/s1.png`,
} as const;

export const SIGN_IN_COPY = {
  lines: [
    "Your plant fam has been waiting for you",
    "Ready to start your digital greenhouse..",
    "Create an account to give your first plant its twin.",
  ],
  footer: "The intelligence engine is ready to learn",
} as const;
