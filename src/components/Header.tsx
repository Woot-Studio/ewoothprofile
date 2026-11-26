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
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onDone = () => setWaiting(false);
    if (!document.querySelector(".intro:not([hidden])")) onDone();
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
        if (y > 80 && !head.current?.contains(document.activeElement)) setOpen(false);
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
    if (!open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
      if (e.key === "Escape") {
        if (head.current?.contains(document.activeElement)) menuButton.current?.focus();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
  }, []);

  const armClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      if (!head.current?.contains(document.activeElement)) setOpen(false);
    }, 600);
  };
  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  const go = (href: string) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.button !== 0) return;
    const el = document.querySelector<HTMLElement>(href);
    if (!el) return;
    e.preventDefault();
    setOpen(false);
    if (location.hash !== href) history.pushState(null, "", href);
    el.tabIndex = -1;
    el.focus({ preventScroll: true });
    const y = el.getBoundingClientRect().top + window.scrollY;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: y, behavior: reduce ? "instant" : "smooth" });
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
        <nav className="nav-left wing" aria-label="Utama" aria-hidden={!open} inert={!open}>
          {LEFT.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "location" : undefined}
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
            ref={menuButton}
            type="button"
            className={`logo-btn${waiting ? " waiting" : ""}`}
            aria-label={open ? "Tutup menu Ewooth Studio" : "Buka menu Ewooth Studio"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Logo size={40} />
          </button>
        </div>
        <nav className="nav-right wing" aria-label="Lanjutan" aria-hidden={!open} inert={!open}>
          {RIGHT.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "location" : undefined}
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
