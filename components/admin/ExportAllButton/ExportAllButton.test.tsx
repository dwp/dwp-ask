import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MockChildrenAndProps } from "@/types";
import ExportAllButton from "./ExportAllButton";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: MockChildrenAndProps) => (
    <a {...props}>{children}</a>
  ),
}));

describe("ExportAllButton", () => {
  const onClick = vi.fn();

  it("renders button name and result text", () => {
    render(
      <ExportAllButton
        onClick={onClick}
        buttonName="Export CSV"
        resultText="10 results"
        rowsLength={10}
      />,
    );

    expect(screen.getByText("10 results")).toBeInTheDocument();
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });

  it("hides export link when rowsLength is 0", () => {
    render(
      <ExportAllButton
        onClick={onClick}
        buttonName="Export CSV"
        rowsLength={0}
      />,
    );

    expect(screen.queryByTestId("export-all-link")).toBeNull();
  });

  it("does not render result text when not provided", () => {
    render(
      <ExportAllButton
        onClick={onClick}
        buttonName="Export CSV"
        rowsLength={5}
      />,
    );

    expect(screen.getByTestId("export-all-container")).toBeInTheDocument();
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });

  it("calls onClick when link is clicked", () => {
    render(
      <ExportAllButton
        onClick={onClick}
        buttonName="Export CSV"
        rowsLength={5}
      />,
    );

    fireEvent.click(screen.getByText("Export CSV"));
    expect(onClick).toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(
      <ExportAllButton
        onClick={onClick}
        buttonName="Export CSV"
        className="custom"
        rowsLength={1}
      />,
    );

    const container = screen.getByTestId("export-all-container");
    expect(container.className).toContain("custom");
  });
});
