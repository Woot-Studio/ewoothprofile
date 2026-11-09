import { useEffect, useRef, useState } from "react";
import {
  FaArrowUpRightFromSquare,
  FaBars,
  FaBuilding,
  FaCheck,
  FaEnvelope,
  FaInstagram,
  FaPhone,
  FaRocket,
  FaWandMagicSparkles,
  FaWhatsapp,
  FaXmark,
} from "react-icons/fa6";
import { SiGmail, SiJavascript, SiReact, SiVite } from "react-icons/si";
import heroShowcase from "./assets/hero-showcase.webp";
import keunggulanShowcase from "./assets/keunggulan-showcase.webp";
import logo from "./assets/logo.png";
import logoWhite from "./assets/logo-white.png";
import porto1 from "./assets/porto1.png";
import porto2 from "./assets/porto2.jpg";
import porto3 from "./assets/porto3.jpg";
import "./App.css";

const EMAIL = "ewoothstudio@gmail.com";
const gmailDraft = new URL("https://mail.google.com/mail/");
gmailDraft.searchParams.set("view", "cm");
gmailDraft.searchParams.set("fs", "1");
gmailDraft.searchParams.set("to", EMAIL);
gmailDraft.searchParams.set("su", "Konsultasi Website Ewooth Studio");
gmailDraft.searchParams.set(
  "body",
  "Halo Ewooth Studio,\n\nSaya ingin konsultasi pembuatan website.\n\nNama:\nJenis usaha:\nKebutuhan website:\n\nTerima kasih.",
);

const waLink = (text) =>
  `https://wa.me/62881080664997?text=${encodeURIComponent(text)}`;

const CONTACT = {
  email: EMAIL,
  gmail: gmailDraft.toString(),
  phone: "+62 881-0806-64997",
  phoneHref: "tel:+62881080664997",
  whatsapp: "https://wa.me/62881080664997",
  instagram: "https://instagram.com/ewoothstudio",
  instagramLabel: "@ewoothstudio",
};

const nav = [
  ["Beranda", "#beranda"],
  ["Layanan", "#layanan"],
  ["Portofolio", "#portofolio"],
  ["Harga", "#harga"],
  ["Kontak", "#kontak"],
];

