"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "@/components";
import type { NavbarAccordionClientProps } from "@/types";
import styles from "./Navbar.module.css";

export default function NavbarAccordionClient({
  menuId,
  tabIndex = 0,
}: NavbarAccordionClientProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const menu = document.getElementById(menuId);
    if (!menu) return;

    if (expanded) {
      menu.removeAttribute("hidden");
      menu.setAttribute("aria-hidden", "false");
    } else {
      menu.setAttribute("hidden", "");
      menu.setAttribute("aria-hidden", "true");
    }
  }, [expanded, menuId]);

  return (
    <button
      className={styles.navbarButton}
      aria-expanded={expanded}
      aria-controls={menuId}
      onClick={() => setExpanded((s) => !s)}
      tabIndex={tabIndex}
      data-testid="navbar-menu-toggle"
    >
      <span aria-hidden>{expanded ? <ChevronUp /> : <ChevronDown />}</span>
      <span className={styles.label}>Menu</span>
    </button>
  );
}
