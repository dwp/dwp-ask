"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function NavbarHydrator() {
  const pathname = usePathname() ?? "";
  const isLandingPage = pathname === "/";
  const isAgreementPage = pathname === "/agreement";

  useEffect(() => {
    try {
      const adminWrapper = document.getElementById("admin-view-wrapper");
      if (adminWrapper) {
        adminWrapper.style.display = isLandingPage ? "none" : "inline";
      }

      const navbarContainer = document.getElementById("navbar-container");
      if (navbarContainer) {
        navbarContainer.style.display =
          isLandingPage || isAgreementPage ? "none" : "";
      }

      const headerContainer = document.getElementById("dwpask-header");
      if (headerContainer) {
        headerContainer.style.display = isLandingPage ? "none" : "";
      }
    } catch (e: any) {
      console.error("Error in NavbarHydrator:", e.message);
    }
  }, [isLandingPage, isAgreementPage]);

  return null;
}
