"use client";

import Link from "../Packages/Link/Link";
import { useResponsive } from "@/app/providers";

export default function SkipLink() {
  const { isSmallScreen } = useResponsive();

  return (
    <Link
      tabIndex={isSmallScreen ? -1 : 0}
      data-testid="skip-link"
      href="#main"
      className="govuk-skip-link"
      data-module="govuk-skip-link"
    >
      Skip to main content
    </Link>
  );
}
