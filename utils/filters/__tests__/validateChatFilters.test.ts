import { describe, expect, it, vi } from "vitest";
import { FILTER_IDS } from "@/constants/Ids";
import type { ChatFiltersState } from "@/types";
import { validateChatFilters } from "../validateChatFilters";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/utils/shared/helper", () => ({
  validateDateRange: vi.fn(),
}));

vi.mock("@/constants/Ids", () => ({
  FILTER_IDS: { dates: "filter-dates-id" },
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

import { validateDateRange } from "@/utils/shared/helper";

const validDate = { day: "01", month: "06", year: "2023" };

const makeFilters = (
  overrides: Partial<ChatFiltersState> = {},
): ChatFiltersState => ({
  date: { from: validDate, to: validDate, errorText: "" },
  ...overrides,
});

function mockDatesValid() {
  vi.mocked(validateDateRange).mockReturnValue({ valid: true, message: "" });
}

function mockDatesInvalid(message = "Invalid date range") {
  vi.mocked(validateDateRange).mockReturnValue({ valid: false, message });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("validateChatFilters", () => {
  describe("happy path — no errors", () => {
    it("returns an empty array when dates are valid", () => {
      mockDatesValid();

      const result = validateChatFilters(makeFilters());

      expect(result).toEqual([]);
    });

    it("always returns an array", () => {
      mockDatesValid();

      const result = validateChatFilters(makeFilters());

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("date validation error", () => {
    it("adds a date error when validateDateRange returns invalid", () => {
      mockDatesInvalid("From date must be before To date");

      const result = validateChatFilters(makeFilters());

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        text: "From date must be before To date",
        href: FILTER_IDS.dates,
        scope: "dates",
      });
    });

    it("falls back to 'Invalid date range' when message is empty string", () => {
      vi.mocked(validateDateRange).mockReturnValue({
        valid: false,
        message: "",
      });

      const result = validateChatFilters(makeFilters());

      expect(result[0].text).toBe("Invalid date range");
    });

    it("falls back to 'Invalid date range' when message is undefined", () => {
      vi.mocked(validateDateRange).mockReturnValue({
        valid: false,
        message: undefined,
      });

      const result = validateChatFilters(makeFilters());

      expect(result[0].text).toBe("Invalid date range");
    });

    it("sets the correct href from FILTER_IDS.dates", () => {
      mockDatesInvalid();

      const result = validateChatFilters(makeFilters());

      expect(result[0].href).toBe(FILTER_IDS.dates);
    });

    it("sets scope to 'dates'", () => {
      mockDatesInvalid();

      const result = validateChatFilters(makeFilters());

      expect(result[0].scope).toBe("dates");
    });

    it("calls validateDateRange with the correct from and to dates", () => {
      mockDatesValid();
      const from = { day: "01", month: "01", year: "2023" };
      const to = { day: "31", month: "12", year: "2023" };

      validateChatFilters(makeFilters({ date: { from, to, errorText: "" } }));

      expect(validateDateRange).toHaveBeenCalledWith(from, to);
    });

    it("returns only one error even when dates are invalid", () => {
      mockDatesInvalid();

      const result = validateChatFilters(makeFilters());

      expect(result).toHaveLength(1);
    });
  });
});
