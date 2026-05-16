export const FOOTER_BASE = "/footer";

export const FOOTER_ASSETS = {
  background: `${FOOTER_BASE}/f1.png`,
  mascot: `${FOOTER_BASE}/f2.png`,
} as const;

export const FOOTER_NAV_LINKS = [
  { label: "Plant Parents", href: "#plant-parents-heading" },
  { label: "Add a Sprout", href: "/plants/new" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
] as const;

export const FOOTER_TAGLINE = {
  primary: "Start Your Digital Greenhouse",
  secondary: "Nurtured with love. Powered by longitudinal AI.",
} as const;
