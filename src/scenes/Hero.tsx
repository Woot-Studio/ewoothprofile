import { useLayoutEffect, useRef } from "react";
import { Draggable, gsap } from "../gsap-setup";
import { registerShot, WA } from "../shots";

const ORDER = ["nav", "hero", "price", "form", "lines", "mini", "wa"] as const;

const SCATTER: Record<string, { x: number; y: number; w: number; h: number; r: number }> = {
  nav: { x: 0.74, y: 0.18, w: 230, h: 52, r: -6 },
  hero: { x: 0.72, y: 0.3, w: 270, h: 160, r: 7 },
  price: { x: 0.8, y: 0.54, w: 186, h: 108, r: 5 },
  wa: { x: 0.55, y: 0.58, w: 196, h: 46, r: -8 },
  mini: { x: 0.46, y: 0.7, w: 200, h: 136, r: -12 },
  form: { x: 0.68, y: 0.68, w: 186, h: 116, r: 4 },
  lines: { x: 0.84, y: 0.66, w: 156, h: 120, r: 8 },
};

function Art({ id }: { id: string }) {
  if (id === "nav") {
    return (
      <div className="art art-nav">
        <span className="dash" />
        <span className="rule" />
        <span className="pill-dot" />
      </div>
    );
  }
  if (id === "hero") {
    return (
      <div className="art art-hero">
        <span className="ln a" />
        <span className="ln b" />
        <span className="ln c" />
        <span className="pill-dot" />
      </div>
    );
  }
  if (id === "price") {
    return (
      <div className="art art-price">
        <small>Company Profile</small>
        <strong>Rp 1jt</strong>
        <span className="rule" />
      </div>
    );
  }
  if (id === "wa") {
    return <div className="art art-wa">Chat via WhatsApp</div>;
  }
  if (id === "mini") {
    return (
      <div className="art art-mini">
        <small>Ewooth Studio</small>
        <strong>
          Wujudkan
          <br />
          Website Impian
          <br />
          untuk Bisnismu
        </strong>
        <span className="pill-dot" />
      </div>
    );
  }
  if (id === "form") {
    return (
      <div className="art art-form">
        <small>Nama bisnis</small>
        <span className="field" />
        <span className="pill-dot" />
      </div>
    );
  }
  return (
    <div className="art art-lines">
      <span className="bar" />
      <span className="rule" />
      <span className="rule short" />
      <span className="rule" />
    </div>
  );
}

