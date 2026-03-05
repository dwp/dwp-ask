import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorSummary from "./ErrorSummary";

describe("ErrorSummary", () => {
  it("renders nothing if errors array is empty", () => {
    const { container } = render(<ErrorSummary errors={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing if errors prop is not provided", () => {
    // @ts-expect-error testing missing prop
    const { container } = render(<ErrorSummary />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the default title", () => {
    render(<ErrorSummary errors={[{ text: "Enter your full name" }]} />);
    expect(screen.getByText("There is a problem")).toBeInTheDocument();
  });

  it("renders a custom title", () => {
    render(
      <ErrorSummary
        title="Custom Error Title"
        errors={[{ text: "Enter your full name" }]}
      />,
    );
    expect(screen.getByText("Custom Error Title")).toBeInTheDocument();
  });

  it("renders all error messages as list items", () => {
    const errors = [
      { text: "Enter your full name" },
      { text: "Enter a valid email address" },
    ];
    render(<ErrorSummary errors={errors} />);
    errors.forEach((err) => {
      expect(screen.getByText(err.text)).toBeInTheDocument();
    });
    expect(screen.getAllByRole("listitem")).toHaveLength(errors.length);
  });

  it("renders error messages as links when href is provided", () => {
    const errors = [
      { text: "Enter your full name", href: "#full-name" },
      { text: "Enter a valid email address", href: "#email" },
    ];
    render(<ErrorSummary errors={errors} />);
    errors.forEach((err) => {
      const link = screen.getByText(err.text);
      expect(link).toBeInTheDocument();
      expect(link.closest("a")).toHaveAttribute("href", err.href);
    });
  });

  it("sets the correct data-testid", () => {
    render(
      <ErrorSummary
        errors={[{ text: "Test error" }]}
        data-testid="custom-error-summary"
      />,
    );
    expect(screen.getByTestId("custom-error-summary")).toBeInTheDocument();
  });

  it("has role alert for accessibility", () => {
    render(<ErrorSummary errors={[{ text: "Test error" }]} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
