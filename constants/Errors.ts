const GENERIC_ERROR =
  "Apologies, we have had a technical issue. Please try again in a few minutes.";

const HTTP_ERROR_MAP: { [key: number]: string } = {
  422: "Your query has triggered our content safety filters and we cannot process this request. Please try a different question.",
  403: GENERIC_ERROR,
  429: "We are currently experiencing an unexpectedly large amount of requests. Please try again in a few minutes.",
  508: "Apologies, we have had an issue processing your query. Please rephrase your question and try again.",
  401: GENERIC_ERROR,
  500: GENERIC_ERROR,
  503: GENERIC_ERROR,
};

const INPUT_ERROR_MAP: { [key: string]: string } = {
  invalidchar: "Query contains invalid characters",
  blank: "Please type a message to continue",
  location: "Please choose a location from the message in the chat",
};

const DEFAULT_ERROR = "An unexpected error occurred. Please try again later.";

const FALLBACK_ERROR =
  "An unexpected error occurred. An error message was not provided";

export {
  DEFAULT_ERROR,
  FALLBACK_ERROR,
  GENERIC_ERROR,
  HTTP_ERROR_MAP,
  INPUT_ERROR_MAP,
};
