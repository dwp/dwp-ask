import { NextResponse } from "next/server";
import type { MockInstance } from "vitest";
import { MOCK_BODY, MOCK_RESPONSE } from "@/constants/ApiTests";
import { LocationType } from "@/types/chat.types";
import { catchError, loadHistory } from "@/utils";
import { createMockResponse } from "@/utils/test";
import sendQueryMessage from "../../api/sendQueryMessage";

const mockAddHistory = vi.hoisted(() =>
  vi.fn((): Record<string, unknown>[] => []),
);

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

const mockUpdateHistory = vi.hoisted(() => vi.fn());
const mockLoadHistory = vi.hoisted(() => vi.fn(() => []));
const mockCalculateIndex = vi.hoisted(() => vi.fn(() => 0));
const mockFilterChatHistory = vi.hoisted(() => vi.fn(() => []));

vi.mock("@/utils", () => ({
  updateHistory: mockUpdateHistory,
  loadHistory: mockLoadHistory,
  addHistory: mockAddHistory,
  calculateIndex: mockCalculateIndex,
  filterChatHistory: mockFilterChatHistory,
  catchError: vi.fn(),
  getSessionId: vi.fn(() => "mock-session-id-456"),
}));

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
  vi.spyOn(console, "log").mockImplementation(vi.fn());
});

describe("sendQueryMessage", () => {
  let fetchSpy: MockInstance;

  beforeEach(() => {
    const sessionStorageMock = (() => {
      let store: Record<string, string> = {
        session_id: "mock-session-id-456",
      };
      return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: vi.fn((key: string) => delete store[key]),
        clear: vi.fn(() => {
          store = {};
        }),
      };
    })();

    Object.defineProperty(window, "sessionStorage", {
      value: sessionStorageMock,
      configurable: true,
    });

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

  it("should successfully process a query and update history", async () => {
    const { query, chat_history } = MOCK_BODY;

    await sendQueryMessage(query, "England");

    expect(fetch).toHaveBeenCalledWith("/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "session-id": "mock-session-id-456",
      },
      body: JSON.stringify({ query, chat_history, location: "England" }),
      signal: expect.any(AbortSignal),
      redirect: "manual",
    });
  });

  it("should update chat history", async () => {
    const { query } = MOCK_BODY;
    mockLoadHistory.mockReturnValue([]);
    mockCalculateIndex.mockReturnValue(0);

    // addHistory now returns the updated chat history array
    mockAddHistory.mockReturnValue([{ question: query }]);

    fetchSpy.mockResolvedValueOnce(
      createMockResponse({
        json: vi.fn().mockResolvedValue({
          ...MOCK_RESPONSE,
          answer: "",
          answer_gen_enabled: false,
        }),
        ok: true,
        status: 200,
      }),
    );

    await sendQueryMessage(query, "England");

    expect(mockUpdateHistory).toHaveBeenCalledWith({
      question: query,
      answer:
        "I cannot answer your question. Please rephrase or provide more details. If this is not a guidance related question, please refer to resources under Universal Learning",
      citations: [],
      id: null,
      question_feedback: null,
    });
  });

  it("should not return a valid response for a null location", async () => {
    const { query } = MOCK_BODY;

    await expect(sendQueryMessage(query, null)).rejects.toThrow(
      "A valid location is required to send a query",
    );
  });

  it("should not return a valid response for an invalid location", async () => {
    const { query } = MOCK_BODY;

    await expect(
      sendQueryMessage(query, "Madrid" as unknown as LocationType),
    ).rejects.toThrow("A valid location is required to send a query");
  });

  it("should handle errors and call catchError", async () => {
    const mockQuery = "What is the capital of Spain?";
    const mockLocation = "England";

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

    await sendQueryMessage(mockQuery, mockLocation);

    expect(catchError).toHaveBeenCalledWith(
      new Error("Internal Server Error", { cause: { code: 500 } }),
    );
  });

  it("should redirect to home on opaqueredirect response", async () => {
    const mockLocation = { href: "" };
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
      configurable: true,
    });

    fetchSpy.mockResolvedValueOnce(
      createMockResponse({
        type: "opaqueredirect",
        ok: true,
        status: 200,
      }),
    );

    const result = await sendQueryMessage("test query", "England");

    expect(mockLocation.href).toBe("/");
    expect(result).toEqual([]);
  });

  it("should update history with answer when answer_gen_enabled is true and answer is present", async () => {
    const { query } = MOCK_BODY;
    mockCalculateIndex.mockReturnValue(0);
    mockAddHistory.mockReturnValue([{ question: query }]);

    fetchSpy.mockResolvedValueOnce(
      createMockResponse({
        json: vi.fn().mockResolvedValue({
          answer: "A valid answer",
          answer_gen_enabled: true,
          citations: [
            {
              title: "Source",
              url: "https://example.com",
              chunks: "c",
              highlights_url: "",
              highlights_text: "",
            },
          ],
          id: 42,
          question_feedback: { topic_label: "topic", suggested_questions: [] },
        }),
        ok: true,
        status: 200,
      }),
    );

    await sendQueryMessage(query, "England");

    expect(mockUpdateHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        answer: "A valid answer",
        citations: [
          {
            title: "Source",
            url: "https://example.com",
            chunks: "c",
            highlights_url: "",
            highlights_text: "",
          },
        ],
        id: 42,
        question_feedback: { topic_label: "topic", suggested_questions: [] },
      }),
    );
  });

  it("should use default answer when answer_gen_enabled is false and answer is blank", async () => {
    const { query } = MOCK_BODY;
    mockCalculateIndex.mockReturnValue(0);
    mockAddHistory.mockReturnValue([{ question: query }]);

    fetchSpy.mockResolvedValueOnce(
      createMockResponse({
        json: vi.fn().mockResolvedValue({
          answer: "   ",
          answer_gen_enabled: false,
        }),
        ok: true,
        status: 200,
      }),
    );

    await sendQueryMessage(query, "England");

    expect(mockUpdateHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        citations: [],
        id: null,
        question_feedback: null,
      }),
    );
  });
});
