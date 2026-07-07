import type { NextRequest } from "next/server";
import { requestHandler } from "../requestHandler";

vi.mock("@/utils", () => ({
  generateErrorMessage: (msg: string, code: number) => `${msg}|${code}`,
  setAccessToken: () => "mock-token",
}));

const createMockReq = (method = "GET", sessionId = "sess-1") =>
  ({
    method,
    headers: {
      get: (name: string) => (name === "session-id" ? sessionId : null),
    },
  }) as unknown as NextRequest;

describe("requestHandler", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://api.test");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns blob data for file routes", async () => {
    const mockBlob = new Blob(["pdf-data"]);
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/octet-stream" }),
      blob: vi.fn().mockResolvedValue(mockBlob),
      json: vi.fn(),
    } as unknown as Response);

    const result = await requestHandler({
      req: createMockReq("POST"),
      route: "/generate-pdf",
    });

    expect(result).toBe(mockBlob);
  });

  it("returns json data for json content-type", async () => {
    const mockData = { message: "ok" };
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      blob: vi.fn(),
      json: vi.fn().mockResolvedValue(mockData),
    } as unknown as Response);

    const result = await requestHandler({
      req: createMockReq(),
      route: "/some-route",
    });

    expect(result).toEqual(mockData);
  });

  it("throws error when response is not ok", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      headers: new Headers({ "content-type": "application/json" }),
      blob: vi.fn(),
      json: vi.fn().mockResolvedValue({ error: "Server failed" }),
    } as unknown as Response);

    await expect(
      requestHandler({ req: createMockReq(), route: "/failing" }),
    ).rejects.toThrow("Server failed|500");
  });
});
