"use server";

import { Header, PhaseBanner, SkipLink } from "@/components";
import type { LayoutProps } from "@/types";
import styles from "./Layout.module.css";
import LayoutClient from "./LayoutClient";
import LayoutModals from "./LayoutModals";

/** Root layout shell that composes the skip link, header, phase banner, modals, and main content area. */
export default async function Layout({ children }: LayoutProps) {
  return (
    <div
      id="app-container"
      className={styles.appContainer}
      data-testid="app-container"
    >
      <SkipLink />
      <LayoutClient />
      <Header />
      <PhaseBanner />
      <LayoutModals />
      <main id="app-children" className={styles.appChildren}>
        {children}
      </main>
    </div>
  );
}
