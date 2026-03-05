"use server";

import { headers } from "next/headers";
// import AdminViewNavigation from "../Packages/AdminViewNavigation/AdminViewNavigation";
import Link from "../Packages/Link/Link";
import styles from "./Navbar.module.css";
import NavbarClient from "./NavbarClient";
import NavbarHydrator from "./NavbarHydrator";
import NavbarAccordionClient from "./NavbarAccordionClient";
import ChangeClaimantLocation from "../ChangeClaimantLocation/ChangeClaimantLocation";

const NavbarRoutes = [
  {
    label: "Using AI responsibly",
    route: "/ai-notice",
  },
  {
    label: "Accessibility",
    route: "/accessibility",
  },
  {
    label: "Chat archive",
    route: "#",
  },
  {
    label: "Admin",
    route: "#",
  },
];

export default async function Navbar() {
  const headersList = await headers();
  const pathname = headersList.get("x-current-pathname") ?? "";
  const isLandingPage = pathname === "/";

  return (
    <div
      id="navbar-container"
      className={styles.navbarContainer}
      style={{ display: isLandingPage ? "none" : "" }}
    >
      <NavbarHydrator />
      <div className={styles.menuWrapper}>
        <NavbarAccordionClient menuId="navbar-menu" />

        <div id="navbar-menu" className={styles.navbarMenu} role="menu">
          <nav className={styles.menuListNavbar}>
            {NavbarRoutes.map((r, i) => (
              <Link
                key={r.route + i}
                href={r.route}
                className={styles.navbarLink}
                data-testid={`navbar-link-${i}`}
                role="menuitem"
              >
                {r.label}
              </Link>
            ))}

            <ChangeClaimantLocation className={styles.navbarLink} />

            {/* <div
              id="admin-view-wrapper"
              style={{ display: isLandingPage ? "none" : "inline" }}
            >
              <AdminViewNavigation className={styles.navbarLink} />
            </div> */}
          </nav>
        </div>
      </div>

      <NavbarClient />
    </div>
  );
}
