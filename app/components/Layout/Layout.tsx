"use server";

import Header from "../Packages/Header/Header";
import LayoutModals from "./LayoutModals";
import styles from "./Layout.module.css";
import LayoutClient from "./LayoutClient";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  return (
    <div
      id="app-container"
      className={styles.appContainer}
      data-testid="app-container"
    >
      <LayoutClient />
      <Header />
      <LayoutModals />
      <main id="app-children" className={styles.appChildren}>
        {children}
      </main>
    </div>
  );
}
