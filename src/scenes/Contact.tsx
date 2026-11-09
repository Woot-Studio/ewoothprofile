import { useLayoutEffect, useRef } from "react";
import { gsap } from "../gsap-setup";
import { Logo } from "../components/Logo";
import { MAIL, registerShot, WA } from "../shots";

export function Contact() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const logo = section.querySelector(".contact-logo") as HTMLElement;
    const bits = section.querySelectorAll(".rise");
    const tl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: section,
        start: "top 68%",
        toggleActions: "play none none reverse",
      },
    });
    tl.from(logo, { y: -70, scale: 0.28, autoAlpha: 0, duration: 0.9, ease: "expo.inOut" });
    tl.from(bits, { y: 24, autoAlpha: 0, stagger: 0.06, duration: 0.45, ease: "power3.out" }, 0.28);
    tl.add(() => {
      const tag = section.querySelector(".logo-tag");
      if (!tag) return;
      gsap.fromTo(
        tag,
        { rotation: 10, svgOrigin: "166 275" },
        { rotation: 0, duration: 1.1, ease: "elastic.out(1, 0.45)", svgOrigin: "166 275" },
      );
    }, 0.85);

    const wa = section.querySelector(".cta-wa");
    const swing = () => {
      const tag = section.querySelector(".logo-tag");
      if (!tag) return;
      gsap.fromTo(tag, { rotation: -12, svgOrigin: "166 275" }, { rotation: 0, duration: 0.5, ease: "back.out(1.7)", svgOrigin: "166 275" });
    };
    wa?.addEventListener("pointerenter", swing);

    registerShot("s9", () => {
      tl.progress(1).pause();
      window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY);
    });
    return () => {
      wa?.removeEventListener("pointerenter", swing);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section className="contact" id="kontak" ref={root}>
      <div className="contact-inner">
        <div className="contact-logo">
          <Logo size={148} />
        </div>
        <h2 className="rise">
          Ceritakan kebutuhan
          <br />
          websitemu.
        </h2>
        <p className="rise lead">Konsultasi gratis, tanpa komitmen. Kami bantu dari konsep sampai website siap dipakai.</p>
        <div className="rise contact-ctas">
          <a className="btn btn-primary cta-wa" href={WA} target="_blank" rel="noreferrer">
            Chat via WhatsApp
          </a>
          <a className="btn btn-ghost" href={MAIL}>
            Kirim Email
          </a>
        </div>
        <ul className="rise contact-list">
          <li>
            <small>Email</small>
            <a href={MAIL}>ewoothstudio@gmail.com</a>
          </li>
          <li>
            <small>WhatsApp</small>
            <a href={WA} target="_blank" rel="noreferrer">
              +62 881-0806-64997
            </a>
          </li>
          <li>
            <small>Instagram</small>
            <a href="https://instagram.com/ewoothstudio" target="_blank" rel="noreferrer">
              @ewoothstudio
            </a>
          </li>
        </ul>
      </div>
      <footer className="footer">
        <span>© 2026 Ewooth Studio. Hak cipta dilindungi.</span>
        <span>Kami bantu bisnis lokal tampil lebih meyakinkan di internet.</span>
      </footer>
    </section>
  );
}
