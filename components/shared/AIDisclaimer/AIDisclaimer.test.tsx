import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AIDisclaimer from "./AIDisclaimer";

describe("AIDisclaimer", () => {
  it("renders disclaimer when showAIStatement is true", () => {
    render(<AIDisclaimer showAIStatement={true} />);

    expect(
      screen.getByText(/This AI summary may contain errors/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Use the Universal Learning guidance links/),
    ).toBeInTheDocument();
  });

  it("does not render when showAIStatement is false", () => {
    render(<AIDisclaimer showAIStatement={false} />);

    expect(
      screen.queryByText(/This AI summary may contain errors/),
    ).not.toBeInTheDocument();
  });
});
