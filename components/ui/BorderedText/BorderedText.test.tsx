import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { BorderedTextProps } from "@/types";
import BorderedText from "./BorderedText";

describe("BorderedText", () => {
  it("renders the text", () => {
    const props: BorderedTextProps = { text: "Hello world" };
    render(<BorderedText {...props} />);
    expect(screen.getByTestId("bordered-text")).toHaveTextContent(
      "Hello world",
    );
  });

  it("applies the default border colour when none is provided", () => {
    const props: BorderedTextProps = { text: "Default colour" };
    render(<BorderedText {...props} />);
    expect(screen.getByTestId("bordered-text")).toHaveClass(
      "border-[var(--govuk-grey)]",
    );
  });

  it("applies a custom border colour when provided", () => {
    const props: BorderedTextProps = {
      text: "Custom colour",
      borderColour: "var(--govuk-blue)",
    };
    render(<BorderedText {...props} />);
    expect(screen.getByTestId("bordered-text")).toHaveClass(
      "border-[var(--govuk-blue)]",
    );
  });

  it("renders with the correct data-testid", () => {
    const props: BorderedTextProps = { text: "Test id check" };
    render(<BorderedText {...props} />);
    expect(screen.getByTestId("bordered-text")).toBeInTheDocument();
  });
});
