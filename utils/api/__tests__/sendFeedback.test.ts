import { NextResponse } from "next/server";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  type MockInstance,
  vi,
} from "vitest";
import { MOCK_RESPONSE } from "@/constants/ApiTests";
import { loadHistory, updateHistory } from "@/utils";
import { createMockResponse } from "@/utils/test";
import sendFeedback from "../sendFeedback";

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

vi.mock("@/utils", () => ({
  updateHistory: vi.fn(),
  loadHistory: vi.fn(),
  addHistory: vi.fn(),
  calculateIndex: vi.fn(),
  filterChatHistory: vi.fn(),
  catchError: vi.fn(),
  getSessionId: vi.fn(() => "mock-session-id-456"),
}));

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
  vi.spyOn(console, "log").mockImplementation(vi.fn());
});

describe("sendFeedback", () => {
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

  it("should successfully send feedback", async () => {
    const id = 1;
    const types = ["not relevant to the question asked", "factually incorrect"];
    const message = "N/A";
    const is_response_useful = false;

    vi.mocked(loadHistory).mockReturnValue([
      { id: 1, question: "test", answer: "test" },
    ]);

    await sendFeedback(id, types, message, is_response_useful);

    expect(fetch).toHaveBeenCalledWith("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "session-id": "mock-session-id-456",
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

    fetchSpy.mockResolvedValueOnce(
      createMockResponse({
        json: vi.fn().mockResolvedValue({
          ...MOCK_RESPONSE,
          type: "error",
          code: 500,
        }),
        ok: false,
        status: 500,
      }),
    );

    vi.mocked(loadHistory).mockReturnValue([]);
    const result = await sendFeedback(id, types, message, is_response_useful);

    expect(result).toBeDefined();
  });

  it("should handle response with error field", async () => {
    const id = 1;
    const types = ["not relevant"];
    const message = "Test";
    const is_response_useful = false;

    fetchSpy.mockResolvedValueOnce(
      createMockResponse({
        json: vi.fn().mockResolvedValue({
          error: "Validation failed",
          code: 400,
        }),
        ok: true,
        status: 200,
      }),
    );

    vi.mocked(loadHistory).mockReturnValue([
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

    vi.mocked(loadHistory).mockReturnValue([
      { id: 1, question: "test", answer: "test" },
    ]);

    await sendFeedback(id, types, message, is_response_useful);

    expect(updateHistory).not.toHaveBeenCalled();
  });
});
