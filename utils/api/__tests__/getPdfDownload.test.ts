import { NextResponse } from "next/server";
import type { MockInstance } from "vitest";
import { MOCK_RESPONSE } from "@/constants/ApiTests";
import { createMockResponse } from "@/utils/test";
import { catchError, loadHistory } from "../../../utils";
import getPdfDownload from "../getPdfDownload";

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

describe("getPdfDownload", () => {
  let fetchSpy: MockInstance;

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
    await getPdfDownload();

    expect(fetch).toHaveBeenCalledWith("/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
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

    await getPdfDownload();

    expect(catchError).toHaveBeenCalledWith(
      new Error("Failed to generate PDF"),
    );
  });
});
