/**
 * @jest-environment jsdom
 */

import { NextResponse } from "next/server";
import { MOCK_RESPONSE } from "@/app/constants/ApiTests";
import getPdfDownload from "../getPdfDownload";
import { loadHistory, catchError } from "../../../utils";

beforeAll(() => {
  if (!("timeout" in AbortSignal)) {
    (AbortSignal as any).timeout = (ms: number) => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), ms);
      return controller.signal;
    };
  }
});

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      status: 200,
      json: () => Promise.resolve(data),
    })),
  },
}));

jest.mock("../../../utils", () => ({
  updateHistory: jest.fn(),
  loadHistory: jest.fn(),
  addHistory: jest.fn(),
  calculateIndex: jest.fn(),
  filterChatHistory: jest.fn(),
  catchError: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

describe("getPdfDownload", () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue(MOCK_RESPONSE),
      ok: true,
      status: 200,
    } as any);

    jest.spyOn(NextResponse, "json").mockReturnValue({
      status: 200,
      json: jest.fn().mockResolvedValue(MOCK_RESPONSE),
    } as any);
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    jest.resetAllMocks();
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
    (loadHistory as jest.Mock).mockReturnValue([]);

    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: "Internal Server Error",
        code: 500,
      }),
    } as any);

    await getPdfDownload();

    expect(catchError).toHaveBeenCalledWith(500);
  });
});
