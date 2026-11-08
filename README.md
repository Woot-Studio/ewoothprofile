# Ewooth Studio

Website portfolio dan landing page untuk **Ewooth Studio** — studio web yang membantu UMKM dan bisnis lokal punya website profesional, cepat, dan mudah dikelola.

🔗 **Live:** https://woot-studio.github.io/ewoothprofile/

## Tentang

Project ini adalah single-page website berbahasa Indonesia yang mencakup:

- **Beranda** — hero, penawaran utama, dan CTA.
- **Keunggulan** — alasan memilih Ewooth Studio.
- **Layanan** — Company Profile, Landing Page, dan Redesign Website.
- **Portofolio** — contoh project dengan tautan ke website live.
- **Harga** — tiga paket dengan detail fitur.
- **Kontak** — WhatsApp, Gmail, telepon, dan Instagram.

## Fitur

- Desain responsif untuk HP, tablet, dan desktop.
- Navbar dengan smooth scroll, scroll-spy, dan active state.
- Animasi reveal saat scroll ke atas maupun ke bawah.
- Hover state yang bersih tanpa efek "naik".
- Aksesibel: struktur heading rapi, contrast aman, focus ring jelas, dan dukungan `prefers-reduced-motion`.
- Portofolio otomatis mendeteksi gambar `porto*.{png,jpg,jpeg,webp}` di `src/assets`.
- Ikon memakai `react-icons` (Font Awesome 6 & Simple Icons), tanpa request font/CDN tambahan.

## Teknologi

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- [react-icons](https://react-icons.github.io/react-icons/)
- CSS murni (tanpa framework UI)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter)

## Menjalankan Secara Lokal

Prasyarat: Node.js 22+ dan npm.

```bash
npm install
npm run dev
```

Dev server berjalan di `http://localhost:5173`.

### Script

| Perintah          | Fungsi                              |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Menjalankan dev server Vite         |
| `npm run build`   | Build produksi ke folder `dist`     |
| `npm run preview` | Preview hasil build secara lokal    |
| `npm run lint`    | Menjalankan Oxlint                  |

## Struktur Project

```text
.
├─ .github/workflows/deploy.yml   # CI: build + deploy ke GitHub Pages
├─ public/                        # Favicon dan aset publik
├─ src/
│  ├─ assets/                     # Logo, gambar portofolio, ilustrasi
│  ├─ App.jsx                     # Komponen & data utama
│  ├─ App.css                     # Layout, komponen, animasi
│  ├─ index.css                   # Reset & style global
│  └─ main.jsx                    # Entry point React
├─ index.html
├─ vite.config.js
└─ package.json
```

## Kustomisasi

- **Kontak** — ubah objek `CONTACT` di `src/App.jsx` (email, WhatsApp, telepon, Instagram).
- **Layanan & harga** — ubah array `solutions` dan `plans` di `src/App.jsx`.
- **Portofolio** — taruh gambar di `src/assets` dengan nama `porto1`, `porto2`, `porto3`, dst. Data project ada di array `works`.
- **Warna & font** — ubah CSS variables di bagian `:root` pada `src/App.css` (`--blue`, `--blue-deep`, `--navy`, `--font`, dll).
- **Ilustrasi** — `src/assets/keunggulan-showcase.webp` untuk section Keunggulan.

## Deployment

Deploy otomatis ke **GitHub Pages** lewat `.github/workflows/deploy.yml` setiap push ke branch `main`.

1. Buka **Settings → Pages** di repo GitHub.
2. Set **Source** ke **GitHub Actions**.
3. Push ke `main` — workflow akan build dan deploy.

> `base: '/ewoothprofile/'` di `vite.config.js` mengikuti nama repo. Jika repo diganti nama, sesuaikan nilai `base`.

## Lisensi

© Ewooth Studio. Semua hak dilindungi.
