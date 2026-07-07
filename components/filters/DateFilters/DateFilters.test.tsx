import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FILTER_IDS } from "@/constants/Ids";
import type { DateParts } from "@/types";
import DateFilters from "./DateFilters";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/components", () => ({
  DateField: ({
    id,
    title,
    "data-testid": testId,
    errorText,
    value,
    onChange,
  }: {
    id: string;
    title: string;
    "data-testid"?: string;
    errorText: string;
    value: DateParts;
    onChange: (e: DateParts) => void;
  }) => (
    <div data-testid={testId} data-id={id}>
      <label>{title}</label>
      <span data-testid={`${testId}-error`}>{errorText}</span>
      <span data-testid={`${testId}-value`}>{JSON.stringify(value)}</span>
      <button
        data-testid={`${testId}-trigger`}
        onClick={() => onChange({ day: "01", month: "01", year: "2024" })}
      >
        Change
      </button>
    </div>
  ),
}));

vi.mock("@/constants/Ids", () => ({
  FILTER_IDS: { dates: "filter-dates-id" },
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const fromDate: DateParts = { day: "10", month: "03", year: "2023" };
const toDate: DateParts = { day: "20", month: "06", year: "2023" };

function renderDateFilters(
  overrides: Partial<React.ComponentProps<typeof DateFilters>> = {},
) {
  const onDateChange = vi.fn();
  const utils = render(
    <DateFilters
      from={fromDate}
      to={toDate}
      onDateChange={onDateChange}
      {...overrides}
    />,
  );
  return { ...utils, onDateChange };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("DateFilters", () => {
  describe("rendering", () => {
    it("renders the outer container", () => {
      renderDateFilters();

      expect(screen.getByTestId("date-filters-container")).toBeInTheDocument();
    });

    it("sets the id from FILTER_IDS.dates on the outer container", () => {
      renderDateFilters();

      expect(screen.getByTestId("date-filters-container")).toHaveAttribute(
        "id",
        FILTER_IDS.dates,
      );
    });

    it("applies the flex gap-3 layout classes to the outer container", () => {
      renderDateFilters();

      expect(screen.getByTestId("date-filters-container")).toHaveClass(
        "flex",
        "gap-3",
      );
    });

    it("renders the from-date container", () => {
      renderDateFilters();

      expect(
        screen.getByTestId("date-filters-from-date-container"),
      ).toBeInTheDocument();
    });

    it("renders the to-date container", () => {
      renderDateFilters();

      expect(
        screen.getByTestId("date-filters-to-date-container"),
      ).toBeInTheDocument();
    });
  });

  describe("from DateField", () => {
    it("renders the from DateField", () => {
      renderDateFilters();

      expect(screen.getByTestId("date-filters-from-date")).toBeInTheDocument();
    });

    it("passes id='from-date' to the from DateField", () => {
      renderDateFilters();

      expect(screen.getByTestId("date-filters-from-date")).toHaveAttribute(
        "data-id",
        "from-date",
      );
    });

    it("passes the correct title to the from DateField", () => {
      renderDateFilters();

      expect(screen.getByText("From date")).toBeInTheDocument();
    });

    it("passes an empty errorText to the from DateField", () => {
      renderDateFilters();

      expect(
        screen.getByTestId("date-filters-from-date-error"),
      ).toHaveTextContent("");
    });

    it("passes the from value to the from DateField", () => {
      renderDateFilters();

      expect(
        screen.getByTestId("date-filters-from-date-value"),
      ).toHaveTextContent(JSON.stringify(fromDate));
    });
  });

  describe("to DateField", () => {
    it("renders the to DateField", () => {
      renderDateFilters();

      expect(screen.getByTestId("date-filters-to-date")).toBeInTheDocument();
    });

    it("passes id='to-date' to the to DateField", () => {
      renderDateFilters();

      expect(screen.getByTestId("date-filters-to-date")).toHaveAttribute(
        "data-id",
        "to-date",
      );
    });

    it("passes the correct title to the to DateField", () => {
      renderDateFilters();

      expect(screen.getByText("To date (optional)")).toBeInTheDocument();
    });

    it("passes an empty errorText to the to DateField", () => {
      renderDateFilters();

      expect(
        screen.getByTestId("date-filters-to-date-error"),
      ).toHaveTextContent("");
    });

    it("passes the to value to the to DateField", () => {
      renderDateFilters();

      expect(
        screen.getByTestId("date-filters-to-date-value"),
      ).toHaveTextContent(JSON.stringify(toDate));
    });
  });

  describe("onChange callbacks", () => {
    it("calls onDateChange with the date parts and 'from' when the from field changes", async () => {
      const { onDateChange } = renderDateFilters();

      screen.getByTestId("date-filters-from-date-trigger").click();

      expect(onDateChange).toHaveBeenCalledTimes(1);
      expect(onDateChange).toHaveBeenCalledWith(
        { day: "01", month: "01", year: "2024" },
        "from",
      );
    });

    it("calls onDateChange with the date parts and 'to' when the to field changes", async () => {
      const { onDateChange } = renderDateFilters();

      screen.getByTestId("date-filters-to-date-trigger").click();

      expect(onDateChange).toHaveBeenCalledTimes(1);
      expect(onDateChange).toHaveBeenCalledWith(
        { day: "01", month: "01", year: "2024" },
        "to",
      );
    });

    it("does not call onDateChange on render", () => {
      const { onDateChange } = renderDateFilters();

      expect(onDateChange).not.toHaveBeenCalled();
    });

    it("calls onDateChange independently for from and to changes", () => {
      const { onDateChange } = renderDateFilters();

      screen.getByTestId("date-filters-from-date-trigger").click();
      screen.getByTestId("date-filters-to-date-trigger").click();

      expect(onDateChange).toHaveBeenCalledTimes(2);
      expect(onDateChange).toHaveBeenNthCalledWith(
        1,
        { day: "01", month: "01", year: "2024" },
        "from",
      );
      expect(onDateChange).toHaveBeenNthCalledWith(
        2,
        { day: "01", month: "01", year: "2024" },
        "to",
      );
    });
  });
});
