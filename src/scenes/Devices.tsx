import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../gsap-setup";
import { registerShot, shot } from "../shots";

const DESKTOP = [
  { w: 270, h: 548, r: 40, cols: "1", base: 0, stand: 0, label: "390 px" },
  { w: 460, h: 600, r: 28, cols: "2", base: 0, stand: 0, label: "820 px" },
  { w: 860, h: 500, r: 16, cols: "3", base: 1, stand: 0, label: "1280 px" },
  { w: 1000, h: 548, r: 12, cols: "3", base: 0, stand: 1, label: "1920 px" },
];

const MOBILE = [
  { w: 342, h: 560, r: 36, cols: "1", base: 0, stand: 0, label: "390 px" },
  { w: 342, h: 460, r: 26, cols: "2", base: 0, stand: 0, label: "820 px" },
  { w: 342, h: 214, r: 14, cols: "3", base: 1, stand: 0, label: "1280 px" },
];

function fitDesktop(s: (typeof DESKTOP)[number]) {
  const maxW = Math.min(window.innerWidth - 96, 1040);
  const maxH = Math.max(280, window.innerHeight - 300);
  const k = Math.min(1, maxW / 1000, maxH / 640);
  return { ...s, w: Math.round(s.w * k), h: Math.round(s.h * k) };
}

function fitMobile(s: (typeof MOBILE)[number]) {
  const maxW = Math.min(342, window.innerWidth - 28);
  const maxH = Math.max(360, window.innerHeight - 250);
  const k = Math.min(1, maxW / s.w, maxH / s.h);
  const w = Math.round(s.w * k);
  const h = Math.round(s.h * k);
  const r = Math.min(Math.round(s.r * k), Math.round(Math.min(w, h) * 0.12));
  return { ...s, w, h, r };
}

export function Devices() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    const frame = section.querySelector(".device-frame") as HTMLElement;
    const col = section.querySelector(".device-col") as HTMLElement;
    const base = section.querySelector(".device-base") as HTMLElement;
    const stand = section.querySelector(".device-stand") as HTMLElement;
    const label = section.querySelector(".device-width") as HTMLElement;
    const dots = [...section.querySelectorAll<HTMLElement>(".device-steps i")];

    const mm = gsap.matchMedia();
    let loop: gsap.core.Timeline | null = null;

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const apply = (index: number, animate = false) => {
        const s = fitDesktop(DESKTOP[Math.max(0, Math.min(3, index))]);
        const set = animate ? gsap.to : gsap.set;
        set(col, { width: s.w, duration: 0.9, ease: "expo.inOut" });
        set(frame, { width: s.w, height: s.h, borderRadius: s.r, duration: 0.9, ease: "expo.inOut" });
        set(base, { scaleX: s.base, autoAlpha: s.base, duration: 0.5, ease: "power3.out" });
        set(stand, { scaleY: s.stand, autoAlpha: s.stand, duration: 0.5, ease: "power3.out" });
        frame.dataset.cols = s.cols;
        label.textContent = s.label;
        dots.forEach((d, i) => d.classList.toggle("on", i === index));
      };
      const playLoop = () => {
        loop?.kill();
        loop = gsap.timeline({ repeat: -1 });
        const order = [3, 0, 1, 2, 3];
        order.forEach((step, i) => {
          if (i === 0) return;
          loop!.call(() => apply(step, true), undefined, (i - 1) * 1.5);
        });
      };
      apply(0);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=240%",
          pin: true,
          scrub: 1,
          onLeave: () => {
            if (!shot) playLoop();
          },
          onEnterBack: () => {
            loop?.kill();
            loop = null;
          },
          onUpdate: (self) => {
            if (loop) return;
            const idx = Math.min(3, Math.floor(self.progress * 3.999));
            apply(idx);
          },
        },
      });
      tl.to({}, { duration: 1 });
      registerShot("s3", () => {
        loop?.kill();
        apply(3);
        const st = tl.scrollTrigger;
        if (st) window.scrollTo(0, st.end);
      });
    });

    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      let current = 0;
      const apply = (index: number, animate = false) => {
        current = index;
        const s = fitMobile(MOBILE[index]);
        const set = animate ? gsap.to : gsap.set;
        set(col, { width: s.w, duration: 0.7, ease: "expo.inOut" });
        set(frame, { width: s.w, height: s.h, borderRadius: s.r, duration: 0.7, ease: "expo.inOut" });
        set(base, {
          height: s.base ? 16 : 0,
          scaleX: 1,
          autoAlpha: s.base,
          duration: 0.4,
          ease: "power3.out",
        });
        set(stand, { scaleY: 0, autoAlpha: 0, duration: 0.2 });
        frame.dataset.cols = s.cols;
        label.textContent = s.label;
        dots.forEach((d, i) => d.classList.toggle("on", i === index));
      };
      apply(0, false);
      const playLoop = () => {
        loop?.kill();
        loop = gsap.timeline({ repeat: -1 });
        loop.to({}, { duration: 2 });
        loop.call(() => apply(1, true));
        loop.to({}, { duration: 2 });
        loop.call(() => apply(2, true));
        loop.to({}, { duration: 2 });
        loop.call(() => apply(0, true));
      };
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        end: "bottom 25%",
        onToggle: (self) => {
          if (self.isActive) playLoop();
          else loop?.pause();
        },
      });
      const onResize = () => apply(current, false);
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        st.kill();
      };
    });

    return () => {
      loop?.kill();
      mm.revert();
    };
  }, []);

  return (
    <section className="devices" id="perangkat" ref={root}>
      <div className="device-stage">
        <div className="device-head">
          <h2>
            Tampilan rapi
            <br />
            di HP, tablet, dan desktop.
          </h2>
          <div className="device-width">390 px</div>
        </div>
        <div className="device-wrap">
          <div className="device-col">
          <div className="device-frame" data-cols="1">
            <i className="cam" />
            <div className="screen">
              <div className="screen-hero">
                <span />
                <span />
                <b />
              </div>
              <div className="screen-cards">
                <div className="sc">
                  <i />
                  <span />
                  <span />
                </div>
                <div className="sc">
                  <i />
                  <span />
                  <span />
                </div>
                <div className="sc">
                  <i />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
          <div className="device-base" />
          <div className="device-stand">
            <i />
            <b />
          </div>
          </div>
        </div>
        <div className="device-steps" aria-hidden="true">
          <i className="on" />
          <i />
          <i />
          <i />
        </div>
      </div>
    </section>
  );
}
