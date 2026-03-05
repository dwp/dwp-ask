import getGroups from "../getGroups";
import { headers } from "next/headers";

jest.mock("next/headers", () => ({
  headers: jest.fn(() => ({
    get: jest.fn(() => "test-access-token"),
  })),
}));

global.fetch = jest.fn();
const consoleSpy = jest.spyOn(console, "log").mockImplementation();

describe("getGroups", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns data on successful response", async () => {
    const mockData = { user_groups: ["admin"] };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

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
    (headers as jest.Mock).mockReturnValue({
      get: jest.fn(() => null),
    });

    const mockData = { user_groups: ["admin"] };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

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
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const result = await getGroups();

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(result).toBeUndefined();
  });

  it("logs error when response has error field", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ error: "Auth failed", code: 401 }),
    });

    const result = await getGroups();

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(result).toBeUndefined();
  });

  it("logs error when response has error field without code", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ error: "Auth failed" }),
    });

    const result = await getGroups();

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(result).toBeUndefined();
  });

  it("logs error when fetch throws", async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const result = await getGroups();

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(result).toBeUndefined();
  });

  it("logs error when headers() throws", async () => {
    (headers as jest.Mock).mockRejectedValue(new Error("Headers error"));

    const result = await getGroups();

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(result).toBeUndefined();
  });

  it("logs error when json() throws", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockRejectedValue(new Error("JSON parse error")),
    });

    const result = await getGroups();

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(result).toBeUndefined();
  });
});
