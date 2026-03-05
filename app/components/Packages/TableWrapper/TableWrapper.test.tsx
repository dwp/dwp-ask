import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import TableWrapper from "./TableWrapper";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

const testHeaders = ["Test Heading 1", "Test Heading 2"];

describe("TableWrapper renders correctly", () => {
  it("TableWrapper text renders correctly", () => {
    const dataTestId = "test-table-wrapper";
    render(
      <TableWrapper data-testid={dataTestId} columnTitles={testHeaders}>
        Table Wrapper Children
      </TableWrapper>,
    );

    const tableHeaders = screen.getAllByTestId(`${dataTestId}-header-column`);
    expect(tableHeaders).toHaveLength(testHeaders.length);
  });
});

describe("TableWrapper test attribute", () => {
  it("injects data-testid when passed", () => {
    render(
      <TableWrapper data-testid="test-table-wrapper" columnTitles={testHeaders}>
        Table Wrapper Children
      </TableWrapper>,
    );

    const tableWrapper = screen.getByTestId("test-table-wrapper");
    expect(tableWrapper).toHaveAttribute("data-testid", "test-table-wrapper");
  });

  it("doesn't inject data-testid when not passed", () => {
    render(
      <TableWrapper columnTitles={testHeaders}>
        Table Wrapper Children
      </TableWrapper>,
    );

    const tableWrapper = screen.getByRole("table");
    expect(tableWrapper).toHaveAttribute("data-testid", "");
  });
});
