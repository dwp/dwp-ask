import { Link } from "@/components";
import { FOOTER_LINKS } from "@/constants/FooterLinks";
import type { FooterProps } from "@/types";
import styles from "./Footer.module.css";

/** GOV.UK-styled page footer with navigation links. Hidden from screen readers when a modal is open. */
export default function Footer({ isModalOpen, pathname }: FooterProps) {
  const isChatPage = pathname === "/chat";

  return (
    <footer
      role="contentinfo"
      data-testid="footer-container"
      className={`${styles.footerWrapper} ${isChatPage ? styles.footerModifiedPadding : ""} govuk-footer`}
      aria-hidden={isModalOpen}
    >
      <div className="govuk-width-container">
        <div className="govuk-footer__meta">
          <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
            <div className={styles.footerLinks}>
              {FOOTER_LINKS.map((link) => (
                <Link
                  data-testid={link.dataTest}
                  className="govuk-footer__link"
                  tabIndex={isModalOpen ? -1 : 0}
                  key={link.href}
                  href={link.href}
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
