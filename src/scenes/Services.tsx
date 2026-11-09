import { useLayoutEffect, useRef } from "react";
import { gsap } from "../gsap-setup";
import { registerShot } from "../shots";

const ITEMS = [
  {
    title: "Website Company Profile",
    body: "Kenalkan bisnis, layanan, dan kredibilitas perusahaan dalam satu website yang rapi dan mudah dipercaya.",
  },
  {
    title: "Landing Page",
    body: "Satu halaman yang fokus ke penawaran. Cocok untuk kampanye, promo, dan meningkatkan konversi.",
  },
  {
    title: "Redesign Website",
    body: "Perbarui tampilan website lama supaya lebih modern, cepat, dan nyaman dipakai di semua perangkat.",
  },
];

export function Services() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const items = [...section.querySelectorAll<HTMLElement>(".sitem")];
      const layers = [...section.querySelectorAll<HTMLElement>(".slayer")];
      const redesign = section.querySelector(".redesign") as HTMLElement;
      const setActive = (n: number) => {
        items.forEach((el, i) => el.classList.toggle("on", i === n));
      };
      setActive(0);
      gsap.set(layers[1], { autoAlpha: 0 });
      gsap.set(layers[2], { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=270%",
          pin: true,
          scrub: 1,
          snap: { snapTo: 1 / 2, duration: 0.35, ease: "power2.inOut" },
          onUpdate: (self) => setActive(Math.min(2, Math.floor(self.progress * 3))),
        },
      });
      tl.to(layers[1], { autoAlpha: 1, duration: 0.08 }, 0.3);
      tl.to(layers[0], { autoAlpha: 0, duration: 0.08 }, 0.3);
      tl.to(layers[2], { autoAlpha: 1, duration: 0.08 }, 0.64);
      tl.to(layers[1], { autoAlpha: 0, duration: 0.08 }, 0.64);
      const split = { v: 80 };
      tl.to(
        split,
        {
          v: 20,
          duration: 0.3,
          ease: "none",
          onUpdate: () => redesign.style.setProperty("--split", `${split.v.toFixed(1)}%`),
        },
        0.66,
      );

      const knob = section.querySelector(".handle") as HTMLElement;
      const move = (clientX: number) => {
        const r = redesign.getBoundingClientRect();
        const p = Math.min(0.85, Math.max(0.12, (clientX - r.left) / r.width));
        redesign.style.setProperty("--split", `${(p * 100).toFixed(1)}%`);
      };
      const down = (e: PointerEvent) => {
        knob.setPointerCapture(e.pointerId);
        const go = (ev: PointerEvent) => move(ev.clientX);
        const up = () => {
          knob.removeEventListener("pointermove", go);
          knob.removeEventListener("pointerup", up);
        };
        knob.addEventListener("pointermove", go);
        knob.addEventListener("pointerup", up);
      };
      knob.addEventListener("pointerdown", down);

      registerShot("s6", () => {
        const st = tl.scrollTrigger;
        if (st) window.scrollTo(0, st.end);
      });
      return () => knob.removeEventListener("pointerdown", down);
    });

    mm.add("(max-width: 767px)", () => {
      const items = [...section.querySelectorAll<HTMLElement>(".sitem")];
      const layers = [...section.querySelectorAll<HTMLElement>(".slayer")];
      const setActive = (n: number) => {
        items.forEach((el, i) => {
          const on = i === n;
          el.classList.toggle("on", on);
          el.setAttribute("aria-selected", on ? "true" : "false");
        });
        layers.forEach((el, i) => el.classList.toggle("on", i === n));
      };
      setActive(0);
      const offs = items.map((el, i) => {
        const fn = () => setActive(i);
        el.addEventListener("click", fn);
        return () => el.removeEventListener("click", fn);
      });
      return () => offs.forEach((fn) => fn());
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="services" id="layanan" ref={root}>
      <div className="services-pin">
        <h2>
          Solusi website
          <br />
          sesuai kebutuhanmu.
        </h2>
        <div className="services-grid">
          <div className="slist" role="tablist" aria-label="Jenis website">
            {ITEMS.map((item, i) => (
              <button
                type="button"
                role="tab"
                className={`sitem${i === 0 ? " on" : ""}`}
                aria-selected={i === 0}
                key={item.title}
              >
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </button>
            ))}
          </div>
          <div className="sbrowser">
            <div className="slayer compro on">
              <div className="mock-nav">
                <i />
                <b />
              </div>
              <div className="mock-hero">
                <span />
                <span />
                <em />
              </div>
              <div className="mock-row">
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="slayer landing">
              <div className="offer">
                <strong>Penawaran</strong>
                <label>Nama bisnis</label>
                <span />
                <label>WhatsApp</label>
                <span />
                <label>Kebutuhan</label>
                <span className="tall" />
                <b>Kirim penawaran</b>
              </div>
            </div>
            <div className="slayer redesign" style={{ ["--split" as string]: "80%" }}>
              <div className="before">
                <div className="old-nav" />
                <div className="old-grid">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="after">
                <div className="new-nav">
                  <b />
                </div>
                <div className="new-hero" />
                <div className="new-cards">
                  <i />
                  <i />
                </div>
              </div>
              <div className="handle">
                <i />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
