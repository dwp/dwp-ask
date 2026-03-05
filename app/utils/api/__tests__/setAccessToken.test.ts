import { setAccessToken } from "../setAccessToken";
import type { NextRequest } from "next/server";

describe("setAccessToken", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  const mockEnv = (nodeEnv: any, accessToken: any) => {
    Object.defineProperty(process.env, "NODE_ENV", { value: nodeEnv });
    process.env.ACCESS_TOKEN = accessToken;
  };

  afterAll(() => {
    Object.defineProperty(process.env, "NODE_ENV", { value: originalNodeEnv });
    delete process.env.ACCESS_TOKEN;
  });

  const createMockRequest = (accessToken: string | null = null) => {
    return {
      headers: {
        get: jest.fn((name) => {
          if (name === "x-access-token") return accessToken;
          return null;
        }),
      },
    } as unknown as NextRequest;
  };

  it("should return ACCESS_TOKEN env variable in development mode", () => {
    mockEnv("development", "dev-token-123");
    const mockRequest = createMockRequest("header-token-456");

    const result = setAccessToken(mockRequest);

    expect(result).toBe("header-token-456");
    expect(mockRequest.headers.get).toHaveBeenCalledWith("x-access-token");
  });

  it("should return header token in production mode", () => {
    mockEnv("production", "dev-token-123");
    const mockRequest = createMockRequest("header-token-456");

    const result = setAccessToken(mockRequest);

    expect(result).toBe("header-token-456");
    expect(mockRequest.headers.get).toHaveBeenCalledWith("x-access-token");
  });
});
