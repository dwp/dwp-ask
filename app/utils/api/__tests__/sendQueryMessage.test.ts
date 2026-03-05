/**
 * @jest-environment jsdom
 */

import { NextResponse } from "next/server";
import sendQueryMessage from "../../api/sendQueryMessage";
import { MOCK_BODY, MOCK_RESPONSE } from "@/app/constants/ApiTests";
import { loadHistory, catchError, updateHistory } from "../../../utils";

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

describe("sendQueryMessage", () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    const sessionStorageMock = (() => {
      let store: Record<string, string> = {
        session_id: "mock-session-id-456",
      };
      return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: jest.fn((key: string) => delete store[key]),
        clear: jest.fn(() => {
          store = {};
        }),
      };
    })();

    Object.defineProperty(window, "sessionStorage", {
      value: sessionStorageMock,
      configurable: true,
    });

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

  it("should successfully process a query and update history", async () => {
    const { query, location } = MOCK_BODY;

    await sendQueryMessage(query, location);

    expect(fetch).toHaveBeenCalledWith("/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "session-id": "mock-session-id-456",
      },
      body: JSON.stringify({ query, location }),
      signal: expect.any(AbortSignal),
      redirect: "manual",
    });
  });

  it("should update chat history", async () => {
    const { query, location } = MOCK_BODY;
    (loadHistory as jest.Mock).mockReturnValue([]);

    await sendQueryMessage(query, location);

    expect(updateHistory).toHaveBeenCalledWith({
      answer: "",
      citations: [],
      default_response: false,
      id: null,
    });
  });

  it("should handle fetch errors and still return a valid response", async () => {
    fetchSpy.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        ...MOCK_RESPONSE,
        type: "error",
        code: 500,
      }),
      ok: false,
      status: 500,
    } as any);

    (loadHistory as jest.Mock).mockReturnValue([]);
    const { query, location } = MOCK_BODY;
    const result = await sendQueryMessage(query, location);

    expect(result).toBeDefined();
  });

  it("should handle errors and call catchError", async () => {
    const mockQuery = "What is the capital of Spain?";
    const mockLocation = "Madrid";

    (loadHistory as jest.Mock).mockReturnValue([]);

    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: "Internal Server Error",
        code: 500,
      }),
    } as any);

    await sendQueryMessage(mockQuery, mockLocation);

    expect(catchError).toHaveBeenCalledWith(500);
  });
});
