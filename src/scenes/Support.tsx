import { useLayoutEffect, useRef } from "react";
import { gsap } from "../gsap-setup";
import { registerShot } from "../shots";

export function Support() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
    const client = section.querySelector(".msg-client");
    const typing = section.querySelector(".msg-typing");
    const reply = section.querySelector(".msg-reply");
    const banner = section.querySelector(".banner-new");
    const preview = section.querySelector(".mc-preview");
    const status = section.querySelector(".support-status");

    gsap.set(client, { autoAlpha: 0, y: 18 });
    gsap.set(typing, { autoAlpha: 0 });
    gsap.set(reply, { autoAlpha: 0, y: 16 });
    gsap.set([banner, preview], { clipPath: "inset(0 100% 0 0)" });
    gsap.set(status, { autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=140%",
        pin: true,
        scrub: true,
      },
    });
    tl.to(client, { autoAlpha: 1, y: 0, duration: 0.18 }, 0);
    tl.to(typing, { autoAlpha: 1, duration: 0.1 }, 0.22);
    tl.to(typing, { autoAlpha: 0, duration: 0.08 }, 0.4);
    tl.to(reply, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.46);
    tl.to(banner, { clipPath: "inset(0 0% 0 0)", duration: 0.18 }, 0.5);
    tl.to(preview, { clipPath: "inset(0 0% 0 0)", duration: 0.18 }, 0.52);
    tl.to(status, { autoAlpha: 1, duration: 0.14 }, 0.78);

    registerShot("s5", () => {
      const st = tl.scrollTrigger;
      if (st) window.scrollTo(0, st.end);
    });

    });
    return () => mm.revert();
  }, []);

  return (
    <section className="support" id="dukungan" ref={root}>
      <div className="support-inner">
        <h2>
          Dukungan
          <br />
          setelah website diluncurkan.
        </h2>
        <div className="support-grid">
          <div className="support-site">
            <div className="mock">
              <div className="mock-bar" />
              <div className="mock-banner">
                <div className="banner-old">
                  <span />
                  <span />
                  <b />
                </div>
                <div className="banner-new">
                  <span />
                  <span />
                  <b />
                </div>
              </div>
              <div className="mock-rule" />
              <div className="mock-cards">
                <div className="mc" />
                <div className="mc mc-frame">
                  <div className="mc-preview">
                    <small>Ewooth</small>
                    <strong>
                      Wujudkan
                      <br />
                      Website Impian
                      <br />
                      untuk Bisnismu
                    </strong>
                  </div>
                </div>
                <div className="mc" />
              </div>
            </div>
            <p className="support-status">
              <i /> Banner promo diperbarui di website
            </p>
          </div>
          <div className="chat">
            <div className="msg msg-client">
              <span className="ava">K</span>
              <div className="bubble">
                Kak, banner promonya mau diganti yang baru ya.
                <time>10.12</time>
              </div>
            </div>
            <div className="msg msg-typing">
              <span className="ava ghost" />
              <div className="bubble dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="msg msg-reply">
              <div className="bubble">
                Siap, sudah diganti. Cek lagi ya.
                <time>10.40</time>
              </div>
              <span className="ava logo-ava">
                <img src="/favicon.png" alt="" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
