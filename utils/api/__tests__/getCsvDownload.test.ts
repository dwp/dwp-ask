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
import { catchError } from "@/utils";
import { createMockResponse } from "@/utils/test";
import getCsvDownload from "../getCsvDownload";

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

vi.mock("@/utils", () => ({
  catchError: vi.fn(),
}));

describe("getCsvDownload", () => {
  let fetchSpy: MockInstance;
  const mockBlob = new Blob(["id,question\n1,Test"], { type: "text/csv" });

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      createMockResponse({
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
        status: 200,
      }),
    );
    vi.spyOn(console, "log").mockImplementation(vi.fn());
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    vi.resetAllMocks();
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
        topics: [],
      }),
      signal: expect.any(AbortSignal),
    });
    expect(result).toBe(mockBlob);
  });

  it("should handle fetch not ok and call catchError", async () => {
    fetchSpy.mockResolvedValueOnce(
      createMockResponse({
        ok: false,
        blob: vi.fn(),
        status: 500,
      }),
    );

    const result = await getCsvDownload("2024-01-01", "2024-01-31", 1, [
      "true",
    ]);
    expect(catchError).toHaveBeenCalledWith(
      new Error("Failed to generate CSV"),
    );
    expect(result).toBeUndefined();
  });

  it("should handle fetch/network error and call catchError", async () => {
    const error = new Error("Network error", { cause: { code: 400 } });
    (error as Error).cause = { code: 400 };
    fetchSpy.mockRejectedValueOnce(error);

    const result = await getCsvDownload("2024-01-01", "2024-01-31", 1, [
      "true",
    ]);
    expect(catchError).toHaveBeenCalledWith(
      new Error("Network error", { cause: { code: 400 } }),
    );
    expect(result).toBeUndefined();
  });
});
