type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  [key: string]: unknown;
}

const indent = (value: string, spaces = 2): string =>
  value
    .split("\n")
    .map((line) => `${" ".repeat(spaces)}${line}`)
    .join("\n");

const formatPrimitive = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }

  if (value === null) {
    return "null";
  }

  if (value === undefined) {
    return "undefined";
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
};

const formatValue = (value: unknown, depth = 0): string => {
  if (value instanceof Error) {
    const errorLines = [
      `${value.name}: ${value.message}`,
      ...(value.stack ? value.stack.split("\n").slice(1) : []),
    ];
    return errorLines.map((line) => `${" ".repeat(depth)}${line}`).join("\n");
  }

  if (typeof value === "string" && value.includes("\n")) {
    return value
      .split("\n")
      .map((line) => `${" ".repeat(depth)}${line}`)
      .join("\n");
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }

    const nested = value
      .map((item) => formatValue(item, depth + 2))
      .map((item) => indent(`- ${item}`, depth + 2))
      .join("\n");

    return `\n${nested}`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, entryValue]) => entryValue !== undefined,
    );

    if (entries.length === 0) {
      return "{}";
    }

    const nested = entries
      .map(([key, entryValue]) => {
        const formatted = formatValue(entryValue, depth + 2);
        if (formatted.includes("\n")) {
          return `${" ".repeat(depth + 2)}${key}:\n${formatted}`;
        }

        return `${" ".repeat(depth + 2)}${key}: ${formatted}`;
      })
      .join("\n");

    return `\n${nested}`;
  }

  return formatPrimitive(value);
};

const formatEntry = (
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>,
): string => {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  const header = `[${entry.timestamp}] ${entry.level.toUpperCase()} ${entry.message}`;
  const details = Object.entries(entry)
    .filter(
      ([key, value]) =>
        key !== "timestamp" &&
        key !== "level" &&
        key !== "message" &&
        value !== undefined,
    )
    .map(([key, value]) => {
      const formatted = formatValue(value, 2);
      return formatted.includes("\n")
        ? `${key}:\n${formatted}`
        : `${key}: ${formatted}`;
    });

  const body = [header, ...details].join("\n");

  return `{\n${indent(body, 2)}\n}`;
};

const logger = {
  info: (message: string, meta?: Record<string, unknown>) =>
    console.log(formatEntry("info", message, meta)),

  warn: (message: string, meta?: Record<string, unknown>) =>
    console.warn(formatEntry("warn", message, meta)),

  error: (message: string, meta?: Record<string, unknown>) =>
    console.error(formatEntry("error", message, meta)),
};

export default logger;
