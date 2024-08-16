import { Shadows_Into_Light, Itim, Inter } from "next/font/google";

const sansFont = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const scriptFont = Shadows_Into_Light({
  subsets: ["latin"],
  weight: ["400"],
});

const thaiFont = Itim({
  subsets: ["latin"],
  weight: ["400"],
});

export { sansFont, scriptFont, thaiFont };
