import { DateParts, QueryResponseType } from "../types";
import { loadHistory, updateHistory } from "./storage/storage";
import { URLRegex } from "../constants/PageMetadata";

const GENERIC_ERROR =
  "Apologies, we have had a technical issue. Please try again in a few minutes.";

const HTTPErrorMap: { [key: number]: string } = {
  422: "Your query has triggered our content safety filters and we cannot process this request. Please try a different question.",
  403: GENERIC_ERROR,
  429: "We are currently experiencing an unexpectedly large amount of requests. Please try again in a few minutes.",
  508: "Apologies, we have had an issue processing your query. Please rephrase your question and try again.",
  401: GENERIC_ERROR,
  500: GENERIC_ERROR,
  503: GENERIC_ERROR,
};

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
export const catchError = (cause: number) => {
  const matchingError = HTTPErrorMap[cause] || GENERIC_ERROR;
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

export const sanitisePathname = (pathname: string) => {
  try {
    const decodedPathname = decodeURIComponent(pathname);
    const cleaned = decodedPathname.replace(URLRegex, "");
    return `/${cleaned}`;
  } catch (error: any) {
    console.error("Error sanitising pathname: " + error.message);
    return "/";
  }
};

/**
 * Filters out default responses
 * @param chatHistory array of chat history objects
 * @returns filtered array with only user queries and valid answers
 */
export const filterChatHistory = (chatHistory: QueryResponseType[]) => {
  return chatHistory.filter(
    (item) => item.type !== "error" && !item.default_response && item.answer,
  );
};

export const dateFormatForHistoryPage = (rawDate: string) => {
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

export const truncate = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

export const isEmptyObject = (obj: unknown): obj is Record<string, never> => {
  return (
    obj !== null &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    Object.keys(obj).length === 0
  );
};

export const convertDateToISO = (date: DateParts) => {
  const { day, month, year } = date;
  const jsDate = new Date(
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00Z`,
  );
  return jsDate.toISOString();
};

export const convertDateToParts = (date: Date) => {
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: String(date.getMonth() + 1).padStart(2, "0"),
    year: String(date.getFullYear()),
  };
};
