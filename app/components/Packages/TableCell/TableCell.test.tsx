import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TableCell from "./TableCell";

describe("TableCell", () => {
  it("renders children", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Test content</TableCell>
          </tr>
        </tbody>
      </table>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies data-testid when provided", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell data-testid="test-cell">Content</TableCell>
          </tr>
        </tbody>
      </table>,
    );

    expect(screen.getByTestId("test-cell")).toBeInTheDocument();
  });

  it("applies title when provided", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell title="Test title">Content</TableCell>
          </tr>
        </tbody>
      </table>,
    );

    expect(screen.getByRole("cell")).toHaveAttribute("title", "Test title");
  });

  it("uses empty string when data-testid not provided", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Content</TableCell>
          </tr>
        </tbody>
      </table>,
    );

    expect(screen.getByRole("cell")).toHaveAttribute("data-testid", "");
  });

  it("uses empty string when title not provided", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Content</TableCell>
          </tr>
        </tbody>
      </table>,
    );

    expect(screen.getByRole("cell")).toHaveAttribute("title", "");
  });
});
