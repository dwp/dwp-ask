import { NextRequest, NextResponse } from "next/server";
import { generateErrorMessage, withErrorHandler } from "../errorHandler";

vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  return {
    ...actual,
    NextResponse: {
      ...actual.NextResponse,
      json: vi.fn((body, init) => ({ body, status: init?.status })),
    },
  };
});

describe("generateErrorMessage", () => {
  it("formats message with code", () => {
    expect(generateErrorMessage("Not found", 404)).toBe("Not found|404");
  });

  it("handles null message", () => {
    expect(generateErrorMessage(null, 500)).toBe("null|500");
  });
});

describe("withErrorHandler", () => {
  const mockReq = {} as NextRequest;

  it("returns handler result on success", async () => {
    const mockResponse = NextResponse.json({ ok: true });
    const handler = vi.fn().mockResolvedValue(mockResponse);

    const wrapped = withErrorHandler(handler);
    const result = await wrapped(mockReq);

    expect(result).toBe(mockResponse);
  });

  it("catches error with status code and returns json error", async () => {
    const handler = vi.fn().mockRejectedValue(new Error("Bad request|400"));

    const wrapped = withErrorHandler(handler);
    await wrapped(mockReq);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Bad request", code: 400 },
      { status: 400 },
    );
  });

  it("defaults to status 500 when error message has no status code", async () => {
    const handler = vi.fn().mockRejectedValue(new Error("Something broke"));

    const wrapped = withErrorHandler(handler);
    await wrapped(mockReq);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Something broke", code: 500 },
      { status: 500 },
    );
  });

  it("passes context to handler", async () => {
    const mockResponse = NextResponse.json({ ok: true });
    const handler = vi.fn().mockResolvedValue(mockResponse);
    const context = { params: Promise.resolve({ id: "1" }) };

    const wrapped = withErrorHandler(handler);
    await wrapped(mockReq, context);

    expect(handler).toHaveBeenCalledWith(mockReq, context);
  });
});
