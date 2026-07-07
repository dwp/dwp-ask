import { API_TIMEOUT_MS } from "@/constants/Api";
import { catchError, getSessionId } from "@/utils";

/**
 * Fetches a paginated list of feedback entries filtered by date range and sentiment.
 *
 * @param start_date ISO start date string
 * @param end_date ISO end date string
 * @param currentPage current pagination page
 * @param sentiment array of sentiment filter values ("true", "false", "none")
 * @param topics transformed array of topics
 * @returns parsed feedback list response
 */
export default async function getFeedbackList(
  start_date: string,
  end_date: string,
  currentPage: number,
  sentiment: string[],
  topicsToFilter: string[],
) {
  // Send feedback and handle response
  try {
    const data = await fetch(`/api/get-feedback-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "session-id": getSessionId(),
      },
      body: JSON.stringify({
        start_date,
        end_date,
        page: currentPage,
        feedback_types: sentiment,
        topics: topicsToFilter,
      }),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    const parsedResponse = await data.json();

    if (parsedResponse.error) {
      // If the response object includes an error value, then a HTTP error has occured
      // An error should be thrown which is caught by catchError and handled appropriately
      throw new Error(parsedResponse.error, {
        cause: { code: parsedResponse.code },
      });
    }

    return parsedResponse;
  } catch (error: unknown) {
    catchError(error);
  }
}
