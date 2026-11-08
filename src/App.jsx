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
    price: "Rp 800 k",
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
    price: "Rp 1 jt",
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
    name: "Redesign Website",
    price: "Rp 800 k",
    featured: false,
    items: [
      "Tampilan baru website lama",
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
    <div className="browser" aria-hidden="true">
      <div className="browser-top">
        <span />
        <span />
        <span />
      </div>
      <div className="browser-body">
        <div>
          <i />
          <i />
          <i />
          <b />
        </div>
        <div className="browser-photo" />
      </div>
    </div>
    </div>
  );
}

function WorkShot({ src, title, variant }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={`Cuplikan ${title}`}
        onError={() => setFailed(true)}
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

  function closeMenu() {
    setOpen(false);
  }

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
      <header className={scrolled ? "header scrolled" : "header"}>
        <div className="wrap header-bar">
          <Brand />
          <nav className={open ? "nav open" : "nav"} aria-label="Utama">
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
            className="menu-btn"
            type="button"
            aria-expanded={open}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="beranda">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <span className="badge badge-dark">Studio Web</span>
              <h1>Wujudkan Website Impian untuk Bisnismu</h1>
              <p>
                Kami bantu UMKM dan bisnis lokal punya website yang profesional,
                cepat, dan mudah dikelola. Desain modern, responsif, dan harga
                yang jelas.
              </p>
              <div className="hero-actions">
                <a className="btn btn-solid" href="#kontak">
                  Konsultasi Gratis
                </a>
                <a className="btn btn-ghost" href="#portofolio">
                  Lihat Portofolio
                </a>
              </div>
              <p className="stat">
                <span>Estimasi pengerjaan</span>
                7–14 Hari Kerja
              </p>
            </div>
            <BrowserArt />
          </div>
        </section>

        <section className="partner" id="keunggulan">
          <div className="wrap partner-grid">
            <Reveal className="partner-copy" delay={120}>
              <span className="badge">Keunggulan</span>
              <h2>Partner Digital untuk Bisnismu</h2>
              <p>
                Dari ide sampai website tayang, kami dampingi prosesnya. Desain
                yang rapi, pengerjaan yang transparan, dan dukungan setelah
                website kamu live.
              </p>
              <ul className="checks">
                <li>
                  <Icon name="check" />
                  Desain modern, responsif di semua perangkat
                </li>
                <li>
                  <Icon name="check" />
                  Proses jelas dari brief sampai website live
                </li>
                <li>
                  <Icon name="check" />
                  Dukungan setelah website diluncurkan
                </li>
              </ul>
              <a className="btn btn-solid" href="#harga">
                Mulai
              </a>
            </Reveal>
            <Reveal className="partner-visual" delay={120}>
              <img
                className="partner-shot"
                src={keunggulanShowcase}
                alt="Website Ewooth Studio responsif di laptop dan ponsel dengan proses pengerjaan yang transparan"
                width="1200"
                height="613"
                loading="lazy"
                decoding="async"
              />
            </Reveal>
          </div>
        </section>

        <section className="section" id="layanan">
          <div className="wrap">
            <Reveal className="section-head">
              <span className="badge">Layanan</span>
              <h2>Solusi Website Sesuai Kebutuhanmu</h2>
              <p>
                Pilih jenis website yang paling pas untuk tujuan bisnismu, dari
                company profile sampai landing page kampanye.
              </p>
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
          <div className="wrap">
            <Reveal className="section-head">
              <span className="badge">Portofolio</span>
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
              <span className="badge">Harga</span>
              <h2>Pilih Paket yang Pas untuk Bisnismu</h2>
              <p>
                Harga ditulis dari awal, supaya kamu bisa pilih paket sesuai
                kebutuhan tanpa biaya yang tersembunyi.
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
                  <p className="price-note">sekali bayar</p>
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
                    href="#kontak"
                  >
                    Pilih Paket
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
                <span className="badge badge-dark">Kontak</span>
                <h2>Siap Bikin Website Impianmu?</h2>
                <p>
                  Ceritakan kebutuhan website-mu. Kami bantu dari konsep sampai
                  website siap dipakai.
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
              <div className="contact-grid">
                <a className="contact-tile" href={CONTACT.gmail} target="_blank" rel="noreferrer">
                  <Icon name="gmail" />
                  <span>Email</span>
                  <strong>{CONTACT.email}</strong>
                </a>
                <a className="contact-tile" href={CONTACT.phoneHref}>
                  <Icon name="phone" />
                  <span>Telepon</span>
                  <strong>{CONTACT.phone}</strong>
                </a>
                <a
                  className="contact-tile"
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="instagram" />
                  <span>Instagram</span>
                  <strong>{CONTACT.instagramLabel}</strong>
                </a>
                <a
                  className="contact-tile"
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="chat" />
                  <span>WhatsApp</span>
                  <strong>{CONTACT.phone}</strong>
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
              Website yang rapi, cepat, dan siap bantu bisnismu tampil lebih
              profesional.
            </p>
            <div className="stack">
              <span>Teknologi yang kami pakai</span>
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
        <p className="copyright">© 2026 Ewooth Studio. Hak cipta dilindungi.</p>
      </footer>
    </>
  );
}
