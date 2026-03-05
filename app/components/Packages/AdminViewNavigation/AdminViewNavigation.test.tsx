import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminViewNavigation from "./AdminViewNavigation";

jest.mock("../../AuthWrapper/AuthWrapper", () => {
  return function MockAuthWrapper({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

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
