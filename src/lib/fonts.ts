import localFont from "next/font/local";
import { Poppins } from "next/font/google";

export const lostTumbler = localFont({
  src: "../../public/fonts/Lost Tumbler.ttf",
  variable: "--font-lost-tumbler",
  display: "swap",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
  display: "swap",
});
