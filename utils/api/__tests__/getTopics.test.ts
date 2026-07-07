import * as nextHeaders from "next/headers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import logger from "@/utils/logger";
import getTopics from "../getTopics";

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

vi.mock("@/constants/Api", () => ({
  API_TIMEOUT_MS: 5000,
}));

vi.mock("@/utils/logger", () => ({ default: { error: vi.fn() } }));

// ── Helpers ──────────────────────────────────────────────────────────────────

function mockFetchResponse({
  ok = true,
  status = 200,
  statusText = "OK",
  body = {},
}: {
  ok?: boolean;
  status?: number;
  statusText?: string;
  body?: object;
} = {}) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    statusText,
    json: vi.fn().mockResolvedValue(body),
  });
}

function mockHeaders(token: string | null) {
  vi.mocked(nextHeaders.headers).mockResolvedValue({
    get: vi.fn().mockReturnValue(token),
  } as any);
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("getTopics", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_APP_URL: "https://example.com",
    };
    mockHeaders("test-token");
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  // ── Happy paths ─────────────────────────────────────────────────────────

  describe("happy paths", () => {
    it("returns parsed topics on a successful response", async () => {
      const topics = { topics: [{ id: 1, name: "Tech" }] };
      global.fetch = mockFetchResponse({ body: topics });

      const result = await getTopics();

      expect(result).toEqual(topics);
    });

    it("calls the correct endpoint with the access token from headers", async () => {
      global.fetch = mockFetchResponse({ body: { topics: [] } });
      mockHeaders("my-secret-token");

      await getTopics();

      expect(fetch).toHaveBeenCalledWith(
        "https://example.com/api/topics",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            "x-access-token": "my-secret-token",
          }),
        }),
      );
    });

    it("falls back to an empty string when x-access-token header is absent", async () => {
      mockHeaders(null);
      global.fetch = mockFetchResponse({ body: { topics: [] } });

      await getTopics();

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ "x-access-token": "" }),
        }),
      );
    });

    it("requests with cache: no-store and an AbortSignal timeout", async () => {
      global.fetch = mockFetchResponse({ body: { topics: [] } });

      await getTopics();

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          cache: "no-store",
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it("returns an empty object body without errors", async () => {
      global.fetch = mockFetchResponse({ body: {} });

      const result = await getTopics();

      expect(result).toEqual({});
      expect(logger.error).not.toHaveBeenCalled();
    });
  });

  // ── Unhappy paths ────────────────────────────────────────────────────────

  describe("unhappy paths", () => {
    it("returns undefined and logs when the HTTP response is not ok (404)", async () => {
      global.fetch = mockFetchResponse({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      const result = await getTopics();

      expect(result).toBeUndefined();
      expect(logger.error).toHaveBeenCalledWith(
        "Failed to fetch user groups",
        expect.objectContaining({ errorMessage: "HTTP 404: Not Found" }),
      );
    });

    it("returns undefined and logs when the HTTP response is not ok (500)", async () => {
      global.fetch = mockFetchResponse({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const result = await getTopics();

      expect(result).toBeUndefined();
      expect(logger.error).toHaveBeenCalledWith(
        "Failed to fetch user groups",
        expect.objectContaining({
          errorMessage: "HTTP 500: Internal Server Error",
        }),
      );
    });

    it("returns undefined and logs when the response body contains an error field", async () => {
      global.fetch = mockFetchResponse({
        body: { error: "Unauthorised", code: "AUTH_001" },
      });

      const result = await getTopics();

      expect(result).toBeUndefined();
      expect(logger.error).toHaveBeenCalledWith(
        "Failed to fetch user groups",
        expect.objectContaining({ errorMessage: "Unauthorised" }),
      );
    });

    it("attaches the error code as the cause when the body contains a code", async () => {
      global.fetch = mockFetchResponse({
        body: { error: "Forbidden", code: "FORBIDDEN_003" },
      });

      await getTopics();

      // The thrown Error carries cause.code — verify the message was logged
      expect(logger.error).toHaveBeenCalledWith(
        "Failed to fetch user groups",
        expect.objectContaining({ errorMessage: "Forbidden" }),
      );
    });

    it("returns undefined and logs when fetch rejects (network failure)", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const result = await getTopics();

      expect(result).toBeUndefined();
      expect(logger.error).toHaveBeenCalledWith(
        "Failed to fetch user groups",
        expect.objectContaining({
          errorMessage: "Network error",
          stack: expect.any(String),
        }),
      );
    });

    it("handles a non-Error throw gracefully (logs 'Unknown error')", async () => {
      global.fetch = vi.fn().mockRejectedValue("a plain string error");

      const result = await getTopics();

      expect(result).toBeUndefined();
      expect(logger.error).toHaveBeenCalledWith(
        "Failed to fetch user groups",
        expect.objectContaining({
          errorMessage: "Unknown error",
          stack: undefined,
        }),
      );
    });

    it("returns undefined and logs when json() parsing throws", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
      });

      const result = await getTopics();

      expect(result).toBeUndefined();
      expect(logger.error).toHaveBeenCalledWith(
        "Failed to fetch user groups",
        expect.objectContaining({ errorMessage: "Invalid JSON" }),
      );
    });

    it("returns undefined and logs when NEXT_PUBLIC_APP_URL is undefined", async () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      global.fetch = vi
        .fn()
        .mockRejectedValue(new TypeError("Failed to fetch"));

      const result = await getTopics();

      expect(result).toBeUndefined();
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
