import Link from "../Link/Link";
import { links, type FooterProps } from "./config";
import styles from "./Footer.module.css";

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
              {links.map((link) => (
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
