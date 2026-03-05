import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import WarningText from "./WarningText";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("WarningText renders correctly", () => {
  it("renders the warning text with the correct structure", () => {
    render(
      <WarningText data-testid="warning-text" bottomMargin={true}>
        This is a warning message.
      </WarningText>,
    );

    // Check if the outer div has the correct data-testid
    const warningText = screen.getByTestId("warning-text");
    expect(warningText).toBeInTheDocument();
    expect(warningText).toHaveClass("govuk-warning-text");

    // Check if the icon span is rendered
    const icon = warningText.querySelector(".govuk-warning-text__icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent("!");

    // Check if the visually hidden text is rendered
    const visuallyHiddenText = warningText.querySelector(
      ".govuk-visually-hidden",
    );
    expect(visuallyHiddenText).toBeInTheDocument();
    expect(visuallyHiddenText).toHaveTextContent("Warning");

    // Check if the children are rendered inside the strong tag
    const strongText = warningText.querySelector(".govuk-warning-text__text");
    expect(strongText).toBeInTheDocument();
    expect(strongText).toHaveTextContent("This is a warning message.");
  });
});
