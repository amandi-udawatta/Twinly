export const PLANT_PARENTS_BASE = "/plant parents";

export const PLANT_PARENTS_ASSETS = {
  background: `${PLANT_PARENTS_BASE}/plantparentback.png`,
  next: `${PLANT_PARENTS_BASE}/next-svgrepo-com.svg`,
  back: `${PLANT_PARENTS_BASE}/back-square-svgrepo-com.svg`,
} as const;

export type PlantParentCardData = {
  id: string;
  title: string;
  body: string;
  mascotSrc: string;
};

export const PLANT_PARENT_CARDS: PlantParentCardData[] = [
  {
    id: "hopeful-beginner",
    title: "The Hopeful Beginner",
    body: "Just brought home your very first plant and terrified of overwatering it? Take a breath. Twinly holds your hand step-by-step, taking the guesswork out of watering and light so you can just enjoy the growth.",
    mascotSrc: `${PLANT_PARENTS_BASE}/pp1.png`,
  },
  {
    id: "home-gardener",
    title: "The Home Gardener",
    body: "Whether you are managing a sunny balcony container garden or a wild living room jungle, Twinly helps you track the unique needs of your indoor and outdoor spaces effortlessly.",
    mascotSrc: `${PLANT_PARENTS_BASE}/pp2.png`,
  },
  {
    id: "scientific-hobbyist",
    title: "The Scientific Hobbyist",
    body: "Perfect for dialing in specialized environments. Whether you are balancing precise light exposure, tracking nutrient solutions for a hydroponic setup, or nurturing rare cuttings, Twinly's AI acts as your meticulous lab notebook.",
    mascotSrc: `${PLANT_PARENTS_BASE}/pp3.png`,
  },
  {
    id: "busy-collector",
    title: "The Busy Collector",
    body: "Got 50+ plants and a busy life? Let the intelligence engine remember the details. Twinly alerts you only when someone needs urgent attention, ensuring no leaf gets left behind.",
    mascotSrc: `${PLANT_PARENTS_BASE}/pp4.png`,
  },
];

export const PLANT_PARENTS_SUBHEADER =
  "More than just a disease scanner. Twinly remembers your plant's journey, tracks its health, and predicts its future using advanced AI.";
