/**
 * @jest-environment jsdom
 */

import getCsvDownload from "../getCsvDownload";
import { catchError } from "@/app/utils";

beforeAll(() => {
  if (!("timeout" in AbortSignal)) {
    (AbortSignal as any).timeout = (ms: number) => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), ms);
      return controller.signal;
    };
  }
});

jest.mock("@/app/utils", () => ({
  catchError: jest.fn(),
}));

describe("getCsvDownload", () => {
  let fetchSpy: jest.SpyInstance;
  const mockBlob = new Blob(["id,question\n1,Test"], { type: "text/csv" });

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      blob: jest.fn().mockResolvedValue(mockBlob),
      status: 200,
    } as any);
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    jest.resetAllMocks();
  });

  it("should successfully send a request and return a Blob", async () => {
    const result = await getCsvDownload("2024-01-01", "2024-01-31", 1, [
      "true",
    ]);
    expect(fetch).toHaveBeenCalledWith("/api/download-messages-csv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date: "2024-01-01",
        end_date: "2024-01-31",
        page: 1,
        feedback_types: ["true"],
      }),
      signal: expect.any(AbortSignal),
    });
    expect(result).toBe(mockBlob);
  });

  it("should handle fetch not ok and call catchError", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      blob: jest.fn(),
      status: 500,
    } as any);

    const result = await getCsvDownload("2024-01-01", "2024-01-31", 1, [
      "true",
    ]);
    expect(catchError).toHaveBeenCalledWith(500);
    expect(result).toBeInstanceOf(Error);
  });

  it("should handle fetch/network error and call catchError", async () => {
    const error = new Error("Network error");
    (error as any).cause = { code: 400 };
    fetchSpy.mockRejectedValueOnce(error);

    const result = await getCsvDownload("2024-01-01", "2024-01-31", 1, [
      "true",
    ]);
    expect(catchError).toHaveBeenCalledWith(400);
    expect(result).toBe(error);
  });
});
