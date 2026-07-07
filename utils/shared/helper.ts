import type { DateParts, PayloadProps, SentimentFilterArray } from "@/types";
import { convertDateToISO, logger } from "@/utils";

/**
 * Validates a date range ensuring start/end dates are complete, valid, and logically ordered.
 * Sets error text on the appropriate field when validation fails.
 *
 * @param start start date parts (day, month, year)
 * @param end optional end date parts
 * @returns object with valid boolean and optional error message
 */
const validateDateRange = (
  from: DateParts,
  to?: DateParts,
): { valid: boolean; message?: string } => {
  const isEmpty = (val?: string) => !val?.trim();
  const toFields = (d: DateParts) => [d.day, d.month, d.year];
  const isComplete = (d: DateParts) => toFields(d).every((v) => !isEmpty(v));
  const isPartial = (d: DateParts) => {
    const filled = toFields(d).filter((v) => !isEmpty(v)).length;
    return filled > 0 && filled < 3;
  };

  const isValidDate = (d: DateParts): boolean => {
    if (!isComplete(d)) return false;
    const [day, month, year] = [d.day, d.month, d.year].map(Number);
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000)
      return false;
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const toUTCDate = (d: DateParts) =>
    new Date(
      `${d.year}-${d.month.padStart(2, "0")}-${d.day.padStart(2, "0")}T00:00:00Z`,
    );

  const today = new Date(
    Date.UTC(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
    ),
  );

  const fail = (message: string) => ({ valid: false, message });
  const pass = { valid: true } as const;

  if (!isComplete(from))
    return fail("Start date is required and must be fully filled");
  if (!isValidDate(from)) return fail("Start date is not valid");

  const fromDate = toUTCDate(from);
  const toMissing = !to || toFields(to).every(isEmpty);

  if (toMissing) {
    return fromDate > today ? fail("Start date cannot be in the future") : pass;
  }

  if (isPartial(to)) return fail("End date is incomplete or not valid");
  if (!isValidDate(to)) return fail("End date is not valid");

  const toDate = toUTCDate(to);

  if (fromDate > toDate) return fail("Start date cannot be after end date");
  if (fromDate > today) return fail("Start date cannot be in the future");
  if (toDate > today) return fail("End date cannot be in the future");

  return pass;
};

/**
 * Creates a temporary anchor element to trigger a file download from a Blob.
 *
 * @param blob file data to download
 * @param filename name for the downloaded file
 */
const clickDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Validates the date range, then calls the provided API callback to generate
 * a downloadable file (PDF or CSV). Handles loading state and error display.
 *
 * @param startDate start date parts
 * @param endDate end date parts
 * @param currentPage current pagination page
 * @param apiCallBack API function that returns a Blob
 * @param topics topic filters, defaults to []
 * @param downloadType file extension for the download (defaults to "pdf")
 * @param feedback_types optional sentiment filter for feedback exports
 */
const handleDownload = async (
  startDate: DateParts,
  endDate: DateParts,
  currentPage: number,
  apiCallBack: (payload: PayloadProps) => Promise<Blob | void>,
  topics: string[],
  downloadType: string = "pdf",
  feedback_types?: SentimentFilterArray,
) => {
  const validDate = validateDateRange(startDate, endDate);
  if (validDate.valid) {
    const start_date = convertDateToISO(startDate);
    let end_date = convertDateToISO(endDate);
    if (endDate.day) {
      end_date = convertDateToISO(endDate);
    }
    try {
      let payload: PayloadProps = {
        start_date,
        end_date,
        currentPage,
        feedback_types: feedback_types ?? [],
        topics: topics ?? [],
      };
      if (feedback_types) {
        payload = {
          ...payload,
          feedback_types,
        };
      }
      let blob;
      if (apiCallBack) {
        blob = await apiCallBack(payload);
        if (blob) {
          const filename = `export-all-${start_date}-${end_date}.${downloadType}`;
          clickDownload(blob, filename);
        }
      }
    } catch (error: unknown) {
      logger.error("Error in handleDownload", {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }
};

/**
 * Extracts an HTTP error code from an Error's cause, falling back to a default.
 *
 * @param error the caught error
 * @param fallback status code to return if none is found (defaults to 500)
 * @returns numeric HTTP error code
 */
const getErrorCode = (error: unknown, fallback = 500): number => {
  if (
    error instanceof Error &&
    error.cause &&
    typeof error.cause === "object"
  ) {
    return (error.cause as { code?: number }).code ?? fallback;
  }
  return fallback;
};

/**
 * Capitalises the first letter of each word in a hyphenated string, except for
 * specified lowercase words (e.g. "and", "the").
 *
 * @param s string to capitalise
 * @returns capitalised string
 */
const toTitleCase = (s: string): string => {
  const LOWERCASE_WORDS = new Set([
    "and",
    "or",
    "of",
    "the",
    "a",
    "and",
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
    "but",
  ]);

  return s
    .replaceAll("-", " ")
    .split(" ")
    .map((word, i) =>
      i === 0 || !LOWERCASE_WORDS.has(word)
        ? word[0].toUpperCase() + word.slice(1)
        : word,
    )
    .join(" ");
};

/**
 * Capitalises the first word of a hyphenated string and removes hyphens.
 *
 * @param s hyphenated string to capitalise
 * @returns non-hyphenated string with first word capitalised
 *
 * Example: "children-and-childcare" -> Children and childcare
 */
const capitaliseHyphenatedString = (s: string): string => {
  return s.replaceAll("-", " ").replace(/^\w/, (c) => c.toUpperCase());
};

export {
  capitaliseHyphenatedString,
  clickDownload,
  getErrorCode,
  handleDownload,
  toTitleCase,
  validateDateRange,
};
