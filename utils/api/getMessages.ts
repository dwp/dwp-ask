import { API_TIMEOUT_MS } from "@/constants/Api";
import { catchError } from "@/utils";

/**
 * Fetches a paginated list of chat messages filtered by date range.
 *
 * @param start_date ISO start date string
 * @param end_date ISO end date string
 * @param currentPage current pagination page
 * @returns parsed messages response
 */
export default async function getMessages(
  start_date: string,
  end_date: string,
  currentPage: number,
) {
  // Send feedback and handle response
  try {
    const data = await fetch(`/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date,
        end_date,
        page: currentPage,
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
