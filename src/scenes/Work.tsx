import { useLayoutEffect, useRef } from "react";
import { gsap } from "../gsap-setup";
import { registerShot } from "../shots";

const PROJECTS = [
  {
    slug: "ewooth",
    name: "Ewooth Studio",
    type: "Company profile",
    href: "https://ewoot.my.id/",
    img: "/work/ewooth.jpg",
    cta: "Buka Ewooth Studio",
  },
  {
    slug: "pull",
    name: "PULL",
    type: "Landing page",
    href: "https://pull-landing-page.vercel.app/",
    img: "/work/pull.jpg",
    cta: "Buka PULL",
  },
  {
    slug: "cocopra",
    name: "Cocopra",
    type: "Landing page",
    konsep: true,
    href: "https://cocopra-id.vercel.app/",
    img: "/work/cocopra.jpg",
    cta: "Buka Cocopra",
  },
];

export function Work() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const slides = [...section.querySelectorAll<HTMLElement>(".wslide")];
      gsap.set(slides.slice(1), { yPercent: 100 });
      gsap.set(section.querySelectorAll(".crop"), { autoAlpha: 0 });
      gsap.set(section.querySelectorAll(".work-cta"), { autoAlpha: 0, y: 8 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=480%",
          pin: true,
          scrub: 1,
        },
      });
      slides.forEach((slide, i) => {
        const t = i;
        const shot = slide.querySelector(".shot");
        const off = slide.querySelector(".screen-off");
        const crops = slide.querySelectorAll(".crop");
        const cta = slide.querySelector(".work-cta");
        tl.to(off, { autoAlpha: 0, duration: 0.16, ease: "expo.out" }, t);
        const travel = slide.getAttribute("data-slug") === "pull" ? 0 : -28;
        tl.to(shot, { yPercent: travel, ease: "none", duration: 0.42 }, t + 0.16);
        tl.fromTo(crops[0], { x: 0, autoAlpha: 0, scale: 0.9 }, { x: -70, autoAlpha: 1, scale: 1, duration: 0.18, ease: "power3.out" }, t + 0.58);
        tl.fromTo(crops[1], { x: 0, autoAlpha: 0, scale: 0.9 }, { x: 70, autoAlpha: 1, scale: 1, duration: 0.18, ease: "power3.out" }, t + 0.62);
        tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.14 }, t + 0.66);
        if (i < slides.length - 1) {
          tl.to(slide, { yPercent: -100, ease: "none", duration: 0.22 }, t + 0.78);
          tl.to(slides[i + 1], { yPercent: 0, ease: "none", duration: 0.22 }, t + 0.78);
        }
      });
      registerShot("s8", () => {
        const st = tl.scrollTrigger;
        if (st) window.scrollTo(0, st.end);
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="work" id="portofolio" ref={root}>
      <div className="work-stage">
        {PROJECTS.map((p, i) => (
          <article className="wslide" data-slug={p.slug} key={p.slug}>
            <div className="wtop">
              <p>Hasil karya kami.</p>
              <span>
                {String(i + 1).padStart(2, "0")}/{String(PROJECTS.length).padStart(2, "0")}
              </span>
            </div>
            <div className="wcopy">
              <h3>{p.name}</h3>
              <p className="wtype">
                {p.type}
                {p.konsep ? <span className="konsep">Konsep</span> : null}
              </p>
              <a className="btn btn-primary work-cta" href={p.href} target="_blank" rel="noreferrer">
                {p.cta}
              </a>
            </div>
            <div className="laptop">
              <div className="laptop-screen">
                <img className="shot" src={p.img} alt="" />
                <div className="screen-off">
                  <img src="/favicon.png" alt="" />
                </div>
              </div>
              <div className="crop c1" style={{ backgroundImage: `url(${p.img})` }} />
              <div className="crop c2" style={{ backgroundImage: `url(${p.img})` }} />
              <div className="laptop-base" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
