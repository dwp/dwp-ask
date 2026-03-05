"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "../Packages/Chevrons/Chevrons";
import styles from "./Navbar.module.css";

type Props = {
  menuId: string;
  tabIndex?: number;
};

export default function NavbarAccordionClient({ menuId, tabIndex = 0 }: Props) {
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
