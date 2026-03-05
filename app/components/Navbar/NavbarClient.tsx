"use client";

import { useEffect } from "react";
import { useResponsive } from "@/app/providers";

type Props = {
  containerId?: string;
};

export default function NavbarClient({
  containerId = "navbar-container",
}: Props) {
  const { isSmallScreen } = useResponsive();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const el = document.getElementById(containerId);
    if (!el) return;

    const m = window.matchMedia("(max-width: 768px)");

    const setTabIndex = () => {
      const value = isSmallScreen ? -1 : 0;
      el.tabIndex = value;

      // Also apply to focusable descendants (links, buttons and any element with tabindex)
      try {
        const selectors = "a, button, [role=link], [tabindex]";
        const nodes = Array.from(el.querySelectorAll<HTMLElement>(selectors));
        nodes.forEach((n) => {
          // Only set when element is naturally focusable (anchor/button) or already has tabindex
          n.tabIndex = value;
        });
      } catch (e: any) {
        console.error("Error setting tabIndex in NavbarClient:", e.message);
      }
    };

    setTabIndex();

    const onChange = () => setTabIndex();

    // keep in sync with resize and media changes
    window.addEventListener("resize", onChange);
    m.addEventListener?.("change", onChange);

    return () => {
      window.removeEventListener("resize", onChange);
      m.removeEventListener?.("change", onChange);
    };
  }, [isSmallScreen, containerId]);

  return null;
}
