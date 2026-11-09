import { useLayoutEffect, useRef } from "react";
import { gsap } from "../gsap-setup";
import { Logo } from "./Logo";
import { skipIntro } from "../shots";

export function Intro() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = root.current;
    if (!el) return;
    if (skipIntro || reduce) {
      el.remove();
      window.dispatchEvent(new Event("intro:done"));
      return;
    }

    const shade = el.querySelector(".intro-shade") as HTMLElement;
    const logo = el.querySelector(".intro-logo") as HTMLElement;
    const count = el.querySelector(".load-count") as HTMLElement;
    const bar = el.querySelector(".progress-fill") as HTMLElement;
    const tag = el.querySelector(".logo-tag");
    const headerBtn = () => document.querySelector(".logo-btn") as HTMLElement | null;
    const revisited = sessionStorage.getItem("ewooth-intro") === "1";

    const place = () => {
      const btn = headerBtn();
      const lr = logo.getBoundingClientRect();
      const br = btn?.getBoundingClientRect();
      if (!br) return { x: 0, y: -window.innerHeight * 0.36, scale: 40 / 220, cy: 40 };
      const x = br.left + br.width / 2 - (lr.left + lr.width / 2);
      const y = br.top + br.height / 2 - (lr.top + lr.height / 2);
      const scale = br.width / lr.width;
      return { x, y, scale, cy: br.top + br.height / 2 };
    };

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("ewooth-intro", "1");
        document.querySelector(".logo-btn")?.classList.remove("waiting");
        el.remove();
        window.dispatchEvent(new Event("intro:done"));
      },
    });

    if (tag) gsap.set(tag, { svgOrigin: "166 275" });
    const swing =
      tag && !revisited
        ? gsap.to(tag, {
            rotation: 14,
            yoyo: true,
            repeat: -1,
            duration: 0.7,
            ease: "sine.inOut",
            svgOrigin: "166 275",
          })
        : null;

    const counter = { n: 0 };
    if (!revisited) {
      tl.to(
        counter,
        {
          n: 100,
          duration: 1.35,
          ease: "power1.inOut",
          onUpdate: () => {
            count.textContent = String(Math.round(counter.n)).padStart(3, "0");
            bar.style.transform = `scaleX(${counter.n / 100})`;
          },
        },
        0,
      );
    } else {
      count.parentElement?.setAttribute("hidden", "");
    }

    const morphAt = revisited ? 0.05 : 1.45;
    tl.add(() => swing?.kill(), morphAt);
    if (tag) tl.to(tag, { rotation: 0, duration: 0.3, ease: "back.out(2)", svgOrigin: "166 275" }, morphAt);
    tl.to(el.querySelector(".intro-meter"), { autoAlpha: 0, duration: 0.15 }, morphAt);

    tl.to(
      logo,
      {
        x: () => place().x,
        y: () => place().y,
        scale: () => place().scale,
        duration: revisited ? 0.4 : 0.7,
        ease: "expo.inOut",
      },
      morphAt + 0.12,
    );
    tl.to(
      shade,
      {
        clipPath: () => `circle(0px at 50% ${place().cy}px)`,
        duration: revisited ? 0.4 : 0.7,
        ease: "expo.inOut",
      },
      morphAt + 0.12,
    );
    tl.call(
        () => logo.querySelector(".logo")?.classList.remove("light"),
        undefined,
        morphAt + (revisited ? 0.4 : 0.68),
      );

    const lines = document.querySelectorAll("#beranda .ln");
    tl.from(
      lines,
      { y: 40, autoAlpha: 0, stagger: 0.08, duration: 0.6, ease: "power3.out" },
      morphAt + 0.55,
    );

    return () => {
      tl.kill();
      swing?.kill();
    };
  }, []);

  return (
    <div className="intro" ref={root}>
      <div className="intro-shade" />
      <div className="intro-logo light-wrap">
        <Logo size={window.innerWidth < 768 ? 150 : 220} light />
      </div>
      <div className="intro-meter">
        <div className="load-count">000</div>
        <div className="progress-track-mini">
          <div className="progress-fill" />
        </div>
      </div>
    </div>
  );
}
