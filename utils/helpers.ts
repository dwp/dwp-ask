import { GENERIC_ERROR, HTTP_ERROR_MAP } from "@/constants/Errors";
import { URLRegex } from "@/constants/PageMetadata";
import type { DateParts, QueryResponseType } from "@/types";
import { getErrorCode } from "./shared/helper";
import { loadHistory, updateHistory } from "./storage/storage";

/**
 * Returns the index of the chat history item that should be updated after a query has been sent
 * For a standard query, the last item in chat history
 *
 * @param type type of query
 * @returns number
 */
export const calculateIndex = (type: "query") => {
  const history = loadHistory();
  if (type === "query") {
    return history.length === 1 ? 0 : history.length - 1;
  }
  return 0;
};

/**
 * Helper function to capitalise a word
 *
 * @param word word to capitalise
 * @returns capitalised word
 */
export const capitalise = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

/**
 * Catches any network errors coming from the /app/api directory route handlers
 * Updates chat history with an appropriate error message and adds metadata
 *
 * @param cause HTTP error code
 * @returns void
 *
 */
export const catchError = (error: unknown) => {
  const errorCode = getErrorCode(error);
  const matchingError = HTTP_ERROR_MAP[errorCode] || GENERIC_ERROR;
  const chat_history = loadHistory();
  const index = calculateIndex("query");
  const lastItem = chat_history[index];
  updateHistory({
    ...lastItem,
    answer: matchingError,
    citations: [],
    type: "error",
  });
};

/**
 * Decodes and sanitises a URL pathname by removing disallowed characters.
 *
 * @param pathname raw pathname string to sanitise
 * @returns cleaned pathname prefixed with "/"
 */
export const sanitisePathname = (pathname: string) => {
  try {
    const decodedPathname = decodeURIComponent(pathname);
    const cleaned = decodedPathname.replace(URLRegex, "");
    return `/${cleaned}`;
  } catch (error: unknown) {
    console.error(error);
    return "/";
  }
};

/**
 * Filters out system or error responses
 * @param chatHistory array of chat history objects
 * @returns filtered array with only user queries and valid answers
 */
export const filterChatHistory = (chatHistory: QueryResponseType[]) => {
  return chatHistory.filter(
    (item) =>
      item.type !== "error" && item.answer && item.type !== "chooseCountry",
  );
};

/**
 * Formats a raw ISO date string into a display date and 12-hour time tuple.
 *
 * @param rawDate ISO date string
 * @returns tuple of ["DD/MM/YYYY", "HH:MM AM/PM"]
 */
export const dateFormatForHistoryPage = (rawDate: string): [string, string] => {
  const date = new Date(rawDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  const formattedActualTime = `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;

  return [formattedDate, formattedActualTime];
};

/**
 * Truncates text to a maximum length, appending "..." if exceeded.
 *
 * @param text string to truncate
 * @param maxLength maximum allowed length
 * @returns truncated string
 */
export const truncate = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

/**
 * Type guard that checks whether a value is a plain object with no keys.
 *
 * @param obj value to check
 * @returns true if obj is an empty object
 */
export const isEmptyObject = (obj: unknown): obj is Record<string, never> => {
  return (
    obj !== null &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    Object.keys(obj).length === 0
  );
};

/**
 * Converts DateParts (day, month, year) into an ISO 8601 date string.
 *
 * @param date object containing day, month, and year strings
 * @returns ISO date string
 */
export const convertDateToISO = (date: DateParts) => {
  const { day, month, year } = date;
  const jsDate = new Date(
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00Z`,
  );
  return jsDate.toISOString();
};

/**
 * Converts a JavaScript Date into a DateParts object with zero-padded strings.
 *
 * @param date JavaScript Date instance
 * @returns DateParts with day, month, and year strings
 */
export const convertDateToParts = (date: Date): DateParts => {
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: String(date.getMonth() + 1).padStart(2, "0"),
    year: String(date.getFullYear()),
  };
};
