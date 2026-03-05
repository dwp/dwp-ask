import { headers } from "next/headers";
import Navbar from "../../Navbar/Navbar";
import styles from "./Header.module.css";

export default async function Header() {
  const headersList = await headers();
  const pathname = headersList.get("x-current-pathname") ?? "";
  const isLandingPage = pathname === "/";

  return (
    <header
      id="dwpask-header"
      className={`govuk-header ${styles.topnavHeader}`}
      data-module="govuk-header"
      style={{ display: isLandingPage ? "none" : "" }}
    >
      <div>
        <div className={styles.headerContainer}>
          <div>
            <span
              className={styles.headerFormattingDwp}
              data-testid="header-dwp-text"
            >
              DWP
            </span>
            <span
              data-testid="header-ask-text"
              className={styles.headerFormattingAsk}
            >
              Ask
            </span>
          </div>

          <div className={styles.navbarWrapper}>
            <Navbar />
          </div>
        </div>
      </div>
    </header>
  );
}
