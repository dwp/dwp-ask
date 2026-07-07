import { fireEvent, render, screen } from "@testing-library/react";
import Link from "./Link";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
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
    const mockOnKeyDown = vi.fn();
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
    const mockOnClick = vi.fn();
    render(
      <Link data-testid="test-link" href="/test" onClick={mockOnClick}>
        Test Link
      </Link>,
    );

    const link = screen.getByTestId("test-link");
    fireEvent.keyDown(link, { key: "Enter" });
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("does not call onClick on non-Enter/Space key without onKeyDown", () => {
    const mockOnClick = vi.fn();
    render(
      <Link data-testid="test-link" href="/test" onClick={mockOnClick}>
        Test Link
      </Link>,
    );

    fireEvent.keyDown(screen.getByTestId("test-link"), { key: "Tab" });
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("does not throw on keyDown without onClick or onKeyDown", () => {
    render(
      <Link data-testid="plain-link" href="/plain">
        Plain
      </Link>,
    );

    expect(() =>
      fireEvent.keyDown(screen.getByTestId("plain-link"), { key: "Enter" }),
    ).not.toThrow();
  });

  it("renders with default props", () => {
    render(
      <Link data-testid="default-link" href="/default">
        Default Link
      </Link>,
    );

    const link = screen.getByTestId("default-link");
    expect(link).toHaveAttribute("href", "/default");
    expect(link).toHaveAttribute("role", "link");
  });

  it("renders as button when onClick provided without href", () => {
    const mockOnClick = vi.fn();
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
    const mockOnClick = vi.fn();
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
