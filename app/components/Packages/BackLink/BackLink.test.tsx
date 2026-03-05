import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import BackLink from "./BackLink";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("BackLink renders correctly", () => {
  it("BackLink is in the document", () => {
    render(
      <BackLink
        data-testid="accessibility-statement-home-link"
        aria-label="Home"
        tabIndex={0}
        onClick={jest.fn()}
      >
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>
          Home
        </span>
      </BackLink>,
    );
    const backlink = screen.getByTestId("accessibility-statement-home-link");
    expect(backlink).toBeInTheDocument();
  });

  it("handles keyboard events", () => {
    const mockOnClick = jest.fn();
    render(
      <BackLink data-testid="test-backlink" onClick={mockOnClick}>
        Back
      </BackLink>,
    );

    const backlink = screen.getByTestId("test-backlink");

    // Test Enter key
    fireEvent.keyDown(backlink, { key: "Enter" });
    expect(mockOnClick).toHaveBeenCalled();

    // Test Space key
    mockOnClick.mockClear();
    fireEvent.keyDown(backlink, { key: " " });
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("renders with default props", () => {
    render(<BackLink data-testid="default-backlink" />);
    const backlink = screen.getByTestId("default-backlink");
    expect(backlink).toHaveTextContent("Back");
    expect(backlink).toHaveAttribute("role", "link");
    expect(backlink).toHaveAttribute("tabIndex", "0");
  });
});
