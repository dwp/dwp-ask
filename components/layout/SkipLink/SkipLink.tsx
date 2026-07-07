"use client";

import { Link } from "@/components";
import { useResponsive } from "@/providers";

/** Accessibility skip link that allows keyboard users to jump directly to the main content. */
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
