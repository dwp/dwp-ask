import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AppliedFiltersProps } from "@/types";
import { formatDateForApplied, getFilterItems } from "../filterUtils";

vi.mock("../normaliseTopics", () => ({
  normaliseTopics: vi.fn(),
}));

import { normaliseTopics } from "../normaliseTopics";

const mockNormaliseTopics = vi.mocked(normaliseTopics);

const baseAdminFilters = {
  date: {
    from: { day: "1", month: "1", year: "2024" },
    to: { day: "31", month: "12", year: "2024" },
    errorText: "",
  },
  topics: { inScope: [], outOfScope: "", errorText: "" },
  feedback: { values: [], errorText: "" },
  applied: false,
} satisfies import("@/types").AdminFiltersState;

const baseChatProps: AppliedFiltersProps = {
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

const baseAdminProps: AppliedFiltersProps = {
  filters: {
    filterType: "admin",
    filters: baseAdminFilters,
  },
  handleReset: vi.fn(),
};

describe("formatDateForApplied", () => {
  it("formats a date with single digit day and month", () => {
    expect(formatDateForApplied({ day: "1", month: "3", year: "2024" })).toBe(
      "01/03/24",
    );
  });

  it("formats a date with double digit day and month", () => {
    expect(formatDateForApplied({ day: "31", month: "12", year: "2024" })).toBe(
      "31/12/24",
    );
  });

  it("takes only the last two digits of the year", () => {
    expect(formatDateForApplied({ day: "1", month: "1", year: "2000" })).toBe(
      "01/01/00",
    );
  });

  it("pads single digit day with a leading zero", () => {
    expect(formatDateForApplied({ day: "5", month: "11", year: "2024" })).toBe(
      "05/11/24",
    );
  });

  it("pads single digit month with a leading zero", () => {
    expect(formatDateForApplied({ day: "15", month: "6", year: "2024" })).toBe(
      "15/06/24",
    );
  });
});

describe("getFilterItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNormaliseTopics.mockReturnValue([]);
  });

  describe("date", () => {
    it("includes a date filter item when date is present", () => {
      const result = getFilterItems(baseChatProps);
      expect(result).toContainEqual({
        label: "Date",
        value: "From 01/01/24 to 31/12/24",
      });
    });

    it("formats the from and to dates correctly in the value", () => {
      const props: AppliedFiltersProps = {
        filters: {
          filterType: "chat",
          filters: {
            date: {
              from: { day: "5", month: "6", year: "2023" },
              to: { day: "20", month: "9", year: "2023" },
              errorText: "",
            },
          },
        },
        handleReset: vi.fn(),
      };
      const result = getFilterItems(props);
      expect(result).toContainEqual({
        label: "Date",
        value: "From 05/06/23 to 20/09/23",
      });
    });
  });

  describe("chat filters", () => {
    it("returns only the date item for chat filter type", () => {
      const result = getFilterItems(baseChatProps);
      expect(result).toHaveLength(1);
      expect(result[0].label).toBe("Date");
    });

    it("does not call normaliseTopics for chat filter type", () => {
      getFilterItems(baseChatProps);
      expect(mockNormaliseTopics).not.toHaveBeenCalled();
    });
  });

  describe("admin filters - feedback", () => {
    it("adds a positive feedback item when feedback value is 'true'", () => {
      const props: AppliedFiltersProps = {
        filters: {
          filterType: "admin",
          filters: {
            ...baseAdminFilters,
            feedback: { values: ["true"], errorText: "" },
          },
        },
        handleReset: vi.fn(),
      };
      const result = getFilterItems(props);
      expect(result).toContainEqual({ label: "Feedback", value: "positive" });
    });

    it("adds a negative feedback item when feedback value is 'false'", () => {
      const props: AppliedFiltersProps = {
        filters: {
          filterType: "admin",
          filters: {
            ...baseAdminFilters,
            feedback: { values: ["false"], errorText: "" },
          },
        },
        handleReset: vi.fn(),
      };
      const result = getFilterItems(props);
      expect(result).toContainEqual({ label: "Feedback", value: "negative" });
    });

    it("adds a none feedback item when feedback value is not 'true' or 'false'", () => {
      const props: AppliedFiltersProps = {
        filters: {
          filterType: "admin",
          filters: {
            ...baseAdminFilters,
            feedback: { values: ["none"], errorText: "" },
          },
        },
        handleReset: vi.fn(),
      };
      const result = getFilterItems(props);
      expect(result).toContainEqual({ label: "Feedback", value: "none" });
    });

    it("adds multiple feedback items when multiple feedback values are present", () => {
      const props: AppliedFiltersProps = {
        filters: {
          filterType: "admin",
          filters: {
            ...baseAdminFilters,
            feedback: { values: ["true", "false"], errorText: "" },
          },
        },
        handleReset: vi.fn(),
      };
      const result = getFilterItems(props);
      const feedbackItems = result.filter((item) => item.label === "Feedback");
      expect(feedbackItems).toHaveLength(2);
      expect(feedbackItems).toContainEqual({
        label: "Feedback",
        value: "positive",
      });
      expect(feedbackItems).toContainEqual({
        label: "Feedback",
        value: "negative",
      });
    });

    it("adds no feedback items when feedback values array is empty", () => {
      const result = getFilterItems(baseAdminProps);
      expect(result.filter((item) => item.label === "Feedback")).toHaveLength(
        0,
      );
    });
  });

  describe("admin filters - topics", () => {
    it("adds a topic item for each normalised topic", () => {
      mockNormaliseTopics.mockReturnValue(["universal-credit", "pip"]);
      const result = getFilterItems(baseAdminProps);
      expect(result.filter((item) => item.label === "Topic")).toHaveLength(2);
    });

    it("replaces hyphens with spaces in topic values", () => {
      mockNormaliseTopics.mockReturnValue(["universal-credit"]);
      const result = getFilterItems(baseAdminProps);
      expect(result).toContainEqual({
        label: "Topic",
        value: "universal credit",
      });
    });

    it("replaces multiple hyphens in a single topic", () => {
      mockNormaliseTopics.mockReturnValue(["personal-independence-payment"]);
      const result = getFilterItems(baseAdminProps);
      expect(result).toContainEqual({
        label: "Topic",
        value: "personal independence payment",
      });
    });

    it("adds no topic items when normaliseTopics returns empty array", () => {
      mockNormaliseTopics.mockReturnValue([]);
      const result = getFilterItems(baseAdminProps);
      expect(result.filter((item) => item.label === "Topic")).toHaveLength(0);
    });

    it("calls normaliseTopics with the topics from filters", () => {
      const topics = { inScope: ["pip"], outOfScope: "", errorText: "" };
      const props: AppliedFiltersProps = {
        filters: {
          filterType: "admin",
          filters: { ...baseAdminFilters, topics },
        },
        handleReset: vi.fn(),
      };
      getFilterItems(props);
      expect(mockNormaliseTopics).toHaveBeenCalledWith(topics);
    });
  });

  describe("admin filters - combined", () => {
    it("returns date, feedback, and topic items together", () => {
      mockNormaliseTopics.mockReturnValue(["universal-credit"]);
      const props: AppliedFiltersProps = {
        filters: {
          filterType: "admin",
          filters: {
            ...baseAdminFilters,
            feedback: { values: ["true"], errorText: "" },
            topics: {
              inScope: ["universal-credit"],
              outOfScope: "",
              errorText: "",
            },
          },
        },
        handleReset: vi.fn(),
      };
      const result = getFilterItems(props);
      expect(result).toContainEqual({
        label: "Date",
        value: "From 01/01/24 to 31/12/24",
      });
      expect(result).toContainEqual({ label: "Feedback", value: "positive" });
      expect(result).toContainEqual({
        label: "Topic",
        value: "universal credit",
      });
    });
  });
});
