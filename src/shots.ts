const q = new URLSearchParams(location.search);

export const shot = q.get("shot");
export const skipIntro = q.has("nointro") || !!shot || q.has("reduce");

const shots = new Map<string, () => void>();

export function registerShot(id: string, fn: () => void) {
  shots.set(id, fn);
}

export function runShot() {
  if (!shot) return;
  const fn = shots.get(shot);
  fn?.();
}

export const WA =
  "https://wa.me/62881080664997?text=" +
  encodeURIComponent("Halo Ewooth Studio, saya ingin konsultasi tentang website.");

export const MAIL = "mailto:ewoothstudio@gmail.com";
