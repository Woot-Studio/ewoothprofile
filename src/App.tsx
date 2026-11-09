import { useLayoutEffect } from "react";
import { ScrollTrigger } from "./gsap-setup";
import { runShot } from "./shots";
import { Header } from "./components/Header";
import { Intro } from "./components/Intro";
import { Hero } from "./scenes/Hero";
import { Devices } from "./scenes/Devices";
import { Progress } from "./scenes/Progress";
import { Support } from "./scenes/Support";
import { Services } from "./scenes/Services";
import { Pricing } from "./scenes/Pricing";
import { Work } from "./scenes/Work";
import { Contact } from "./scenes/Contact";

export function App() {
  useLayoutEffect(() => {
    const go = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      runShot();
    };
    go();
    document.fonts.ready.then(go);
    window.addEventListener("load", go);
    return () => window.removeEventListener("load", go);
  }, []);

  return (
    <>
      <a className="skip" href="#beranda">
        Langsung ke isi
      </a>
      <Intro />
      <Header />
      <main>
        <Hero />
        <Devices />
        <Progress />
        <Support />
        <Services />
        <Pricing />
        <Work />
        <Contact />
      </main>
    </>
  );
}
