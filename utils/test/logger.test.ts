import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import logger from "../logger";

const getLoggedMessage = (spy: ReturnType<typeof vi.spyOn>): string => {
  const [firstCall] = spy.mock.calls;
  expect(firstCall).toBeDefined();

  const [firstArg] = firstCall;
  expect(typeof firstArg).toBe("string");

  if (typeof firstArg !== "string") {
    throw new Error("Expected logger output to be a string");
  }

  return firstArg;
};

describe("logger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-02T03:04:05.678Z"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("writes info logs to console.log with formatted entry", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

    logger.info("startup complete", {
      requestId: "req-123",
      attempts: 2,
      active: true,
    });

    expect(logSpy).toHaveBeenCalledOnce();
    const output = getLoggedMessage(logSpy);

    expect(output).toBe(
      [
        "{",
        "  [2026-01-02T03:04:05.678Z] INFO startup complete",
        "  requestId: req-123",
        "  attempts: 2",
        "  active: true",
        "}",
      ].join("\n"),
    );
  });

  it("writes warn logs to console.warn", () => {
    const warnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);

    logger.warn("slow response", { latencyMs: 1250 });

    expect(warnSpy).toHaveBeenCalledOnce();
    const output = getLoggedMessage(warnSpy);

    expect(output).toContain("WARN slow response");
    expect(output).toContain("latencyMs: 1250");
  });

  it("writes error logs to console.error and renders Error metadata", () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const error = new Error("Request failed");
    error.name = "HttpError";
    error.stack = "HttpError: Request failed\n    at test:1:1";

    logger.error("request failed", { error });

    expect(errorSpy).toHaveBeenCalledOnce();
    const output = getLoggedMessage(errorSpy);

    expect(output).toContain("ERROR request failed");
    expect(output).toContain("error:");
    expect(output).toContain("HttpError: Request failed");
    expect(output).toContain("at test:1:1");
  });

  it("omits undefined metadata values", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

    logger.info("filtered fields", {
      includeMe: "yes",
      skipMe: undefined,
    });

    const output = getLoggedMessage(logSpy);

    expect(output).toContain("includeMe: yes");
    expect(output).not.toContain("skipMe");
  });

  it("formats arrays and nested objects in metadata", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

    logger.info("nested data", {
      tags: ["frontend", "logger"],
      context: {
        route: "/health",
        status: 200,
      },
    });

    const output = getLoggedMessage(logSpy);

    expect(output).toContain("INFO nested data");
    expect(output).toContain("tags:");
    expect(output).toContain("- frontend");
    expect(output).toContain("- logger");
    expect(output).toContain("context:");
    expect(output).toContain("route: /health");
    expect(output).toContain("status: 200");
  });

  it("handles empty structures and primitive fallback branches", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

    logger.info("branch coverage", {
      emptyArray: [],
      emptyObject: {},
      mixedArray: [undefined, () => "computed"],
      nested: {
        multiline: "line-1\nline-2",
      },
    });

    const output = getLoggedMessage(logSpy);

    expect(output).toContain("emptyArray: []");
    expect(output).toContain("emptyObject: {}");
    expect(output).toContain("mixedArray:");
    expect(output).toContain("- undefined");
    expect(output).toContain("nested:");
    expect(output).toContain("multiline:");
    expect(output).toContain("line-1");
    expect(output).toContain("line-2");
  });
});
