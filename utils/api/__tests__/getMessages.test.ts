import { NextResponse } from "next/server";
import type { MockInstance } from "vitest";
import { MOCK_RESPONSE } from "@/constants/ApiTests";
import { createMockResponse } from "@/utils/test";
import { catchError, loadHistory } from "../../../utils";
import getMessages from "../getMessages";

beforeAll(() => {
  if (!("timeout" in AbortSignal)) {
    Object.defineProperty(AbortSignal, "timeout", {
      value: (ms: number) => {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), ms);
        return controller.signal;
      },
      configurable: true,
    });
  }
});

vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data) => ({
      status: 200,
      json: () => Promise.resolve(data),
    })),
  },
}));

vi.mock("../../../utils", () => ({
  updateHistory: vi.fn(),
  loadHistory: vi.fn(),
  addHistory: vi.fn(),
  calculateIndex: vi.fn(),
  filterChatHistory: vi.fn(),
  catchError: vi.fn(),
}));

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
  vi.spyOn(console, "log").mockImplementation(vi.fn());
});

describe("getMessages", () => {
  let fetchSpy: MockInstance;
  const start_date = new Date().toISOString();
  const end_date = new Date().toISOString();
  const currentPage = 1;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      createMockResponse({
        json: vi.fn().mockResolvedValue(MOCK_RESPONSE),
        ok: true,
        status: 200,
      }),
    );

    vi.spyOn(NextResponse, "json").mockReturnValue(
      createMockResponse({
        status: 200,
        json: vi.fn().mockResolvedValue(MOCK_RESPONSE),
      }) as NextResponse,
    );
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    vi.resetAllMocks();
  });

  it("should successfully send a request", async () => {
    await getMessages(start_date, end_date, currentPage);

    expect(fetch).toHaveBeenCalledWith("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ start_date, end_date, page: currentPage }),
      signal: expect.any(AbortSignal),
    });
  });
  it("should handle errors and call catchError", async () => {
    vi.mocked(loadHistory).mockReturnValue([]);

    fetchSpy.mockResolvedValueOnce(
      createMockResponse({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: "Internal Server Error",
          code: 500,
        }),
      }),
    );

    await getMessages(start_date, end_date, currentPage);

    expect(catchError).toHaveBeenCalledWith(
      new Error("Internal Server Error", { cause: { code: 500 } }),
    );
  });
});
