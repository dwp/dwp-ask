import {
  calculateIndex,
  capitalise,
  catchError,
  sanitisePathname,
  filterChatHistory,
  dateFormatForHistoryPage,
  truncate,
  isEmptyObject,
  convertDateToISO,
  convertDateToParts,
} from "../helpers";
import { loadHistory, updateHistory } from "../storage/storage";
import { QueryResponseType } from "../../types";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
  jest.spyOn(console, "log").mockImplementation(jest.fn());
});

// Mock the storage module
jest.mock("../storage/storage", () => ({
  loadHistory: jest.fn(),
  updateHistory: jest.fn(),
}));

// Mock the QueryResponseType for testing
type MockQueryResponseType = {
  question: string;
  answer: string;
  type?: string;
  citations?: any[];
  timestamp?: string;
  default_response?: boolean;
};

describe("calculateIndex", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 0 when history length is 1 and type is query", () => {
    (loadHistory as jest.Mock).mockReturnValue([{ question: "Test" }]);
    expect(calculateIndex("query")).toBe(0);
  });

  it("should return length - 1 when history length > 1 and type is query", () => {
    (loadHistory as jest.Mock).mockReturnValue([
      { question: "Test1" },
      { question: "Test2" },
      { question: "Test3" },
    ]);
    expect(calculateIndex("query")).toBe(2);
  });

  it("should return 0 for unknown type", () => {
    (loadHistory as jest.Mock).mockReturnValue([
      { question: "Test1" },
      { question: "Test2" },
    ]);
    // @ts-expect-error - Testing with invalid type
    expect(calculateIndex("unknown")).toBe(0);
  });
});

describe("capitalise", () => {
  it("should capitalise the first letter of a word", () => {
    expect(capitalise("hello")).toBe("Hello");
  });

  it("should handle already capitalised words", () => {
    expect(capitalise("Hello")).toBe("Hello");
  });

  it("should handle empty strings", () => {
    expect(capitalise("")).toBe("");
  });

  it("should handle single character strings", () => {
    expect(capitalise("a")).toBe("A");
  });
});

describe("catchError", () => {
  const mockHistory: MockQueryResponseType[] = [
    { question: "Test question", answer: "Test answer" },
  ];

  beforeEach(() => {
    (loadHistory as jest.Mock).mockReturnValue(mockHistory);
    (updateHistory as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update history with generic error for code 500", () => {
    catchError(500);
    expect(updateHistory).toHaveBeenCalledWith({
      ...mockHistory[0],
      answer:
        "Apologies, we have had a technical issue. Please try again in a few minutes.",
      citations: [],
      type: "error",
    });
  });

  it("should update history with specific error for code 429", () => {
    catchError(429);
    expect(updateHistory).toHaveBeenCalledWith({
      ...mockHistory[0],
      answer:
        "We are currently experiencing an unexpectedly large amount of requests. Please try again in a few minutes.",
      citations: [],
      type: "error",
    });
  });

  it("should update history with generic error for unknown error code", () => {
    catchError(999);
    expect(updateHistory).toHaveBeenCalledWith({
      ...mockHistory[0],
      answer:
        "Apologies, we have had a technical issue. Please try again in a few minutes.",
      citations: [],
      type: "error",
    });
  });
});

describe("sanitisePathname", () => {
  it('should return "/" on error', () => {
    // Mock a scenario where decodeURIComponent throws an error
    const originalDecodeURIComponent = global.decodeURIComponent;
    global.decodeURIComponent = jest.fn(() => {
      throw new Error("Invalid URI");
    });

    expect(sanitisePathname("invalid-uri")).toBe("/");

    // Restore original function
    global.decodeURIComponent = originalDecodeURIComponent;
  });
});

describe("filterChatHistory", () => {
  const mockChatHistory: MockQueryResponseType[] = [
    { question: "Normal question", answer: "Normal answer", type: "query" },
    { question: "Error question", answer: "Error answer", type: "error" },
    { question: "No answer", answer: "", type: "query" },
  ];

  it("should filter out special questions and errors", () => {
    const filtered = filterChatHistory(mockChatHistory as QueryResponseType[]);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].question).toBe("Normal question");
  });

  it("should filter out default responses", () => {
    const mockChatHistoryWithDefault: MockQueryResponseType[] = [
      ...mockChatHistory,
      {
        question: "Default question",
        answer: "Default answer",
        default_response: true,
      },
    ];
    const filtered = filterChatHistory(
      mockChatHistoryWithDefault as QueryResponseType[],
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].question).toBe("Normal question");
  });

  it("should handle empty array", () => {
    expect(filterChatHistory([])).toEqual([]);
  });
});

describe("dateFormatForHistoryPage", () => {
  it("should format date correctly", () => {
    // Mock a specific date
    const testDate = "2023-05-15T14:30:00Z";
    const [formattedDate, formattedTime] = dateFormatForHistoryPage(testDate);

    // Note: The exact expected values may vary depending on timezone
    // This test assumes UTC, adjust as needed for your environment
    expect(formattedDate).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(formattedTime).toMatch(/^\d{2}:\d{2} (AM|PM)$/);
  });

  it("should handle AM/PM correctly", () => {
    const morningDate = "2023-05-15T09:30:00Z";
    const eveningDate = "2023-05-15T21:30:00Z";

    const [, morningTime] = dateFormatForHistoryPage(morningDate);
    const [, eveningTime] = dateFormatForHistoryPage(eveningDate);

    // Check if times have correct AM/PM designation
    expect(morningTime).toContain("AM");
    expect(eveningTime).toContain("PM");
  });
});

describe("truncate", () => {
  it("should truncate text longer than maxLength", () => {
    expect(truncate("Hello world", 5)).toBe("Hello...");
  });

  it("should not truncate text shorter than maxLength", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("should return ellipsis when maxLength is 0", () => {
    expect(truncate("Hello", 0)).toBe("...");
  });
});

describe("isEmptyObject", () => {
  it("should return true for empty objects", () => {
    expect(isEmptyObject({})).toBe(true);
  });

  it("should return false for non-empty objects", () => {
    expect(isEmptyObject({ key: "value" })).toBe(false);
  });

  it("should return false for null", () => {
    expect(isEmptyObject(null)).toBe(false);
  });

  it("should return false for arrays", () => {
    expect(isEmptyObject([])).toBe(false);
  });

  it("should return false for primitives", () => {
    expect(isEmptyObject("string")).toBe(false);
    expect(isEmptyObject(123)).toBe(false);
    expect(isEmptyObject(true)).toBe(false);
  });
});

describe("convertDateToISO", () => {
  it("should convert date parts to ISO string", () => {
    const result = convertDateToISO({ day: "15", month: "5", year: "2023" });
    // The exact expected value may vary with timezone
    expect(result).toMatch(/^2023-05-15T00:00:00.000Z$/);
  });

  it("should pad single digit day and month with zeros", () => {
    const result = convertDateToISO({ day: "1", month: "2", year: "2023" });
    expect(result).toMatch(/^2023-02-01T00:00:00.000Z$/);
  });
});

describe("convertDateToParts", () => {
  it("should convert Date to parts object", () => {
    const date = new Date("2023-05-15T00:00:00Z");
    const parts = convertDateToParts(date);

    expect(parts).toEqual({
      day: "15",
      month: "05",
      year: "2023",
    });
  });

  it("should pad single digit day and month with zeros", () => {
    const date = new Date("2023-01-02T00:00:00Z");
    const parts = convertDateToParts(date);

    expect(parts).toEqual({
      day: "02",
      month: "01",
      year: "2023",
    });
  });
});
