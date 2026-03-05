import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Link from "./Link";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("Link renders correctly", () => {
  it("Link text renders correctly", () => {
    render(
      <Link data-testid="sample-link-text" href="/accessibility">
        Accessibility statement
      </Link>,
    );
    const link = screen.getByTestId("sample-link-text");
    expect(link.innerHTML).toEqual("Accessibility statement");
  });

  it("handles keyboard events with custom onKeyDown", () => {
    const mockOnKeyDown = jest.fn();
    render(
      <Link data-testid="test-link" href="/test" onKeyDown={mockOnKeyDown}>
        Test Link
      </Link>,
    );

    const link = screen.getByTestId("test-link");
    fireEvent.keyDown(link, { key: "Enter" });
    expect(mockOnKeyDown).toHaveBeenCalled();
  });

  it("handles keyboard events with onClick fallback", () => {
    const mockOnClick = jest.fn();
    render(
      <Link data-testid="test-link" href="/test" onClick={mockOnClick}>
        Test Link
      </Link>,
    );

    const link = screen.getByTestId("test-link");
    fireEvent.keyDown(link, { key: "Enter" });
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("renders with default props", () => {
    render(<Link data-testid="default-link">Default Link</Link>);

    const link = screen.getByTestId("default-link");
    expect(link).toHaveAttribute("href", "");
    expect(link).toHaveAttribute("role", "link");
  });

  it("renders as button when onClick provided without href", () => {
    const mockOnClick = jest.fn();
    render(
      <Link data-testid="button-link" onClick={mockOnClick}>
        Button Link
      </Link>,
    );

    const button = screen.getByTestId("button-link");
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("role", "button");
  });

  it("handles button click when rendered as button", () => {
    const mockOnClick = jest.fn();
    render(
      <Link data-testid="button-link" onClick={mockOnClick}>
        Button Link
      </Link>,
    );

    const button = screen.getByTestId("button-link");
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalled();
  });
});
