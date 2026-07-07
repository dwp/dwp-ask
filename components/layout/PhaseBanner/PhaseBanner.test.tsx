import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PhaseBanner from "./PhaseBanner";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Mock the Link component
vi.mock("../Link/Link", () => {
  return {
    default: function MockLink({
      href,
      children,
      ...props
    }: {
      href: string;
      children: React.ReactNode;
      [key: string]: unknown;
    }) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    },
  };
});

import { usePathname } from "next/navigation";

describe("PhaseBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the phase banner container", () => {
      vi.mocked(usePathname).mockReturnValue("/");

      render(<PhaseBanner />);

      const banner = screen.getByTestId("phase-banner");
      expect(banner).toBeInTheDocument();
      expect(banner).toHaveClass("govuk-phase-banner");
    });

    it("should render the Beta tag", () => {
      vi.mocked(usePathname).mockReturnValue("/");

      render(<PhaseBanner />);

      const tag = screen.getByTestId("phase-banner-tag");
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveClass("govuk-tag", "govuk-phase-banner__content__tag");
      expect(tag).toHaveTextContent("Beta");
    });

    it("should render the phase banner text", () => {
      vi.mocked(usePathname).mockReturnValue("/");

      render(<PhaseBanner />);

      const text = screen.getByTestId("phase-banner-text");
      expect(text).toBeInTheDocument();
      expect(text).toHaveClass("govuk-phase-banner__text");
      expect(text).toHaveTextContent("This is a new service");
    });

    it("should render the feedback link", () => {
      vi.mocked(usePathname).mockReturnValue("/");

      render(<PhaseBanner />);

      const link = screen.getByTestId("phase-banner-link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent("give your feedback (opens in a new tab)");
    });
  });

  describe("Link Functionality", () => {
    it("should open feedback link in a new tab", () => {
      vi.mocked(usePathname).mockReturnValue("/");

      render(<PhaseBanner />);

      const link = screen.getByTestId("phase-banner-link");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy with beta tag", () => {
      vi.mocked(usePathname).mockReturnValue("/");

      render(<PhaseBanner />);

      const tag = screen.getByTestId("phase-banner-tag");
      expect(tag.tagName).toBe("STRONG");
    });

    it("should have accessible link text", () => {
      vi.mocked(usePathname).mockReturnValue("/");

      render(<PhaseBanner />);

      const link = screen.getByTestId("phase-banner-link");
      expect(link.textContent).toContain("give your feedback");
      expect(link.textContent).toContain("opens in a new tab");
    });

    it("should have proper structure with semantic HTML", () => {
      vi.mocked(usePathname).mockReturnValue("/");

      render(<PhaseBanner />);

      const banner = screen.getByTestId("phase-banner");
      expect(banner.querySelector("p")).toBeInTheDocument();
      expect(banner.querySelector("strong")).toBeInTheDocument();
      expect(banner.querySelector("span")).toBeInTheDocument();
    });
  });

  describe("Content", () => {
    it("should render complete feedback text", () => {
      vi.mocked(usePathname).mockReturnValue("/");

      render(<PhaseBanner />);

      const text = screen.getByTestId("phase-banner-text");
      expect(text).toHaveTextContent(
        "This is a new service. Help us improve it and give your feedback (opens in a new tab).",
      );
    });

    it("should render all expected test IDs", () => {
      vi.mocked(usePathname).mockReturnValue("/");

      render(<PhaseBanner />);

      expect(screen.getByTestId("phase-banner")).toBeInTheDocument();
      expect(screen.getByTestId("phase-banner-tag")).toBeInTheDocument();
      expect(screen.getByTestId("phase-banner-text")).toBeInTheDocument();
      expect(screen.getByTestId("phase-banner-link")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined pathname gracefully", () => {
      vi.mocked(usePathname).mockReturnValue("");

      render(<PhaseBanner />);

      const banner = screen.getByTestId("phase-banner");
      expect(banner).toBeInTheDocument();
    });

    it("should render with multiple route changes", () => {
      const { rerender } = render(<PhaseBanner />);
      vi.mocked(usePathname).mockReturnValue("/");

      rerender(<PhaseBanner />);

      const banner = screen.getByTestId("phase-banner");
      expect(banner).toBeInTheDocument();

      vi.mocked(usePathname).mockReturnValue("/chat");
      rerender(<PhaseBanner />);

      expect(screen.getByTestId("phase-banner")).toHaveClass(
        "govuk-phase-banner",
      );
    });
  });
});
