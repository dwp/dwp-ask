import { describe, expect, it, vi } from "vitest";
import { TOPIC_CLASH_ERROR_INLINE } from "@/constants/Admin";
import { FILTER_IDS } from "@/constants/Ids";
import { validateAdminFilters } from "../validateAdminFilters";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/utils/shared/helper", () => ({
  validateDateRange: vi.fn(),
}));

vi.mock("@/constants/Admin", () => ({
  TOPIC_CLASH_ERROR_INLINE:
    "You cannot select both in-scope and out-of-scope topics",
}));

vi.mock("@/constants/Ids", () => ({
  FILTER_IDS: {
    topics: "filter-topics-id",
    dates: "filter-dates-id",
  },
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

import type { AdminFiltersState } from "@/types";
import { validateDateRange } from "@/utils/shared/helper";

const validDate = { day: "01", month: "06", year: "2023" };

const makeFilters = (
  overrides: Partial<AdminFiltersState> = {},
): AdminFiltersState => ({
  date: { from: validDate, to: validDate, errorText: "" },
  topics: { inScope: [], outOfScope: "", errorText: "" },
  feedback: { values: [], errorText: "" },
  applied: false,
  ...overrides,
});

function mockDatesValid() {
  vi.mocked(validateDateRange).mockReturnValue({ valid: true, message: "" });
}

function mockDatesInvalid(message = "Invalid date range") {
  vi.mocked(validateDateRange).mockReturnValue({ valid: false, message });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("validateAdminFilters", () => {
  describe("happy path — no errors", () => {
    it("returns an empty array when dates are valid and there is no topic clash", () => {
      mockDatesValid();

      const result = validateAdminFilters(makeFilters());

      expect(result).toEqual([]);
    });

    it("returns an empty array when only inScope topics are selected", () => {
      mockDatesValid();

      const result = validateAdminFilters(
        makeFilters({
          topics: { inScope: ["housing"], outOfScope: "", errorText: "" },
        }),
      );

      expect(result).toEqual([]);
    });

    it("returns an empty array when only an outOfScope topic is selected", () => {
      mockDatesValid();

      const result = validateAdminFilters(
        makeFilters({
          topics: { inScope: [], outOfScope: "legacy-benefits", errorText: "" },
        }),
      );

      expect(result).toEqual([]);
    });

    it("returns an empty array when no topics are selected", () => {
      mockDatesValid();

      const result = validateAdminFilters(
        makeFilters({ topics: { inScope: [], outOfScope: "", errorText: "" } }),
      );

      expect(result).toEqual([]);
    });
  });

  describe("topic clash error", () => {
    it("adds a topic clash error when inScope and outOfScope are both set", () => {
      mockDatesValid();

      const result = validateAdminFilters(
        makeFilters({
          topics: {
            inScope: ["housing"],
            outOfScope: "legacy-benefits",
            errorText: "",
          },
        }),
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        text: TOPIC_CLASH_ERROR_INLINE,
        href: FILTER_IDS.topics,
        scope: "topics",
      });
    });

    it("adds a topic clash error when multiple inScope topics and an outOfScope topic are selected", () => {
      mockDatesValid();

      const result = validateAdminFilters(
        makeFilters({
          topics: {
            inScope: ["housing", "work-capability"],
            outOfScope: "legacy-benefits",
            errorText: "",
          },
        }),
      );

      expect(result.some((e) => e.scope === "topics")).toBe(true);
    });

    it("does not add a topic clash error when inScope is empty even if outOfScope is set", () => {
      mockDatesValid();

      const result = validateAdminFilters(
        makeFilters({
          topics: { inScope: [], outOfScope: "legacy-benefits", errorText: "" },
        }),
      );

      expect(result.every((e) => e.scope !== "topics")).toBe(true);
    });

    it("does not add a topic clash error when outOfScope is empty even if inScope is set", () => {
      mockDatesValid();

      const result = validateAdminFilters(
        makeFilters({
          topics: { inScope: ["housing"], outOfScope: "", errorText: "" },
        }),
      );

      expect(result.every((e) => e.scope !== "topics")).toBe(true);
    });
  });

  describe("date validation error", () => {
    it("adds a date error when validateDateRange returns invalid", () => {
      mockDatesInvalid("From date must be before To date");

      const result = validateAdminFilters(makeFilters());

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        text: "From date must be before To date",
        href: FILTER_IDS.dates,
        scope: "dates",
      });
    });

    it("falls back to 'Invalid date range' when message is empty", () => {
      vi.mocked(validateDateRange).mockReturnValue({
        valid: false,
        message: "",
      });

      const result = validateAdminFilters(makeFilters());

      expect(result[0].text).toBe("Invalid date range");
    });

    it("falls back to 'Invalid date range' when message is undefined", () => {
      vi.mocked(validateDateRange).mockReturnValue({
        valid: false,
        message: undefined,
      });

      const result = validateAdminFilters(makeFilters());

      expect(result[0].text).toBe("Invalid date range");
    });

    it("calls validateDateRange with the correct from and to dates", () => {
      mockDatesValid();
      const from = { day: "01", month: "01", year: "2023" };
      const to = { day: "31", month: "12", year: "2023" };

      validateAdminFilters(makeFilters({ date: { from, to, errorText: "" } }));

      expect(validateDateRange).toHaveBeenCalledWith(from, to);
    });
  });

  describe("multiple errors", () => {
    it("returns both a topic clash error and a date error when both are invalid", () => {
      mockDatesInvalid("From date must be before To date");

      const result = validateAdminFilters(
        makeFilters({
          topics: {
            inScope: ["housing"],
            outOfScope: "legacy-benefits",
            errorText: "",
          },
        }),
      );

      expect(result).toHaveLength(2);
      expect(result.find((e) => e.scope === "topics")).toBeDefined();
      expect(result.find((e) => e.scope === "dates")).toBeDefined();
    });

    it("returns topic error before date error", () => {
      mockDatesInvalid("Invalid date range");

      const result = validateAdminFilters(
        makeFilters({
          topics: {
            inScope: ["housing"],
            outOfScope: "legacy-benefits",
            errorText: "",
          },
        }),
      );

      expect(result[0].scope).toBe("topics");
      expect(result[1].scope).toBe("dates");
    });
  });
});
