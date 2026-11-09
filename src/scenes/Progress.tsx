import { useLayoutEffect, useRef } from "react";
import { gsap } from "../gsap-setup";
import { registerShot } from "../shots";

const STOPS = [
  { name: "Brief", day: "Hari 1" },
  { name: "Wireframe", day: "Hari 3" },
  { name: "Desain", day: "Hari 7" },
  { name: "Live", day: "Hari 14" },
];

export function Progress() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const panels = section.querySelector(".panels") as HTMLElement;
      const fill = section.querySelector(".pfill") as HTMLElement;
      const stops = [...section.querySelectorAll<HTMLElement>(".stop i")];
      const lines = [...section.querySelectorAll<HTMLElement>(".type-line")];

      gsap.set(fill, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            stops.forEach((dot, i) => dot.classList.toggle("on", p + 1e-4 >= i / 3));
          },
        },
      });
      tl.to(panels, { xPercent: -75, ease: "none", duration: 1 }, 0);
      tl.to(fill, { scaleX: 1, ease: "none", duration: 1 }, 0);
      lines.forEach((line, i) => {
        tl.to(line, { scaleX: 1, ease: "none", duration: 0.08 }, 0.02 + i * 0.035);
      });

      registerShot("s4", () => {
        const st = tl.scrollTrigger;
        if (st) window.scrollTo(0, st.end);
      });
    });

    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const fill = section.querySelector(".pfill") as HTMLElement;
      const stops = [...section.querySelectorAll<HTMLElement>(".stop i")];
      const panels = [...section.querySelectorAll<HTMLElement>(".panel")];
      section.classList.add("scrubbed");
      gsap.set(fill, { scaleX: 0, transformOrigin: "left center" });
      const show = (n: number) => {
        panels.forEach((panel, i) => panel.classList.toggle("on", i === n));
      };
      show(0);
      const st = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            stops.forEach((dot, i) => dot.classList.toggle("on", p + 1e-4 >= i / 3));
            show(Math.min(3, Math.floor(p * 3 + 1e-4)));
          },
        },
      });
      st.to(fill, { scaleX: 1, ease: "none", duration: 1 }, 0);
      return () => section.classList.remove("scrubbed");
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="progress" id="proses" ref={root}>
      <div className="progress-pin">
        <h2>
          Progres jelas
          <br />
          dari brief sampai website live.
        </h2>
        <div className="ptrack">
          <div className="pline">
            <div className="pfill" />
          </div>
          <div className="stops">
            {STOPS.map((s) => (
              <div className="stop" key={s.name}>
                <i />
                <b>{s.name}</b>
                <small>{s.day}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="panels-clip">
          <div className="panels">
            <article className="panel on">
              <div className="sheet brief">
                <h3>Brief</h3>
                {[
                  ["Nama bisnis", 72],
                  ["Kebutuhan", 84],
                  ["Referensi", 48],
                  ["Deadline", 36],
                ].map(([label, w]) => (
                  <label key={String(label)}>
                    {label}
                    <span>
                      <i className="type-line" style={{ width: `${w}%` }} />
                      {label === "Deadline" ? <em className="caret" /> : null}
                    </span>
                  </label>
                ))}
              </div>
            </article>
            <article className="panel">
              <div className="sheet wire">
                <div className="w-top">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="w-hero" />
                <div className="w-row">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="w-bot">
                  <i />
                  <i />
                </div>
              </div>
            </article>
            <article className="panel">
              <div className="sheet design">
                <div className="d-hero">
                  <span />
                  <span />
                  <b />
                </div>
                <div className="d-row">
                  <i />
                  <i className="photo" />
                  <i />
                </div>
              </div>
            </article>
            <article className="panel">
              <div className="sheet live">
                <div className="urlbar">
                  <i className="live-dot" />
                  namabisnis.com
                </div>
                <img src="/work/ewooth.jpg" alt="Pratinjau website namabisnis.com" />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
