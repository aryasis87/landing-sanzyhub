import { Cara, FAQ, Hero, Katalog, LisensiRingkas } from "./components/Beranda";

export default function Home() {
  return (
    <main>
      <Hero />
      <Katalog />
      <Cara />
      <LisensiRingkas />
      <FAQ />
    </main>
  );
}
