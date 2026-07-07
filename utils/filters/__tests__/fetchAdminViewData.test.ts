import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DateParts, TopicFiltersType } from "@/types";
import { fetchAdminViewData } from "../fetchAdminViewData";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/utils/api/getFeedbackList", () => ({
  default: vi.fn(),
}));

vi.mock("../../helpers", () => ({
  convertDateToISO: vi.fn(
    (date: DateParts) => `${date.year}-${date.month}-${date.day}`,
  ),
}));

vi.mock("../../logger", () => ({
  default: { error: vi.fn() },
}));

vi.mock("@/utils/shared/helper", () => ({
  validateDateRange: vi.fn(),
}));

vi.mock("../normaliseTopics.ts", () => ({
  normaliseTopics: vi.fn(),
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

import getFeedbackList from "@/utils/api/getFeedbackList";
import { validateDateRange } from "@/utils/shared/helper";
import { convertDateToISO } from "../../helpers";
import logger from "../../logger";
import { normaliseTopics } from "../normaliseTopics";

const fromDate: DateParts = { day: "01", month: "01", year: "2023" };
const toDate: DateParts = { day: "31", month: "12", year: "2023" };
const feedback = ["true", "false"];
const topics: TopicFiltersType = { inScope: ["housing"], outOfScope: "" };
const mockResponse = {
  data: [{ id: 1, question: "What is UC?" }],
  totalPages: 3,
};

function mockValidDate() {
  vi.mocked(validateDateRange).mockReturnValue({ valid: true, message: "" });
}

function mockInvalidDate(message = "Invalid date range") {
  vi.mocked(validateDateRange).mockReturnValue({ valid: false, message });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("fetchAdminViewData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(normaliseTopics).mockReturnValue(["housing"]);
    vi.mocked(getFeedbackList).mockResolvedValue(mockResponse);
  });

  describe("when the date range is valid", () => {
    it("returns the result from getFeedbackList", async () => {
      mockValidDate();

      const result = await fetchAdminViewData(
        fromDate,
        toDate,
        feedback,
        topics,
      );

      expect(result).toEqual(mockResponse);
    });

    it("calls validateDateRange with fromDate and toDate", async () => {
      mockValidDate();

      await fetchAdminViewData(fromDate, toDate, feedback, topics);

      expect(validateDateRange).toHaveBeenCalledWith(fromDate, toDate);
    });

    it("calls convertDateToISO for both fromDate and toDate", async () => {
      mockValidDate();

      await fetchAdminViewData(fromDate, toDate, feedback, topics);

      expect(convertDateToISO).toHaveBeenCalledWith(fromDate);
      expect(convertDateToISO).toHaveBeenCalledWith(toDate);
    });

    it("calls normaliseTopics with the topics argument", async () => {
      mockValidDate();

      await fetchAdminViewData(fromDate, toDate, feedback, topics);

      expect(normaliseTopics).toHaveBeenCalledWith(topics);
    });

    it("calls getFeedbackList with the correct arguments", async () => {
      mockValidDate();
      vi.mocked(convertDateToISO)
        .mockReturnValueOnce("2023-01-01")
        .mockReturnValueOnce("2023-12-31");
      vi.mocked(normaliseTopics).mockReturnValue(["housing"]);

      await fetchAdminViewData(fromDate, toDate, feedback, topics, 2);

      expect(getFeedbackList).toHaveBeenCalledWith(
        "2023-01-01",
        "2023-12-31",
        2,
        feedback,
        ["housing"],
      );
    });

    it("defaults page_number to 1 when page is not provided", async () => {
      mockValidDate();
      vi.mocked(convertDateToISO)
        .mockReturnValueOnce("2023-01-01")
        .mockReturnValueOnce("2023-12-31");

      await fetchAdminViewData(fromDate, toDate, feedback, topics);

      expect(getFeedbackList).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        1,
        expect.anything(),
        expect.anything(),
      );
    });

    it("uses the provided page number when given", async () => {
      mockValidDate();

      await fetchAdminViewData(fromDate, toDate, feedback, topics, 5);

      expect(vi.mocked(getFeedbackList).mock.calls.at(-1)![2]).toBe(5);
    });

    it("passes the normalised topics to getFeedbackList", async () => {
      mockValidDate();
      vi.mocked(normaliseTopics).mockReturnValue(["legacy-benefits"]);

      await fetchAdminViewData(fromDate, toDate, feedback, topics);

      expect(vi.mocked(getFeedbackList).mock.calls.at(-1)![4]).toEqual([
        "legacy-benefits",
      ]);
    });

    it("passes the feedback array to getFeedbackList", async () => {
      mockValidDate();

      await fetchAdminViewData(fromDate, toDate, ["true"], topics);

      expect(vi.mocked(getFeedbackList).mock.calls.at(-1)![3]).toEqual([
        "true",
      ]);
    });
  });

  describe("when the date range is invalid", () => {
    it("returns undefined when the date range is invalid", async () => {
      mockInvalidDate();

      const result = await fetchAdminViewData(
        fromDate,
        toDate,
        feedback,
        topics,
      );

      expect(result).toBeUndefined();
    });

    it("does not call getFeedbackList when the date range is invalid", async () => {
      mockInvalidDate();

      await fetchAdminViewData(fromDate, toDate, feedback, topics);

      expect(getFeedbackList).not.toHaveBeenCalled();
    });

    it("does not call convertDateToISO when the date range is invalid", async () => {
      mockInvalidDate();

      await fetchAdminViewData(fromDate, toDate, feedback, topics);

      expect(convertDateToISO).not.toHaveBeenCalled();
    });

    it("does not call normaliseTopics when the date range is invalid", async () => {
      mockInvalidDate();

      await fetchAdminViewData(fromDate, toDate, feedback, topics);

      expect(normaliseTopics).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("logs an error when getFeedbackList throws", async () => {
      mockValidDate();
      const error = new Error("Network failure");
      vi.mocked(getFeedbackList).mockRejectedValue(error);

      await fetchAdminViewData(fromDate, toDate, feedback, topics);

      expect(logger.error).toHaveBeenCalledWith(
        "Error in fetchAdminViewData",
        expect.objectContaining({ errorMessage: "Network failure" }),
      );
    });

    it("logs the stack trace when getFeedbackList throws an Error", async () => {
      mockValidDate();
      const error = new Error("Network failure");
      vi.mocked(getFeedbackList).mockRejectedValue(error);

      await fetchAdminViewData(fromDate, toDate, feedback, topics);

      expect(logger.error).toHaveBeenCalledWith(
        "Error in fetchAdminViewData",
        expect.objectContaining({ stack: expect.any(String) }),
      );
    });

    it("logs 'Unknown error' when a non-Error is thrown", async () => {
      mockValidDate();
      vi.mocked(getFeedbackList).mockRejectedValue("a plain string error");

      await fetchAdminViewData(fromDate, toDate, feedback, topics);

      expect(logger.error).toHaveBeenCalledWith(
        "Error in fetchAdminViewData",
        expect.objectContaining({
          errorMessage: "Unknown error",
          stack: undefined,
        }),
      );
    });

    it("returns undefined when getFeedbackList throws", async () => {
      mockValidDate();
      vi.mocked(getFeedbackList).mockRejectedValue(
        new Error("Network failure"),
      );

      const result = await fetchAdminViewData(
        fromDate,
        toDate,
        feedback,
        topics,
      );

      expect(result).toBeUndefined();
    });
  });
});