function splitChars(root: HTMLElement) {
  const nodes: Text[] = [];
  const walk = (n: Node) => {
    n.childNodes.forEach((c) => {
      if (c.nodeType === Node.TEXT_NODE && c.textContent) nodes.push(c as Text);
      else if (c.nodeType === Node.ELEMENT_NODE && (c as HTMLElement).tagName !== "BR") walk(c);
    });
  };
  walk(root);
  nodes.forEach((tn) => {
    const frag = document.createDocumentFragment();
    for (const ch of tn.textContent ?? "") {
      if (ch === " ") {
        frag.append(" ");
        continue;
      }
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = ch;
      frag.append(s);
    }
    tn.parentNode?.replaceChild(frag, tn);
  });
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const stage = section.querySelector(".stage") as HTMLElement;
      const copy = section.querySelector(".copy") as HTMLElement;
      const h1 = section.querySelector(".desk-lines") as HTMLElement;
      const body = section.querySelector(".hero-body") as HTMLElement;
      const ctas = section.querySelector(".hero-ctas") as HTMLElement;
      const browser = section.querySelector(".browser") as HTMLElement;
      const tiles = ORDER.map((id) => section.querySelector(`.tile[data-id="${id}"]`) as HTMLElement);

      if (!h1.querySelector(".ch")) splitChars(h1);

      const k = Math.min(1.12, Math.max(0.72, window.innerWidth / 1280));
      const stageBox = () => stage.getBoundingClientRect();

      const browserBox = () => browser.getBoundingClientRect();
      const slots = tiles.map((tile) => {
        const b = browserBox();
        const r = tile.getBoundingClientRect();
        return { left: r.left - b.left, top: r.top - b.top, width: r.width, height: r.height };
      });

      tiles.forEach((tile, i) => {
        const sc = SCATTER[ORDER[i]];
        const s = stageBox();
        const b = browserBox();
        gsap.set(tile, {
          position: "absolute",
          left: sc.x * s.width - (b.left - s.left),
          top: sc.y * s.height - (b.top - s.top),
          width: sc.w * k,
          height: sc.h * k,
          rotation: sc.r,
          zIndex: 5,
        });
      });

      const dx = () => {
        const s = stageBox();
        const c = copy.getBoundingClientRect();
        const target = Math.max(28, s.width * 0.055);
        return target - (c.left - s.left);
      };

      const chrome = section.querySelector(".browser-chrome") as HTMLElement;
      browser.style.setProperty("--skin", "0");
      gsap.set(chrome, { autoAlpha: 0 });
      gsap.set(h1, { color: "#17324A" });
      gsap.set(copy, { x: dx(), y: 36 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            browser.style.setProperty("--skin", self.progress.toFixed(3));
          },
        },
      });

      tl.to(copy, { x: 0, y: 0, duration: 1 }, 0);
      tl.to(h1, { color: "#B5BFC8", duration: 1 }, 0);
      tl.to([body, ctas], { autoAlpha: 0, duration: 0.55 }, 0);
      tl.to(chrome, { autoAlpha: 1, duration: 0.7 }, 0.15);

      tiles.forEach((tile, i) => {
        const slot = slots[i];
        tl.to(
          tile,
          {
            left: slot.left,
            top: slot.top,
            width: slot.width,
            height: slot.height,
            rotation: 0,
            duration: 1,
          },
          0,
        );
      });

      const drifts = tiles.map((tile, i) =>
        gsap.to(tile.querySelector(".drift"), {
          y: i % 2 === 0 ? 8 : -8,
          duration: 4.2 + (i % 4) * 0.45,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.25,
        }),
      );

      const drags = tiles.map((tile) => {
        const handle = tile.querySelector(".tile-drag") as HTMLElement;
        const [d] = Draggable.create(handle, {
          type: "x,y",
          bounds: stage,
          onRelease() {
            gsap.to(handle, { x: 0, y: 0, duration: 0.55, ease: "back.out(1.7)" });
          },
        });
        return d;
      });

      const quicks = tiles.map((tile) => {
        const handle = tile.querySelector(".tile-drag") as HTMLElement;
        return {
          x: gsap.quickTo(handle, "x", { duration: 0.45, ease: "power3.out" }),
          y: gsap.quickTo(handle, "y", { duration: 0.45, ease: "power3.out" }),
          el: handle,
        };
      });

      const chars = [...h1.querySelectorAll<HTMLElement>(".ch")];
      const weights = chars.map(() => 800);
      let px = window.innerWidth / 2;
      let py = window.innerHeight / 2;
      let raf = 0;

      const tick = () => {
        const p = tl.progress();
        chars.forEach((ch, i) => {
          const r = ch.getBoundingClientRect();
          const dist = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
          const target = dist < 140 ? 200 + (600 * dist) / 140 : 800;
          weights[i] += (target - weights[i]) * 0.15;
          ch.style.fontVariationSettings = `"wght" ${weights[i].toFixed(1)}`;
        });
        if (p < 0.04) {
          tiles.forEach((tile, i) => {
            const r = tile.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const dxr = px - cx;
            const dyr = py - cy;
            const dist = Math.hypot(dxr, dyr) || 1;
            if (dist < 170 && !drags[i].isDragging) {
              const f = (1 - dist / 170) * 40;
              quicks[i].x((-dxr / dist) * f);
              quicks[i].y((-dyr / dist) * f);
            } else if (!drags[i].isDragging && dist >= 170) {
              quicks[i].x(0);
              quicks[i].y(0);
            }
          });
          drifts.forEach((d) => d.resume());
        } else {
          drifts.forEach((d) => d.pause());
          drags.forEach((d, i) => {
            d.disable();
            gsap.set(quicks[i].el, { x: 0, y: 0 });
          });
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      const onPtr = (e: PointerEvent) => {
        px = e.clientX;
        py = e.clientY;
        const eyeMove = (eye: Element) => {
          const svg = (eye as SVGGraphicsElement).ownerSVGElement;
          if (!svg) return;
          const b = svg.getBoundingClientRect();
          const ox = Math.max(-2, Math.min(2, (e.clientX - (b.left + b.width / 2)) / 70));
          const oy = Math.max(-2, Math.min(2, (e.clientY - (b.top + b.height / 2)) / 90));
          (eye as HTMLElement).style.transform = `translate(${ox}px, ${oy}px)`;
        };
        document.querySelectorAll(".logo-eye").forEach(eyeMove);
      };
      window.addEventListener("pointermove", onPtr);

      const onTap = (e: Event) => {
        const t = e.currentTarget as HTMLElement;
        gsap.fromTo(t, { scale: 0.96 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
      };
      tiles.forEach((t) => t.addEventListener("pointerdown", onTap));

      registerShot("s2", () => {
        const st = tl.scrollTrigger;
        if (st) window.scrollTo(0, st.end);
      });

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onPtr);
        tiles.forEach((t) => t.removeEventListener("pointerdown", onTap));
        drags.forEach((d) => d.kill());
        drifts.forEach((d) => d.kill());
      };
    });

    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const h1 = section.querySelector("h1") as HTMLElement;
      const body = section.querySelector(".hero-body") as HTMLElement;
      const ctas = section.querySelector(".hero-ctas") as HTMLElement;
      const browser = section.querySelector(".browser") as HTMLElement;
      const grid = section.querySelector(".browser-grid") as HTMLElement;
      const tiles = ORDER.map((id) => section.querySelector(`.tile[data-id="${id}"]`) as HTMLElement);
      const rots = [-7, 6, -3, -4, 5, 4, -4];

      const boxOf = (el: HTMLElement) => {
        const prev = el.style.transform;
        el.style.transform = "none";
        const r = el.getBoundingClientRect();
        const g = grid.getBoundingClientRect();
        const cs = getComputedStyle(grid);
        const left = r.left - g.left - parseFloat(cs.paddingLeft);
        const top = r.top - g.top - parseFloat(cs.paddingTop);
        el.style.transform = prev;
        return { left, top, width: r.width, height: r.height };
      };

      const start = tiles.map(boxOf);
      const clusterH = browser.offsetHeight;
      const headH = h1.getBoundingClientRect().height;
      const endH = Math.max(360, Math.min(540, window.innerHeight - 96 - headH - 20));
      browser.style.setProperty("--end-h", `${endH}px`);
      browser.classList.add("phone");
      const slots = tiles.map(boxOf);
      browser.classList.remove("phone");

      gsap.set(browser, { height: clusterH });
      gsap.set([body, ctas], { overflow: "hidden" });
      gsap.set(body, { height: body.offsetHeight });
      gsap.set(ctas, { height: ctas.offsetHeight });
      tiles.forEach((tile, i) => {
        gsap.set(tile, {
          position: "absolute",
          gridArea: "auto",
          zIndex: 2,
          rotation: rots[i],
          ...start[i],
        });
      });
      browser.style.setProperty("--skin", "0");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: true,
          onUpdate: (self) => browser.style.setProperty("--skin", self.progress.toFixed(3)),
        },
      });
      tl.to(browser, { height: endH, duration: 1 }, 0);
      tl.to(h1, { color: "#B5BFC8", duration: 1 }, 0);
      tl.to([body, ctas], { autoAlpha: 0, height: 0, marginTop: 0, duration: 0.22 }, 0);
      tiles.forEach((tile, i) => {
        tl.to(tile, { ...slots[i], rotation: 0, duration: 1 }, 0);
      });

      const drifts = tiles.map((tile, i) =>
        gsap.to(tile.querySelector(".drift"), {
          y: i % 2 === 0 ? 5 : -5,
          duration: 3.6 + (i % 3) * 0.4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        }),
      );
      const onScroll = () => {
        const moving = tl.progress() > 0.04;
        drifts.forEach((d) => (moving ? d.pause() : d.resume()));
      };
      tl.eventCallback("onUpdate", onScroll);

      const onTap = (e: Event) => {
        const drag = (e.currentTarget as HTMLElement).querySelector(".tile-drag");
        if (!drag || tl.progress() > 0.2) return;
        gsap.fromTo(drag, { scale: 0.96 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
      };
      tiles.forEach((t) => t.addEventListener("pointerdown", onTap));

      registerShot("s2", () => {
        const st = tl.scrollTrigger;
        if (st) window.scrollTo(0, st.end);
      });

      return () => {
        tiles.forEach((t) => t.removeEventListener("pointerdown", onTap));
        drifts.forEach((d) => d.kill());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="hero" id="beranda" ref={root}>
      <div className="stage">
        <div className="copy">
          <h1>
            <span className="desk-lines">
              <span className="ln">Wujudkan website impian</span>
              <span className="ln">untuk bisnismu.</span>
            </span>
            <span className="mob-lines">
              <span className="ln">Wujudkan website</span>
              <span className="ln">impian untuk</span>
              <span className="ln">bisnismu.</span>
            </span>
          </h1>
          <p className="hero-body">
            Kami bantu UMKM dan bisnis lokal punya website profesional yang cepat, mudah dikelola, dan harganya jelas.
            Pengerjaan 7–14 hari kerja.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href={WA} target="_blank" rel="noreferrer">
              Konsultasi Gratis
            </a>
            <a className="btn btn-ghost" href="#portofolio">
              Lihat Portofolio
            </a>
          </div>
        </div>

        <div className="browser" aria-hidden="true">
          <div className="browser-chrome">
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
            <span className="addr" />
          </div>
          <div className="browser-grid">
            {ORDER.map((id) => (
              <div className={`tile tile-${id}`} data-id={id} key={id}>
                <div className="tile-drag">
                  <div className="drift">
                    <Art id={id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
