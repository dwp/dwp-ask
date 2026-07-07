import { beforeEach, describe, expect, it, vi } from "vitest";
import { LARGE_EXPORT_ERROR } from "@/constants/Admin";
import type { AdminFiltersState } from "@/types";
import { exportAdminDataCsv } from "../exportAdminDataCsv";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/utils/api/getCsvDownload", () => ({
  default: vi.fn().mockResolvedValue({}),
}));

vi.mock("@/utils/shared/helper", () => ({
  handleDownload: vi.fn(),
}));

vi.mock("@/constants/Admin", () => ({
  LARGE_EXPORT_ERROR: {
    text: "Too many rows to export",
    href: "#",
    scope: "export",
  },
}));

vi.mock("@/constants/Layout", () => ({
  MAX_CSV_ROWS_DEFAULT: 1000,
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

import getCsvDownload from "@/utils/api/getCsvDownload";
import { handleDownload } from "@/utils/shared/helper";

const mockEvent = {
  preventDefault: vi.fn(),
} as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>;

const defaultFrom = { day: "01", month: "01", year: "2023" };
const defaultTo = { day: "31", month: "12", year: "2023" };

const makeFilters = (
  overrides: Partial<AdminFiltersState> = {},
): AdminFiltersState => ({
  date: { from: defaultFrom, to: defaultTo, errorText: "" },
  topics: { inScope: [], outOfScope: "", errorText: "" },
  feedback: { values: [], errorText: "" },
  applied: false,
  ...overrides,
});

const defaultTotalRows = 100;
const defaultCurrentPage = 1;

function makeSetDisplayErrorMessages() {
  return vi.fn() as unknown as React.Dispatch<
    React.SetStateAction<import("@/types").ErrorSummaryItemType[]>
  >;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("exportAdminDataCsv", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  describe("always", () => {
    it("calls e.preventDefault()", async () => {
      const event = { preventDefault: vi.fn() } as unknown as React.MouseEvent<
        HTMLButtonElement,
        MouseEvent
      >;
      await exportAdminDataCsv(
        event,
        makeSetDisplayErrorMessages(),
        defaultTotalRows,
        makeFilters(),
        defaultCurrentPage,
      );

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
  });

  describe("when totalRows exceeds the max", () => {
    it("calls setDisplayErrorMessages with a concat updater that appends LARGE_EXPORT_ERROR", async () => {
      vi.stubEnv("NEXT_PUBLIC_MAX_ROW_CSV", "10000");
      const setDisplayErrorMessages = makeSetDisplayErrorMessages();
      await exportAdminDataCsv(
        mockEvent,
        setDisplayErrorMessages,
        10001,
        makeFilters(),
        defaultCurrentPage,
      );

      expect(setDisplayErrorMessages).toHaveBeenCalledTimes(1);

      const updater = vi.mocked(setDisplayErrorMessages).mock
        .calls[0][0] as Function;
      const result = updater([]);
      expect(result).toContain(LARGE_EXPORT_ERROR);
    });

    it("preserves existing errors when appending LARGE_EXPORT_ERROR", async () => {
      vi.stubEnv("NEXT_PUBLIC_MAX_ROW_CSV", "10000");
      const setDisplayErrorMessages = makeSetDisplayErrorMessages();
      const existingError = {
        text: "Existing error",
        href: "#",
        scope: "other",
      };
      await exportAdminDataCsv(
        mockEvent,
        setDisplayErrorMessages,
        10001,
        makeFilters(),
        defaultCurrentPage,
      );

      const updater = vi.mocked(setDisplayErrorMessages).mock
        .calls[0][0] as Function;
      const result = updater([existingError]);
      expect(result).toContain(existingError);
      expect(result).toContain(LARGE_EXPORT_ERROR);
    });

    it("does not call handleDownload when totalRows exceeds the max", async () => {
      vi.stubEnv("NEXT_PUBLIC_MAX_ROW_CSV", "10000");
      await exportAdminDataCsv(
        mockEvent,
        makeSetDisplayErrorMessages(),
        10001,
        makeFilters(),
        defaultCurrentPage,
      );

      expect(handleDownload).not.toHaveBeenCalled();
    });

    it("uses NEXT_PUBLIC_MAX_ROW_CSV env var when set", async () => {
      vi.stubEnv("NEXT_PUBLIC_MAX_ROW_CSV", "500");
      const setDisplayErrorMessages = makeSetDisplayErrorMessages();

      await exportAdminDataCsv(
        mockEvent,
        setDisplayErrorMessages,
        501,
        makeFilters(),
        defaultCurrentPage,
      );

      expect(setDisplayErrorMessages).toHaveBeenCalledTimes(1);
      expect(handleDownload).not.toHaveBeenCalled();
    });

    it("falls back to MAX_CSV_ROWS_DEFAULT when NEXT_PUBLIC_MAX_ROW_CSV is not set", async () => {
      vi.stubEnv("NEXT_PUBLIC_MAX_ROW_CSV", "");
      const setDisplayErrorMessages = makeSetDisplayErrorMessages();

      // 1000 is MAX_CSV_ROWS_DEFAULT, so 1001 should trigger the error
      await exportAdminDataCsv(
        mockEvent,
        setDisplayErrorMessages,
        1001,
        makeFilters(),
        defaultCurrentPage,
      );

      expect(setDisplayErrorMessages).toHaveBeenCalledTimes(1);
    });
  });

  describe("when totalRows is within the limit", () => {
    it("does not call setDisplayErrorMessages", async () => {
      const setDisplayErrorMessages = makeSetDisplayErrorMessages();
      await exportAdminDataCsv(
        mockEvent,
        setDisplayErrorMessages,
        defaultTotalRows,
        makeFilters(),
        defaultCurrentPage,
      );

      expect(setDisplayErrorMessages).not.toHaveBeenCalled();
    });

    it("calls handleDownload with the correct arguments", async () => {
      const filters = makeFilters();
      await exportAdminDataCsv(
        mockEvent,
        makeSetDisplayErrorMessages(),
        defaultTotalRows,
        filters,
        defaultCurrentPage,
      );

      expect(handleDownload).toHaveBeenCalledWith(
        filters.date.from,
        filters.date.to,
        defaultCurrentPage,
        expect.any(Function),
        [],
        "csv",
        filters.feedback.values,
      );
    });

    it("passes the correct from date to handleDownload", async () => {
      const from = { day: "15", month: "03", year: "2024" };
      const filters = makeFilters({
        date: { from, to: defaultTo, errorText: "" },
      });

      await exportAdminDataCsv(
        mockEvent,
        makeSetDisplayErrorMessages(),
        defaultTotalRows,
        filters,
        defaultCurrentPage,
      );

      expect(vi.mocked(handleDownload).mock.calls.at(-1)![0]).toEqual(from);
    });

    it("passes the correct to date to handleDownload", async () => {
      const to = { day: "28", month: "06", year: "2024" };
      const filters = makeFilters({
        date: { from: defaultFrom, to, errorText: "" },
      });

      await exportAdminDataCsv(
        mockEvent,
        makeSetDisplayErrorMessages(),
        defaultTotalRows,
        filters,
        defaultCurrentPage,
      );

      expect(vi.mocked(handleDownload).mock.calls.at(-1)![1]).toEqual(to);
    });

    it("passes the correct currentPage to handleDownload", async () => {
      await exportAdminDataCsv(
        mockEvent,
        makeSetDisplayErrorMessages(),
        defaultTotalRows,
        makeFilters(),
        3,
      );

      expect(vi.mocked(handleDownload).mock.calls.at(-1)![2]).toBe(3);
    });

    it("passes 'csv' as the format to handleDownload", async () => {
      await exportAdminDataCsv(
        mockEvent,
        makeSetDisplayErrorMessages(),
        defaultTotalRows,
        makeFilters(),
        defaultCurrentPage,
      );

      expect(vi.mocked(handleDownload).mock.calls.at(-1)![5]).toBe("csv");
    });

    it("passes feedback.values to handleDownload", async () => {
      const filters = makeFilters({
        feedback: { values: ["true", "false"], errorText: "" },
      });

      await exportAdminDataCsv(
        mockEvent,
        makeSetDisplayErrorMessages(),
        defaultTotalRows,
        filters,
        defaultCurrentPage,
      );

      expect(vi.mocked(handleDownload).mock.calls.at(-1)![6]).toEqual([
        "true",
        "false",
      ]);
    });

    it("passes topics to handleDownload", async () => {
      const filters = makeFilters({
        topics: { inScope: ["housing"], outOfScope: "", errorText: "" },
      });

      await exportAdminDataCsv(
        mockEvent,
        makeSetDisplayErrorMessages(),
        defaultTotalRows,
        filters,
        defaultCurrentPage,
      );

      expect(vi.mocked(handleDownload).mock.calls.at(-1)![4]).toEqual([
        "housing",
      ]);
    });

    it("does not call setDisplayErrorMessages when totalRows equals the max", async () => {
      vi.stubEnv("NEXT_PUBLIC_MAX_ROW_CSV", "10000");
      const setDisplayErrorMessages = makeSetDisplayErrorMessages();

      // exactly at the limit — should not error
      await exportAdminDataCsv(
        mockEvent,
        setDisplayErrorMessages,
        10000,
        makeFilters(),
        defaultCurrentPage,
      );

      expect(setDisplayErrorMessages).not.toHaveBeenCalled();
    });
  });

  describe("getCsvDownloadAdapter", () => {
    it("calls getCsvDownload via the adapter passed to handleDownload", async () => {
      await exportAdminDataCsv(
        mockEvent,
        makeSetDisplayErrorMessages(),
        defaultTotalRows,
        makeFilters(),
        defaultCurrentPage,
      );

      const adapter = vi.mocked(handleDownload).mock.calls.at(-1)![3];
      await adapter({
        start_date: "2023-01-01",
        end_date: "2023-12-31",
        currentPage: 1,
        topics: ["housing"],
        feedback_types: [],
      });

      expect(getCsvDownload).toHaveBeenCalledWith(
        "2023-01-01",
        "2023-12-31",
        1,
        [],
        ["housing"],
      );
    });
  });
});
