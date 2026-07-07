import { afterEach, describe, expect, it, vi } from "vitest";
import { createMockResponse } from "@/utils/test";
import getFeedback from "../getFeedback";

global.fetch = vi.fn() as typeof fetch;

describe("getFeedback", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns data on successful response", async () => {
    const mockData = { data: [] };
    vi.mocked(fetch).mockResolvedValue(
      createMockResponse({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      }),
    );

    const result = await getFeedback();

    expect(fetch).toHaveBeenCalledWith("/api/get-feedback", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    expect(result).toEqual(mockData);
  });

  it("throws error on failed response", async () => {
    vi.mocked(fetch).mockResolvedValue(
      createMockResponse({
        ok: false,
        status: 500,
      }),
    );

    await expect(getFeedback()).rejects.toThrow("HTTP error! status: 500");
  });
});
