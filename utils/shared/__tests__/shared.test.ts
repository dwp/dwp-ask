import type { DateParts, PayloadProps, SentimentFilterArray } from "@/types";

vi.mock("@/utils", () => ({
  convertDateToISO: (date: DateParts) => {
    const { day, month, year } = date;
    if (!day && !month && !year) return "";
    return new Date(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00Z`,
    ).toISOString();
  },
}));

import {
  clickDownload,
  getErrorCode,
  handleDownload,
  validateDateRange,
} from "../helper";

beforeEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

const makeDateParts = (
  day: string,
  month: string,
  year: string,
): DateParts => ({
  day,
  month,
  year,
});

const today = new Date();
const todayParts = makeDateParts(
  String(today.getDate()),
  String(today.getMonth() + 1),
  String(today.getFullYear()),
);

const pastDate = makeDateParts("15", "6", "2023");
const earlierPastDate = makeDateParts("1", "1", "2023");
const futureDate = makeDateParts("1", "1", "2099");
const emptyDate = makeDateParts("", "", "");

describe("validateDateRange", () => {
  describe("start date validation", () => {
    it("returns invalid when start date is empty", () => {
      const result = validateDateRange(emptyDate);
      expect(result.valid).toBe(false);
    });

    it("returns invalid when start date is partially filled", () => {
      const result = validateDateRange(makeDateParts("15", "", "2023"));
      expect(result.valid).toBe(false);
    });

    it("returns invalid for an impossible start date (Feb 30)", () => {
      const result = validateDateRange(makeDateParts("30", "2", "2023"));
      expect(result.valid).toBe(false);
    });

    it("returns invalid for day=0", () => {
      const result = validateDateRange(makeDateParts("0", "1", "2023"));
      expect(result.valid).toBe(false);
    });

    it("returns invalid for month=13", () => {
      const result = validateDateRange(makeDateParts("1", "13", "2023"));
      expect(result.valid).toBe(false);
    });

    it("returns invalid for day=32", () => {
      const result = validateDateRange(makeDateParts("32", "1", "2023"));
      expect(result.valid).toBe(false);
    });

    it("returns invalid for year < 1000", () => {
      const result = validateDateRange(makeDateParts("1", "1", "999"));
      expect(result.valid).toBe(false);
    });

    it("returns invalid when start date is in the future and no end date", () => {
      const result = validateDateRange(futureDate);
      expect(result.valid).toBe(false);
    });

    it("returns invalid for whitespace-only fields", () => {
      const result = validateDateRange(makeDateParts("  ", " ", "   "));
      expect(result.valid).toBe(false);
    });
  });

  describe("end date validation", () => {
    it("returns invalid when end date is partially filled", () => {
      const result = validateDateRange(pastDate, makeDateParts("15", "", ""));
      expect(result.valid).toBe(false);
    });

    it("returns invalid when end date is partially filled (2 of 3)", () => {
      const result = validateDateRange(pastDate, makeDateParts("15", "6", ""));
      expect(result.valid).toBe(false);
    });

    it("returns invalid for an impossible end date (Apr 31)", () => {
      const result = validateDateRange(
        pastDate,
        makeDateParts("31", "4", "2023"),
      );
      expect(result.valid).toBe(false);
    });

    it("returns invalid when end date is in the future", () => {
      const result = validateDateRange(pastDate, futureDate);
      expect(result.valid).toBe(false);
    });
  });

  describe("date range validation", () => {
    it("returns invalid when start date is after end date", () => {
      const result = validateDateRange(pastDate, earlierPastDate);
      expect(result.valid).toBe(false);
    });

    it("returns invalid when start is in the future even with valid end", () => {
      const result = validateDateRange(
        futureDate,
        makeDateParts("2", "1", "2099"),
      );
      expect(result.valid).toBe(false);
    });
  });

  describe("happy paths", () => {
    it("returns valid for a past start date with no end date", () => {
      const result = validateDateRange(pastDate);
      expect(result.valid).toBe(true);
    });

    it("returns valid for a past start date with empty end date", () => {
      const result = validateDateRange(pastDate, emptyDate);
      expect(result.valid).toBe(true);
    });

    it("returns valid for a past start date with undefined end date", () => {
      const result = validateDateRange(pastDate, undefined);
      expect(result.valid).toBe(true);
    });

    it("returns valid for a valid date range in the past", () => {
      const result = validateDateRange(earlierPastDate, pastDate);
      expect(result.valid).toBe(true);
    });

    it("returns valid when start and end are the same date", () => {
      const result = validateDateRange(pastDate, pastDate);
      expect(result.valid).toBe(true);
    });

    it("returns valid when start date is today with no end date", () => {
      const result = validateDateRange(todayParts);
      expect(result.valid).toBe(true);
    });

    it("returns valid when both start and end are today", () => {
      const result = validateDateRange(todayParts, todayParts);
      expect(result.valid).toBe(true);
    });

    it("handles single-digit day/month with padStart correctly", () => {
      const result = validateDateRange(
        makeDateParts("1", "1", "2023"),
        makeDateParts("9", "9", "2023"),
      );
      expect(result.valid).toBe(true);
    });
  });
});

describe("clickDownload", () => {
  it("creates a link, triggers download, and revokes the URL", () => {
    const mockClick = vi.fn();
    const mockCreateElement = vi
      .spyOn(document, "createElement")
      .mockReturnValue({
        set href(_: string) {
          /* noop */
        },
        set download(_: string) {
          /* noop */
        },
        click: mockClick,
      } as unknown as HTMLAnchorElement);
    const mockCreateObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    const mockRevokeObjectURL = vi.fn();
    globalThis.URL.createObjectURL = mockCreateObjectURL;
    globalThis.URL.revokeObjectURL = mockRevokeObjectURL;

    const blob = new Blob(["test"], { type: "text/plain" });
    clickDownload(blob, "test-file.csv");

    expect(mockCreateObjectURL).toHaveBeenCalledWith(blob);
    expect(mockCreateElement).toHaveBeenCalledWith("a");
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });
});

describe("handleDownload", () => {
  const startDate = makeDateParts("1", "1", "2023");
  const endDate = makeDateParts("15", "6", "2023");
  const emptyEndDate = makeDateParts("", "", "");

  it("calls apiCallBack and triggers download on valid dates", async () => {
    const mockBlob = new Blob(["data"]);
    const mockApiCallback = vi
      .fn<(payload: PayloadProps) => Promise<Blob>>()
      .mockResolvedValue(mockBlob);
    const mockCreateObjectURL = vi.fn().mockReturnValue("blob:url");
    const mockRevokeObjectURL = vi.fn();
    globalThis.URL.createObjectURL = mockCreateObjectURL;
    globalThis.URL.revokeObjectURL = mockRevokeObjectURL;

    await handleDownload(startDate, endDate, 1, mockApiCallback, []);

    expect(mockApiCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        start_date: expect.any(String),
        end_date: expect.any(String),
        currentPage: 1,
      }),
    );
  });

  it("includes feedback_types in payload when provided", async () => {
    const mockBlob = new Blob(["data"]);
    const mockApiCallback = vi
      .fn<(payload: PayloadProps) => Promise<Blob>>()
      .mockResolvedValue(mockBlob);
    globalThis.URL.createObjectURL = vi.fn().mockReturnValue("blob:url");
    globalThis.URL.revokeObjectURL = vi.fn();

    const feedbackTypes: SentimentFilterArray = ["true", "false"];

    await handleDownload(
      startDate,
      endDate,
      1,
      mockApiCallback,
      [],
      "csv",
      feedbackTypes,
    );

    expect(mockApiCallback).toHaveBeenCalledWith(
      expect.objectContaining({ feedback_types: feedbackTypes }),
    );
  });

  it("uses pdf as default download type", async () => {
    const mockBlob = new Blob(["data"]);
    const mockApiCallback = vi
      .fn<(payload: PayloadProps) => Promise<Blob>>()
      .mockResolvedValue(mockBlob);
    const linkProps: Record<string, string> = {};
    vi.spyOn(document, "createElement").mockReturnValue({
      set href(v: string) {
        linkProps.href = v;
      },
      set download(v: string) {
        linkProps.download = v;
      },
      click: vi.fn(),
    } as unknown as HTMLAnchorElement);
    globalThis.URL.createObjectURL = vi.fn().mockReturnValue("blob:url");
    globalThis.URL.revokeObjectURL = vi.fn();

    await handleDownload(startDate, endDate, 1, mockApiCallback, []);

    expect(linkProps.download).toMatch(/\.pdf$/);
  });

  it("does not call apiCallBack when date validation fails", async () => {
    const mockApiCallback = vi.fn();

    await handleDownload(emptyDate, endDate, 1, mockApiCallback, []);

    expect(mockApiCallback).not.toHaveBeenCalled();
  });

  it("does not trigger download when apiCallBack returns void", async () => {
    const mockApiCallback = vi
      .fn<(payload: PayloadProps) => Promise<void>>()
      .mockResolvedValue(undefined);
    const mockCreateObjectURL = vi.fn();
    globalThis.URL.createObjectURL = mockCreateObjectURL;

    await handleDownload(startDate, endDate, 1, mockApiCallback, []);

    expect(mockCreateObjectURL).not.toHaveBeenCalled();
  });

  it("handles empty end date without error", async () => {
    const mockBlob = new Blob(["data"]);
    const mockApiCallback = vi
      .fn<(payload: PayloadProps) => Promise<Blob>>()
      .mockResolvedValue(mockBlob);
    globalThis.URL.createObjectURL = vi.fn().mockReturnValue("blob:url");
    globalThis.URL.revokeObjectURL = vi.fn();

    await handleDownload(startDate, emptyEndDate, 1, mockApiCallback, []);

    expect(mockApiCallback).toHaveBeenCalled();
  });
});

describe("getErrorCode", () => {
  it("returns the code from error.cause when present", () => {
    const error = new Error("fail", { cause: { code: 404 } });
    expect(getErrorCode(error)).toBe(404);
  });

  it("returns default fallback (500) when error has no cause", () => {
    const error = new Error("fail");
    expect(getErrorCode(error)).toBe(500);
  });

  it("returns custom fallback when error has no cause", () => {
    const error = new Error("fail");
    expect(getErrorCode(error, 503)).toBe(503);
  });

  it("returns fallback when cause exists but has no code", () => {
    const error = new Error("fail", { cause: { other: "data" } });
    expect(getErrorCode(error)).toBe(500);
  });

  it("returns fallback when cause is not an object", () => {
    const error = new Error("fail", { cause: "string cause" });
    expect(getErrorCode(error)).toBe(500);
  });

  it("returns fallback when cause is null", () => {
    const error = new Error("fail", { cause: null });
    expect(getErrorCode(error)).toBe(500);
  });

  it("returns fallback for non-Error values", () => {
    expect(getErrorCode("not an error")).toBe(500);
    expect(getErrorCode(null)).toBe(500);
    expect(getErrorCode(undefined)).toBe(500);
    expect(getErrorCode(42)).toBe(500);
  });

  it("returns custom fallback for non-Error values", () => {
    expect(getErrorCode("not an error", 422)).toBe(422);
  });

  it("returns code 0 from cause (falsy but valid)", () => {
    const error = new Error("fail", { cause: { code: 0 } });
    expect(getErrorCode(error)).toBe(0);
  });
});