// Foto portofolio: taruh di src/assets dengan nama
// porto1, porto2, porto3 (.png .jpg .jpeg .webp). Spasi atau tanda hubung boleh.
const portoModules = import.meta.glob("./assets/*porto*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

function portoSrc(n) {
  const re = new RegExp(`porto[-_ ]?${n}\\.(png|jpe?g|webp)$`, "i");
  const key = Object.keys(portoModules).find((path) =>
    re.test(path.replaceAll("\\", "/")),
  );
  return key ? portoModules[key] : "";
}

const works = [
  {
    n: 1,
    cat: "Company Profile",
    title: "Ewooth Studio",
    icon: "building",
    href: "https://woot-studio.github.io/ewoothprofile/",
    src: porto1,
    external: true,
  },
  {
    n: 2,
    cat: "Landing Page",
    title: "PULL",
    icon: "rocket",
    href: "https://pull-landing-page.vercel.app/",
    src: porto2,
    external: true,
  },
  {
    n: 3,
    cat: "Landing Page",
    title: "Cocopra",
    icon: "rocket",
    href: "https://cocopra-id.vercel.app/",
    src: porto3,
    external: true,
  },
].map((item) => {
  const bundled = portoSrc(item.n);
  const src = item.src || bundled || `/assets/porto${item.n}.png`;
  return {
    ...item,
    src,
    href: item.href || src,
    external: item.external !== false,
  };
});

const solutions = [
  {
    title: "Website Company Profile",
    text: "Kenalkan bisnis, layanan, dan kredibilitas perusahaan dalam satu website yang rapi dan mudah dipercaya.",
    icon: "building",
  },
  {
    title: "Landing Page",
    text: "Satu halaman yang fokus ke penawaran. Cocok untuk kampanye, promo, dan meningkatkan konversi.",
    icon: "rocket",
  },
  {
    title: "Redesign Website",
    text: "Perbarui tampilan website lama supaya lebih modern, cepat, dan nyaman dipakai di semua perangkat.",
    icon: "redesign",
  },
];

const plans = [
  {
    name: "Landing Page",
    price: "Rp 800rb",
    featured: false,
    items: [
      "1 halaman fokus penawaran",
      "Desain responsif",
      "Tombol WhatsApp",
      "Revisi 2 kali",
      "Pengerjaan 7–14 hari",
    ],
  },
  {
    name: "Company Profile",
    price: "Rp 1jt",
    featured: true,
    items: [
      "Hingga 5 halaman",
      "Profil bisnis lengkap",
      "Desain custom",
      "Formulir & WhatsApp",
      "Revisi 3 kali",
      "Pengerjaan 7–14 hari",
    ],
  },
  {
    name: "Redesign Halaman",
    price: "Rp 800rb",
    featured: false,
    items: [
      "Tampilan baru halaman utama",
      "Struktur halaman tetap",
      "Desain lebih modern",
      "Tampilan mobile diperbaiki",
      "Revisi 2 kali",
    ],
  },
];

const icons = {
  check: FaCheck,
  mail: FaEnvelope,
  gmail: SiGmail,
  phone: FaPhone,
  chat: FaWhatsapp,
  instagram: FaInstagram,
  building: FaBuilding,
  rocket: FaRocket,
  redesign: FaWandMagicSparkles,
  external: FaArrowUpRightFromSquare,
  menu: FaBars,
  close: FaXmark,
};

function Icon({ name, ...rest }) {
  const Glyph = icons[name];
  if (!Glyph) return null;

  return (
    <Glyph
      className="icon"
      aria-hidden="true"
      focusable="false"
      {...rest}
    />
  );
}

function Brand({ light = false }) {
  return (
    <a className="brand" href="#beranda">
      <img src={light ? logoWhite : logo} alt="" />
      <span>
        Ewooth <em>Studio</em>
      </span>
    </a>
  );
}

function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }) {
  const ref = useRef(null);
  const [reveal, setReveal] = useState(() => ({
    shown:
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    fromTop: false,
  }));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const fromTop =
          entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0);

        setReveal((prev) => {
          if (entry.intersectionRatio >= 0.18) {
            if (prev.shown) return prev;
            return { shown: true, fromTop };
          }

          if (entry.intersectionRatio === 0 && prev.shown) {
            return { ...prev, shown: false };
          }

          return prev;
        });
      },
      { threshold: [0, 0.18], rootMargin: "0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${className} reveal${reveal.fromTop ? " from-top" : ""}${reveal.shown ? " is-in" : ""}`}
      style={{ "--d": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function BrowserArt() {
  return (
    <div className="hero-visual">
      <img
        className="hero-shot"
        src={heroShowcase}
        alt="Contoh website modern dan responsif di laptop dan ponsel"
        width="1400"
        height="788"
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
}

function WorkShot({ src, title, variant }) {
  const [failedSrc, setFailedSrc] = useState("");
  const failed = failedSrc === src;

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={`Cuplikan ${title}`}
        onError={() => setFailedSrc(src)}
      />
    );
  }

  return (
    <div className={`shot-fallback shot-${variant}`} aria-hidden="true">
      <div className="shot-bar">
        <span />
        <span />
        <span />
      </div>
      <div className="shot-copy">
        <i />
        <i />
        <i />
        <b />
      </div>
    </div>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#beranda");
  const [scrolled, setScrolled] = useState(false);
  const scrollLock = useRef(null);
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  function closeMenu() {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        menuBtnRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;

      const items = [
        ...menuRef.current.querySelectorAll("a, button"),
      ].filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event) {
      if (
        menuRef.current?.contains(event.target) ||
        menuBtnRef.current?.contains(event.target)
      ) {
        return;
      }
      setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    const sections = nav
      .map(([, href]) => document.querySelector(href))
      .filter(Boolean);

    function onScroll() {
      setScrolled(window.scrollY > 8);

      if (scrollLock.current) return;

      const line = 140;
      let current = sections[0];

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section;
      }

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        current = sections[sections.length - 1];
      }

      if (current) setActive(`#${current.id}`);
    }

    function onScrollEnd() {
      scrollLock.current = null;
    }

    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("scrollend", onScrollEnd);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(scrollLock.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }, []);

  function goToSection(event, href) {
    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    clearTimeout(scrollLock.current);
    scrollLock.current = setTimeout(
      () => {
        scrollLock.current = null;
      },
      reduceMotion ? 0 : 1400,
    );

    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", href);
    setActive(href);
    closeMenu();
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Lewati ke konten
      </a>
      <header className={scrolled ? "header scrolled" : "header"}>
        <div className="wrap header-bar">
          <Brand />
          <nav
            id="primary-nav"
            ref={menuRef}
            className={open ? "nav open" : "nav"}
            aria-label="Utama"
          >
            {nav.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className={active === href ? "is-active" : undefined}
                aria-current={active === href ? "location" : undefined}
                onClick={(event) => goToSection(event, href)}
              >
                {label}
              </a>
            ))}
            <a
              className="btn btn-solid nav-cta"
              href="#kontak"
              onClick={(event) => goToSection(event, "#kontak")}
            >
              Mulai
            </a>
          </nav>
          <button
            ref={menuBtnRef}
            className="menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="primary-nav"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="beranda">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <h1>Wujudkan Website Impian untuk Bisnismu</h1>
              <p>
                Kami bantu UMKM dan bisnis lokal punya website profesional yang
                cepat, mudah dikelola, dan harganya jelas. Pengerjaan 7–14 hari
                kerja.
              </p>
              <div className="hero-actions">
                <a className="btn btn-solid" href="#kontak">
                  Konsultasi Gratis
                </a>
                <a className="btn btn-ghost" href="#portofolio">
                  Lihat Portofolio
                </a>
              </div>
            </div>
            <BrowserArt />
          </div>
        </section>

        <section className="partner" id="keunggulan">
          <div className="wrap partner-grid">
            <Reveal className="partner-copy" delay={120}>
              <span className="kicker">Keunggulan</span>
              <h2>Partner Digital untuk Bisnismu</h2>
              <p>
                Dari ide sampai tayang, kami dampingi prosesnya. Pengerjaan
                transparan dan ada dukungan setelah website kamu live.
              </p>
              <ul className="checks">
                <li>
                  <Icon name="check" />
                  Tampilan rapi di HP, tablet, dan desktop
                </li>
                <li>
                  <Icon name="check" />
                  Progres jelas dari brief sampai website live
                </li>
                <li>
                  <Icon name="check" />
                  Dukungan setelah website diluncurkan
                </li>
              </ul>
              <a className="btn btn-solid" href="#harga">
                Lihat Harga
              </a>
            </Reveal>
            <Reveal className="partner-visual" delay={120}>
              <img
                className="partner-shot"
                src={keunggulanShowcase}
                alt="Website Ewooth Studio responsif di laptop dan ponsel dengan proses pengerjaan yang transparan"
                width="1400"
                height="715"
                loading="lazy"
                decoding="async"
              />
            </Reveal>
          </div>
        </section>

        <section className="section" id="layanan">
          <div className="wrap">
            <Reveal className="section-head is-left">
              <h2>Solusi Website Sesuai Kebutuhanmu</h2>
              <p>Pilih jenis website yang paling pas untuk tujuan bisnismu.</p>
            </Reveal>
            <div className="cards-3">
              {solutions.map((item, index) => (
                <Reveal as="article" className="info-card" key={item.title} delay={index * 90}>
                  <span className="info-icon">
                    <Icon name={item.icon} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="portofolio">
          <div className="wrap wrap--wide">
            <Reveal className="section-head is-split">
              <h2>Hasil Karya Kami</h2>
              <p>
                Beberapa website yang sudah kami kerjakan untuk berbagai jenis
                bisnis.
              </p>
            </Reveal>
            <div className="cards-3">
              {works.map((item, index) => (
                <Reveal
                  as="a"
                  className="work-card"
                  key={item.n}
                  delay={index * 90}
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  <div className="work-frame">
                    <WorkShot
                      src={item.src}
                      title={item.title}
                      variant={item.n}
                    />
                  </div>
                  <div className="work-meta">
                    <div>
                      <span className="work-cat">
                        <Icon name={item.icon} />
                        {item.cat}
                      </span>
                      <strong>{item.title}</strong>
                    </div>
                    <span className="work-open">
                      <Icon name="external" />
                      <span className="sr-only">Buka {item.title}</span>
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="harga">
          <div className="wrap">
            <Reveal className="section-head">
              <h2>Pilih Paket yang Pas untuk Bisnismu</h2>
              <p>
                Harga sekali bayar, ditulis dari awal supaya tidak ada biaya
                tersembunyi.
              </p>
            </Reveal>
            <div className="price-grid">
              {plans.map((plan, index) => (
                <Reveal
                  as="article"
                  className={plan.featured ? "price-card featured" : "price-card"}
                  key={plan.name}
                  delay={index * 90}
                >
                  {plan.featured ? (
                    <span className="popular">Paling diminati</span>
                  ) : null}
                  <h3>{plan.name}</h3>
                  <p className="price">{plan.price}</p>
                  <ul>
                    {plan.items.map((feature) => (
                      <li key={feature}>
                        <Icon name="check" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    className={plan.featured ? "btn btn-solid" : "btn btn-line"}
                    href={waLink(
                      `Halo Ewooth Studio, saya tertarik paket ${plan.name} (${plan.price}).`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Pilih {plan.name}
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section cta-section" id="kontak">
          <div className="wrap">
            <Reveal className="cta">
              <div>
                <h2>Ceritakan Kebutuhan Websitemu</h2>
                <p>
                  Konsultasi gratis, tanpa komitmen. Kami bantu dari konsep
                  sampai website siap dipakai.
                </p>
                <div className="hero-actions">
                  <a className="btn btn-solid" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">
                    <Icon name="chat" />
                    Chat via WhatsApp
                  </a>
                  <a className="btn btn-ghost" href={CONTACT.gmail} target="_blank" rel="noreferrer">
                    <Icon name="mail" />
                    Kirim Email
                  </a>
                </div>
              </div>
              <div className="contact-list">
                <a className="contact-row" href={CONTACT.gmail} target="_blank" rel="noreferrer">
                  <Icon name="gmail" />
                  <div>
                    <span>Email</span>
                    <strong>{CONTACT.email}</strong>
                  </div>
                </a>
                <a className="contact-row" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">
                  <Icon name="chat" />
                  <div>
                    <span>WhatsApp</span>
                    <strong>{CONTACT.phone}</strong>
                  </div>
                </a>
                <a
                  className="contact-row"
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="instagram" />
                  <div>
                    <span>Instagram</span>
                    <strong>{CONTACT.instagramLabel}</strong>
                  </div>
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <Brand light />
            <p>
              Kami bantu bisnis lokal tampil lebih meyakinkan di internet.
            </p>
            <div className="stack">
              <span>Dibangun dengan</span>
              <ul>
                <li>
                  <SiReact aria-hidden="true" />
                  React
                </li>
                <li>
                  <SiVite aria-hidden="true" />
                  Vite
                </li>
                <li>
                  <SiJavascript aria-hidden="true" />
                  JavaScript
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h3>Menu</h3>
            <a href="#beranda">Beranda</a>
            <a href="#layanan">Layanan</a>
            <a href="#portofolio">Portofolio</a>
            <a href="#harga">Harga</a>
          </div>
          <div>
            <h3>Layanan</h3>
            <a href="#layanan">Company Profile</a>
            <a href="#layanan">Landing Page</a>
            <a href="#layanan">Redesign Website</a>
          </div>
          <div>
            <h3>Kontak</h3>
            <a href={CONTACT.gmail} target="_blank" rel="noreferrer">{CONTACT.email}</a>
            <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            <a href={CONTACT.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
        </div>
        <p className="wrap copyright">© 2026 Ewooth Studio. Hak cipta dilindungi.</p>
      </footer>
    </>
  );
}
