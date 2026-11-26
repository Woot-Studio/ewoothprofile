const q = new URLSearchParams(location.search);

export const shot = q.get("shot");
export const skipIntro = q.has("nointro") || !!shot || q.has("reduce") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const shots = new Map<string, () => void>();

export function registerShot(id: string, fn: () => void) {
  shots.set(id, fn);
}

export function runShot() {
  if (!shot) return;
  const fn = shots.get(shot);
  fn?.();
}

export function whatsappLink(message: string) {
  return "https://wa.me/62881080664997?text=" + encodeURIComponent(message);
}

export const WA = whatsappLink("Halo Ewooth Studio, saya ingin konsultasi tentang website.");

export function planWhatsApp(name: string, price: string) {
  return whatsappLink(`Halo Ewooth Studio, saya tertarik dengan paket ${name} (${price}). Boleh konsultasi tentang kebutuhan website saya?`);
}

export const MAIL = "mailto:ewoothstudio@gmail.com";
