import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TableRow from "./TableRow";

describe("TableRow", () => {
  it("renders children", () => {
    render(
      <table>
        <tbody>
          <TableRow>
            <td>Test content</td>
          </TableRow>
        </tbody>
      </table>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies data-testid when provided", () => {
    render(
      <table>
        <tbody>
          <TableRow data-testid="test-row">
            <td>Content</td>
          </TableRow>
        </tbody>
      </table>,
    );

    expect(screen.getByTestId("test-row")).toBeInTheDocument();
  });

  it("uses empty string when data-testid not provided", () => {
    render(
      <table>
        <tbody>
          <TableRow>
            <td>Content</td>
          </TableRow>
        </tbody>
      </table>,
    );

    const row = screen.getByRole("row");
    expect(row).toHaveAttribute("data-testid", "");
  });
});
