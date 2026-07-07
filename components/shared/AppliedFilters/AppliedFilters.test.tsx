import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AppliedFilterItem, AppliedFiltersProps } from "@/types";
import AppliedFilters from "./AppliedFilters";

vi.mock("@/utils", () => ({
  getFilterItems: vi.fn(),
}));

vi.mock("@/components", () => ({
  AccordionFilterItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  BorderedText: ({ text }: { text: string }) => (
    <span data-testid="bordered-text">{text}</span>
  ),
  Link: ({
    children,
    onClick,
    ...rest
  }: {
    children: React.ReactNode;
    onClick: () => void;
    [key: string]: unknown;
  }) => (
    <a onClick={onClick} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@/constants/Ids", () => ({
  FILTER_IDS: { applied: "applied-filters-id" },
}));

import { getFilterItems } from "@/utils";

const mockGetFilterItems = vi.mocked(getFilterItems);

const chatProps: AppliedFiltersProps = {
  filters: {
    filterType: "chat",
    filters: {
      date: {
        from: { day: "1", month: "1", year: "2024" },
        to: { day: "31", month: "12", year: "2024" },
        errorText: "",
      },
    },
  },
  handleReset: vi.fn(),
};

const adminProps: AppliedFiltersProps = {
  filters: {
    filterType: "admin",
    filters: {
      date: {
        from: { day: "1", month: "1", year: "2024" },
        to: { day: "31", month: "12", year: "2024" },
        errorText: "",
      },
      topics: { inScope: ["topic1"], outOfScope: "", errorText: "" },
      feedback: { values: [], errorText: "" },
      applied: true,
    },
  },
  handleReset: vi.fn(),
};

describe("AppliedFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the applied filters container", () => {
    mockGetFilterItems.mockReturnValue([]);
    render(<AppliedFilters {...chatProps} />);
    expect(screen.getByTestId("applied-filters")).toBeInTheDocument();
  });

  it("sets the correct id on the container", () => {
    mockGetFilterItems.mockReturnValue([]);
    render(<AppliedFilters {...chatProps} />);
    expect(screen.getByTestId("applied-filters")).toHaveAttribute(
      "id",
      "applied-filters-id",
    );
  });

  it("renders no filter items when getFilterItems returns empty", () => {
    mockGetFilterItems.mockReturnValue([]);
    render(<AppliedFilters {...chatProps} />);
    expect(screen.queryAllByTestId("bordered-text")).toHaveLength(0);
  });

  it("renders a BorderedText for each filter item", () => {
    const items: AppliedFilterItem[] = [
      { label: "Date", value: "From 01/01/24 to 31/12/24" },
      { label: "Feedback", value: "Positive" },
    ];
    mockGetFilterItems.mockReturnValue(items);
    render(<AppliedFilters {...adminProps} />);
    const borderedTexts = screen.getAllByTestId("bordered-text");
    expect(borderedTexts).toHaveLength(2);
  });

  it("renders filter items with correct label and value text", () => {
    const items: AppliedFilterItem[] = [
      { label: "Date", value: "From 01/01/24 to 31/12/24" },
    ];
    mockGetFilterItems.mockReturnValue(items);
    render(<AppliedFilters {...chatProps} />);
    expect(screen.getByTestId("bordered-text")).toHaveTextContent(
      "Date: From 01/01/24 to 31/12/24",
    );
  });

  it("renders the reset link", () => {
    mockGetFilterItems.mockReturnValue([]);
    render(<AppliedFilters {...chatProps} />);
    expect(
      screen.getByTestId("applied-filters-reset-link"),
    ).toBeInTheDocument();
  });

  it("calls handleReset when the reset link is clicked", async () => {
    mockGetFilterItems.mockReturnValue([]);
    const handleReset = vi.fn();
    render(<AppliedFilters {...{ ...chatProps, handleReset }} />);
    await userEvent.click(screen.getByTestId("applied-filters-reset-link"));
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it("passes the full props to getFilterItems", () => {
    mockGetFilterItems.mockReturnValue([]);
    render(<AppliedFilters {...chatProps} />);
    expect(mockGetFilterItems).toHaveBeenCalledWith({
      filters: chatProps.filters,
      handleReset: chatProps.handleReset,
    });
  });
});
