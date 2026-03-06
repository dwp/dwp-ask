"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import styles from "./Layout.module.css";

const freeFlowPages = [
  "/",
  "/accessibility",
  "/ai-notice",
  "/chat/history",
  "/chat/view-details",
];

export default function LayoutClient() {
  const pathname = usePathname();

  useEffect(() => {
    const container = document.getElementById("app-container");
    const children = document.getElementById("app-children");
    const body = document.body;
    const html = document.documentElement;

    if (!container) return;

    const isFreeFlow = freeFlowPages.includes(pathname ?? "/");

    const applyStyles = (style: string | null) => {
      body.style.height = style ?? "";
      body.style.overflow = style ?? "";
      html.style.height = style ?? "";
      html.style.overflow = style ?? "";
    };

    if (isFreeFlow) {
      container.classList.add(styles.freeFlowPageLayout);
      if (children) children.classList.add(styles.naturalFlow);

      // Allow body/html to scroll
      applyStyles("auto");
    } else {
      container.classList.remove(styles.freeFlowPageLayout);
      if (children) children.classList.remove(styles.naturalFlow);

      // Restore body/html styles
      applyStyles(null);
    }

    return () => {
      container.classList.remove(styles.freeFlowPageLayout);
      if (children) children.classList.remove(styles.naturalFlow);
      applyStyles(null);
    };
  }, [pathname]);

  return null;
}
