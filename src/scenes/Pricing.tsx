import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../gsap-setup";
import { registerShot, WA } from "../shots";

const PLANS = [
  {
    id: "landing",
    name: "Landing Page",
    price: "Rp 800rb",
    cta: "Pilih Landing Page",
    features: ["1 halaman fokus penawaran", "Desain responsif", "Tombol WhatsApp", "Revisi 2 kali", "Pengerjaan 7–14 hari"],
  },
  {
    id: "compro",
    name: "Company Profile",
    price: "Rp 1jt",
    cta: "Pilih Company Profile",
    popular: true,
    features: ["Hingga 5 halaman", "Profil bisnis lengkap", "Desain custom", "Formulir & WhatsApp", "Revisi 3 kali", "Pengerjaan 7–14 hari"],
  },
  {
    id: "redesign",
    name: "Redesign Halaman",
    price: "Rp 800rb",
    cta: "Pilih Redesign Halaman",
    features: ["Tampilan baru halaman utama", "Struktur halaman tetap", "Desain lebih modern", "Tampilan mobile diperbaiki", "Revisi 2 kali"],
  },
];

export function Pricing() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    const cards = [...section.querySelectorAll<HTMLElement>(".hanger")];
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const shake = (card: HTMLElement) => {
        gsap.fromTo(
          card,
          { rotation: -1.8 },
          { rotation: 0, duration: 0.38, ease: "power2.out", overwrite: "auto", transformOrigin: "top center" },
        );
      };
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        once: true,
        onEnter: () => cards.forEach((card, i) => gsap.delayedCall(i * 0.07, () => shake(card))),
      });
      const enter = (card: HTMLElement) => () => shake(card);
      const leave = (card: HTMLElement) => () => {
        gsap.to(card, { rotation: 0, y: 0, duration: 0.2, ease: "power2.out", overwrite: "auto" });
      };
      const offs = cards.map((card) => {
        const on = enter(card);
        const off = leave(card);
        card.addEventListener("pointerenter", on);
        card.addEventListener("pointerleave", off);
        return () => {
          card.removeEventListener("pointerenter", on);
          card.removeEventListener("pointerleave", off);
        };
      });
      registerShot("s7", () => {
        gsap.set(cards, { rotation: 0, y: 0 });
        window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - 10);
      });
      return () => {
        st.kill();
        offs.forEach((fn) => fn());
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="pricing" id="harga" ref={root}>
      <div className="pricing-inner">
        <div className="price-head">
          <h2>
            Pilih paket yang pas
            <br />
            untuk bisnismu.
          </h2>
          <p>Harga sekali bayar, ditulis dari awal supaya tidak ada biaya tersembunyi.</p>
        </div>
        <div className="price-rail" aria-hidden="true" />
        <div className="price-row">
          {PLANS.map((plan) => (
            <article className={`hanger${plan.popular ? " popular" : ""}`} key={plan.id}>
              <span className="ring" />
              <div className="pcard">
                {plan.popular ? <span className="badge">Paling diminati</span> : null}
                <h3>{plan.name}</h3>
                <p className="price">{plan.price}</p>
                <ul>
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a className={`btn btn-plan${plan.popular ? "" : " btn-primary"}`} href={WA} target="_blank" rel="noreferrer">
                  {plan.cta}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
