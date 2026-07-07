import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DateParts } from "@/types";
import { exportChatArchivePdf } from "../exportChatArchivePdf";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/utils/api/getPdfDownload", () => ({
  default: vi.fn().mockResolvedValue(new Blob()),
}));

vi.mock("@/utils/shared/helper", () => ({
  handleDownload: vi.fn(),
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

import getPdfDownload from "@/utils/api/getPdfDownload";
import { handleDownload } from "@/utils/shared/helper";

const startDate: DateParts = { day: "01", month: "01", year: "2023" };
const endDate: DateParts = { day: "31", month: "12", year: "2023" };
const currentPage = 1;

function makeEvent() {
  return { preventDefault: vi.fn() } as unknown as React.MouseEvent<
    HTMLButtonElement,
    MouseEvent
  >;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("exportChatArchivePdf", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("always", () => {
    it("calls e.preventDefault()", () => {
      const event = makeEvent();
      exportChatArchivePdf(event, startDate, endDate, currentPage);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
  });

  describe("handleDownload", () => {
    it("calls handleDownload once", () => {
      exportChatArchivePdf(makeEvent(), startDate, endDate, currentPage);

      expect(handleDownload).toHaveBeenCalledTimes(1);
    });

    it("passes startDate as the first argument", () => {
      const from: DateParts = { day: "15", month: "03", year: "2024" };
      exportChatArchivePdf(makeEvent(), from, endDate, currentPage);

      expect(vi.mocked(handleDownload).mock.calls.at(-1)![0]).toEqual(from);
    });

    it("passes endDate as the second argument", () => {
      const to: DateParts = { day: "28", month: "06", year: "2024" };
      exportChatArchivePdf(makeEvent(), startDate, to, currentPage);

      expect(vi.mocked(handleDownload).mock.calls.at(-1)![1]).toEqual(to);
    });

    it("passes currentPage as the third argument", () => {
      exportChatArchivePdf(makeEvent(), startDate, endDate, 5);

      expect(vi.mocked(handleDownload).mock.calls.at(-1)![2]).toBe(5);
    });

    it("passes an adapter function as the fourth argument", () => {
      exportChatArchivePdf(makeEvent(), startDate, endDate, currentPage);

      expect(vi.mocked(handleDownload).mock.calls.at(-1)![3]).toBeTypeOf(
        "function",
      );
    });

    it("passes an empty array as the fifth argument (topics)", () => {
      exportChatArchivePdf(makeEvent(), startDate, endDate, currentPage);

      expect(vi.mocked(handleDownload).mock.calls.at(-1)![4]).toEqual([]);
    });

    it("passes 'pdf' as the sixth argument (format)", () => {
      exportChatArchivePdf(makeEvent(), startDate, endDate, currentPage);

      expect(vi.mocked(handleDownload).mock.calls.at(-1)![5]).toBe("pdf");
    });

    it("calls handleDownload with all arguments in one call", () => {
      exportChatArchivePdf(makeEvent(), startDate, endDate, currentPage);

      expect(handleDownload).toHaveBeenCalledWith(
        startDate,
        endDate,
        currentPage,
        expect.any(Function),
        [],
        "pdf",
      );
    });
  });

  describe("getPdfDownloadAdapter", () => {
    it("calls getPdfDownload via the adapter with start_date, end_date, and currentPage", async () => {
      exportChatArchivePdf(makeEvent(), startDate, endDate, currentPage);

      const adapter = vi.mocked(handleDownload).mock.calls.at(-1)![3];
      await adapter({
        start_date: "2023-01-01",
        end_date: "2023-12-31",
        currentPage: 2,
        topics: ["housing"],
      });

      expect(getPdfDownload).toHaveBeenCalledWith(
        "2023-01-01",
        "2023-12-31",
        2,
      );
    });

    it("does not pass feedback_types to getPdfDownload", async () => {
      exportChatArchivePdf(makeEvent(), startDate, endDate, currentPage);

      const adapter = vi.mocked(handleDownload).mock.calls.at(-1)![3];
      await adapter({
        start_date: "2023-01-01",
        end_date: "2023-12-31",
        currentPage: 1,
        topics: ["housing"],
        feedback_types: ["true"],
      });

      expect(getPdfDownload).toHaveBeenCalledWith(
        "2023-01-01",
        "2023-12-31",
        1,
      );
      expect(vi.mocked(getPdfDownload).mock.calls[0]).toHaveLength(3);
    });
  });
});
