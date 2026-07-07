import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/shared/AuthWrapper/AuthWrapper", () => {
  return {
    default: function MockAuthWrapper({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return <>{children}</>;
    },
  };
});

import AdminViewNavigation from "./AdminViewNavigation";

describe("AdminViewNavigation", () => {
  it("renders link with default props", () => {
    render(<AdminViewNavigation />);
    const link = screen.getByRole("link", { name: "Admin" });
    expect(link).toHaveAttribute("href", "/admin");
    expect(link).toHaveClass("govuk-link");
  });

  it("renders link with custom className", () => {
    render(<AdminViewNavigation className="custom-class" />);
    const link = screen.getByRole("link", { name: "Admin" });
    expect(link).toHaveClass("govuk-link custom-class");
  });
});
