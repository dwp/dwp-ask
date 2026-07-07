import type { MockInstance } from "vitest";
import { catchError } from "@/utils";
import { createMockResponse } from "@/utils/test";
import getFeedbackList from "../getFeedbackList";

vi.mock("@/utils", () => ({
  catchError: vi.fn(),
  getSessionId: vi.fn(() => "mock-session-id-456"),
}));

describe("getFeedbackList", () => {
  let fetchSpy: MockInstance;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      createMockResponse({
        json: vi.fn().mockResolvedValue({ data: "mocked" }),
        ok: true,
        status: 200,
      }),
    );
    vi.spyOn(console, "log").mockImplementation(vi.fn());
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    vi.resetAllMocks();
  });

  it("should successfully fetch and return parsed response", async () => {
    const result = await getFeedbackList(
      "2024-01-01",
      "2024-01-31",
      1,
      ["positive"],
      ["housing"],
    );
    expect(fetch).toHaveBeenCalledWith("/api/get-feedback-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "session-id": "mock-session-id-456",
      },
      body: JSON.stringify({
        start_date: "2024-01-01",
        end_date: "2024-01-31",
        page: 1,
        feedback_types: ["positive"],
        topics: ["housing"],
      }),
      signal: expect.any(AbortSignal),
    });
    expect(result).toEqual({ data: "mocked" });
  });

  it("should handle error in response and call catchError", async () => {
    fetchSpy.mockResolvedValueOnce(
      createMockResponse({
        json: vi.fn().mockResolvedValue({
          error: "Something went wrong",
          code: 400,
        }),
        ok: false,
        status: 400,
      }),
    );

    const result = await getFeedbackList(
      "2024-01-01",
      "2024-01-31",
      1,
      ["negative"],
      ["housing"],
    );
    expect(catchError).toHaveBeenCalledWith(
      new Error("Something went wrong", { cause: { code: 400 } }),
    );
    expect(result).toBeUndefined();
  });

  it("should handle fetch/network error and call catchError", async () => {
    const error = new Error("Network error", { cause: { code: 500 } });
    (error as Error).cause = { code: 500 };
    fetchSpy.mockRejectedValueOnce(error);

    const result = await getFeedbackList(
      "2024-01-01",
      "2024-01-31",
      1,
      ["neutral"],
      ["housing"],
    );
    expect(catchError).toHaveBeenCalledWith(
      new Error("Network error", { cause: { code: 500 } }),
    );
    expect(result).toBeUndefined();
  });
});
