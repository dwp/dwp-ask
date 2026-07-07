import { headers } from "next/headers";
import { vi } from "vitest";
import { createMockResponse } from "@/utils/test";
import getGroups from "../getGroups";

vi.mock("next/headers", () => ({
  headers: vi.fn(() => ({
    get: vi.fn(() => "test-access-token"),
  })),
}));

global.fetch = vi.fn();
vi.spyOn(console, "error").mockImplementation(vi.fn());

describe("getGroups", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns data on successful response", async () => {
    const mockData = { user_groups: ["admin"] };
    vi.mocked(fetch).mockResolvedValue(
      createMockResponse({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      }),
    );

    const result = await getGroups();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/user-groups",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": "test-access-token",
        },
        body: JSON.stringify({}),
        signal: expect.any(Object),
        cache: "no-store",
      },
    );
    expect(result).toEqual(mockData);
  });

  it("handles null access token", async () => {
    vi.mocked(headers).mockResolvedValue({
      get: vi.fn(() => null),
    } as unknown as Awaited<ReturnType<typeof headers>>);

    const mockData = { user_groups: ["admin"] };
    vi.mocked(fetch).mockResolvedValue(
      createMockResponse({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      }),
    );

    const result = await getGroups();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/user-groups",
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-access-token": "",
        }),
      }),
    );
    expect(result).toEqual(mockData);
  });

  it("logs error when response not ok", async () => {
    vi.mocked(fetch).mockResolvedValue(
      createMockResponse({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      }),
    );
    const result = await getGroups();

    expect(result).toBeUndefined();
  });

  it("logs error when response has error field", async () => {
    vi.mocked(fetch).mockResolvedValue(
      createMockResponse({
        ok: true,
        json: vi.fn().mockResolvedValue({ error: "Auth failed", code: 401 }),
      }),
    );
    const result = await getGroups();

    expect(result).toBeUndefined();
  });

  it("logs error when response has error field without code", async () => {
    vi.mocked(fetch).mockResolvedValue(
      createMockResponse({
        ok: true,
        json: vi.fn().mockResolvedValue({ error: "Auth failed" }),
      }),
    );

    const result = await getGroups();

    expect(result).toBeUndefined();
  });

  it("logs error when fetch throws", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

    const result = await getGroups();

    expect(result).toBeUndefined();
  });

  it("logs error when headers() throws", async () => {
    vi.mocked(headers).mockRejectedValue(new Error("Headers error"));

    const result = await getGroups();

    expect(result).toBeUndefined();
  });

  it("logs error when json() throws", async () => {
    vi.mocked(fetch).mockResolvedValue(
      createMockResponse({
        ok: true,
        json: vi.fn().mockRejectedValue(new Error("Headers error")),
      }),
    );
    const result = await getGroups();

    expect(result).toBeUndefined();
  });
});
