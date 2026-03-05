"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./Layout.module.css";

const freeFlowPages = ["/", "/accessibility", "/ai-notice"];

export default function LayoutClient() {
  const pathname = usePathname();

  useEffect(() => {
    const container = document.getElementById("app-container");
    const children = document.getElementById("app-children");
    if (!container) return;

    const isFreeFlow = freeFlowPages.includes(pathname ?? "/");

    if (isFreeFlow) {
      container.classList.add(styles.freeFlowPageLayout);
      if (children) children.classList.add(styles.naturalFlow);
    } else {
      container.classList.remove(styles.freeFlowPageLayout);
      if (children) children.classList.remove(styles.naturalFlow);
    }

    return () => {
      container.classList.remove(styles.freeFlowPageLayout);
      if (children) children.classList.remove(styles.naturalFlow);
    };
  }, [pathname]);

  return null;
}
