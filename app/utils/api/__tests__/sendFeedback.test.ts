/**
 * @jest-environment jsdom
 */

import { NextResponse } from "next/server";
import { MOCK_RESPONSE } from "@/app/constants/ApiTests";
import sendFeedback from "../sendFeedback";
import { loadHistory, updateHistory } from "../../../utils";

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

describe("sendFeedback", () => {
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

  it("should successfully send feedback", async () => {
    const id = 1;
    const types = ["not relevant to the question asked", "factually incorrect"];
    const message = "N/A";
    const is_response_useful = false;

    (loadHistory as jest.Mock).mockReturnValue([
      { id: 1, question: "test", answer: "test" },
    ]);

    await sendFeedback(id, types, message, is_response_useful);

    expect(fetch).toHaveBeenCalledWith("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, types, message, is_response_useful }),
      signal: expect.any(AbortSignal),
    });
  });

  it("should handle fetch errors and still return a valid response", async () => {
    const id = 1;
    const types = ["not relevant to the question asked", "factually incorrect"];
    const message = "N/A";
    const is_response_useful = true;

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
    const result = await sendFeedback(id, types, message, is_response_useful);

    expect(result).toBeDefined();
  });

  it("should handle response with error field", async () => {
    const id = 1;
    const types = ["not relevant"];
    const message = "Test";
    const is_response_useful = false;

    fetchSpy.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        error: "Validation failed",
        code: 400,
      }),
      ok: true,
      status: 200,
    } as any);

    (loadHistory as jest.Mock).mockReturnValue([
      { id: 1, question: "test", answer: "test" },
    ]);

    const result = await sendFeedback(id, types, message, is_response_useful);

    expect(result).toBeUndefined();
    expect(updateHistory).toHaveBeenCalledWith({
      id: 1,
      question: "test",
      answer: "test",
      feedback_given: false,
    });
  });

  it("should not update history when item not found", async () => {
    const id = 999;
    const types = ["not relevant"];
    const message = "Test";
    const is_response_useful = false;

    (loadHistory as jest.Mock).mockReturnValue([
      { id: 1, question: "test", answer: "test" },
    ]);

    await sendFeedback(id, types, message, is_response_useful);

    expect(updateHistory).not.toHaveBeenCalled();
  });
});
