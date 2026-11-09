import { useLayoutEffect, useRef } from "react";
import svg from "../assets/ewooth-logo.svg?raw";

type Props = {
  size?: number;
  light?: boolean;
  className?: string;
};

export function Logo({ size = 40, light = false, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const el = root?.querySelector("svg");
    if (!el) return;
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", "Ewooth");
    el.style.overflow = "visible";
    el.style.display = "block";
    el.style.width = "100%";
    el.style.height = "100%";
    for (const id of ["tag", "eye"] as const) {
      const node = el.querySelector(`#${id}`);
      if (!node || node.parentElement?.classList.contains(`logo-${id}`)) continue;
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", `logo-${id}`);
      node.parentNode?.insertBefore(g, node);
      g.appendChild(node);
    }
  }, []);

  return (
    <span
      ref={ref}
      className={`logo${light ? " light" : ""}${className ? ` ${className}` : ""}`}
      style={{ width: size, height: Math.round((size * 380) / 329) }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
