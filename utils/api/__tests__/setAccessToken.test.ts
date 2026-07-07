import type { NextRequest } from "next/server";
import { afterAll, describe, expect, it, vi } from "vitest";
import { setAccessToken } from "../setAccessToken";

describe("setAccessToken", () => {
  const mockEnv = (nodeEnv: string, accessToken: string) => {
    vi.stubEnv("NODE_ENV", nodeEnv);
    vi.stubEnv("ACCESS_TOKEN", accessToken);
  };

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  let getMock: ReturnType<typeof vi.fn>;

  const createMockRequest = (accessToken: string | null = null) => {
    getMock = vi.fn((name) => {
      if (name === "x-access-token") return accessToken;
      return null;
    });
    return {
      headers: {
        get: getMock,
      },
    } as unknown as NextRequest;
  };

  it("should return ACCESS_TOKEN env variable in development mode", () => {
    mockEnv("development", "dev-token-123");
    const mockRequest = createMockRequest("header-token-456");

    const result = setAccessToken(mockRequest);

    expect(result).toBe("header-token-456");
    expect(getMock).toHaveBeenCalledWith("x-access-token");
  });

  it("should return header token in production mode", () => {
    mockEnv("production", "dev-token-123");
    const mockRequest = createMockRequest("header-token-456");

    const result = setAccessToken(mockRequest);

    expect(result).toBe("header-token-456");
    expect(getMock).toHaveBeenCalledWith("x-access-token");
  });

  it("should return undefined when x-access-token header is null", () => {
    const mockRequest = createMockRequest(null);

    const result = setAccessToken(mockRequest);

    expect(result).toBeUndefined();
  });
});
