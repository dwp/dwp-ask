/**
 * @jest-environment jsdom
 */

import { NextResponse } from "next/server";
import { MOCK_RESPONSE } from "@/app/constants/ApiTests";
import getMessages from "../getMessages";
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

describe("getMessages", () => {
  let fetchSpy: jest.SpyInstance;
  const start_date = new Date().toISOString();
  const end_date = new Date().toISOString();
  const currentPage = 1;

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
    (loadHistory as jest.Mock).mockReturnValue([]);

    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: "Internal Server Error",
        code: 500,
      }),
    } as any);

    await getMessages(start_date, end_date, currentPage);

    expect(catchError).toHaveBeenCalledWith(500);
  });
});
