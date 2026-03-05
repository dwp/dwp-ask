/**
 * @jest-environment jsdom
 */

import getFeedbackList from "../getFeedbackList";
import { catchError } from "@/app/utils";

jest.mock("@/app/utils", () => ({
  catchError: jest.fn(),
}));

describe("getFeedbackList", () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: "mocked" }),
      ok: true,
      status: 200,
    } as any);
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    jest.resetAllMocks();
  });

  it("should successfully fetch and return parsed response", async () => {
    const result = await getFeedbackList("2024-01-01", "2024-01-31", 1, [
      "positive",
    ]);
    expect(fetch).toHaveBeenCalledWith("/api/get-feedback-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date: "2024-01-01",
        end_date: "2024-01-31",
        page: 1,
        feedback_types: ["positive"],
      }),
      signal: expect.any(AbortSignal),
    });
    expect(result).toEqual({ data: "mocked" });
  });

  it("should handle error in response and call catchError", async () => {
    fetchSpy.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        error: "Something went wrong",
        code: 400,
      }),
      ok: false,
      status: 400,
    } as any);

    const result = await getFeedbackList("2024-01-01", "2024-01-31", 1, [
      "negative",
    ]);
    expect(catchError).toHaveBeenCalledWith(400);
    expect(result).toBeUndefined();
  });

  it("should handle fetch/network error and call catchError", async () => {
    const error = new Error("Network error");
    (error as any).cause = { code: 500 };
    fetchSpy.mockRejectedValueOnce(error);

    const result = await getFeedbackList("2024-01-01", "2024-01-31", 1, [
      "neutral",
    ]);
    expect(catchError).toHaveBeenCalledWith(500);
    expect(result).toBeUndefined();
  });
});
