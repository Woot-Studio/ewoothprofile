import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Logo } from "./Logo";
import { gsap } from "../gsap-setup";
import { skipIntro } from "../shots";

const LEFT = [
  { href: "#beranda", label: "Beranda" },
  { href: "#layanan", label: "Layanan" },
  { href: "#portofolio", label: "Portofolio" },
];
const RIGHT = [
  { href: "#harga", label: "Harga" },
  { href: "#kontak", label: "Kontak" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState("#beranda");
  const [waiting, setWaiting] = useState(!skipIntro);
  const closeTimer = useRef<number | null>(null);
  const head = useRef<HTMLElement>(null);

  useEffect(() => {
    const onDone = () => setWaiting(false);
    window.addEventListener("intro:done", onDone);
    return () => window.removeEventListener("intro:done", onDone);
  }, []);

  useEffect(() => {
    const ids = ["beranda", "layanan", "portofolio", "harga", "kontak"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit?.target.id) setActive(`#${hit.target.id}`);
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0.1, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let last = window.scrollY;
    let acc = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - last;
      setSolid(y > window.innerHeight * 1.7);
      if (dy > 0) {
        acc = 0;
        if (y > 80) setOpen(false);
      } else {
        acc += -dy;
        if (acc >= 24 && window.matchMedia("(min-width: 768px)").matches) {
          setOpen(true);
          acc = 0;
        }
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const tag = head.current?.querySelector(".logo-tag");
    if (!tag) return;
    const tween = gsap.fromTo(
      tag,
      { rotation: 12, svgOrigin: "166 275" },
      { rotation: 0, duration: 0.38, ease: "back.out(1.6)", svgOrigin: "166 275" },
    );
    return () => {
      tween.kill();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const armClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 600);
  };
  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <header
      ref={head}
      className={`header${open ? " open" : ""}${solid ? " solid" : ""}`}
      onMouseLeave={() => {
        if (window.matchMedia("(min-width: 768px)").matches) armClose();
      }}
    >
      <div className="scrim" onClick={() => setOpen(false)} />
      <div
        className="nav-shell"
        onMouseEnter={() => {
          if (window.matchMedia("(min-width: 768px)").matches) {
            cancelClose();
            setOpen(true);
          }
        }}
      >
        <nav className="nav-left wing" aria-label="Utama" aria-hidden={!open}>
          {LEFT.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-item${active === item.href ? " on" : ""}`}
              style={{ ["--d" as string]: `${(LEFT.length - 1 - i) * 35}ms`, ["--dc" as string]: `${i * 35}ms` }}
              onClick={go(item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="logo-slot">
          <button
            className={`logo-btn${waiting ? " waiting" : ""}`}
            aria-label="Ewooth Studio, buka menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            onFocus={() => setOpen(true)}
          >
            <Logo size={40} />
          </button>
        </div>
        <nav className="nav-right wing" aria-label="Lanjutan" aria-hidden={!open}>
          {RIGHT.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-item${active === item.href ? " on" : ""}`}
              style={{ ["--d" as string]: `${i * 35}ms`, ["--dc" as string]: `${(RIGHT.length - i) * 35}ms` }}
              onClick={go(item.href)}
            >
              {item.label}
            </a>
          ))}
          <a
            className="nav-item btn btn-primary mulai"
            href="#kontak"
            style={{ ["--d" as string]: "70ms", ["--dc" as string]: "0ms" }}
            onClick={go("#kontak")}
          >
            Mulai
          </a>
        </nav>
      </div>
    </header>
  );
}
