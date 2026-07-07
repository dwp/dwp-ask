import { API_TIMEOUT_MS } from "@/constants/Api";
import { PayloadProps } from "@/types";
import { catchError } from "@/utils";

/**
 * Fetches a CSV export of messages for the given date range and feedback filters.
 *
 * @param start_date ISO start date string
 * @param end_date ISO end date string
 * @param currentPage current pagination page
 * @param feedback_types optional sentiment filter array
 * @param topics topic filters, defaults to []
 * @returns Blob containing the CSV data, or undefined on failure
 */
export default async function getCsvDownload(
  start_date: string,
  end_date: string,
  currentPage: number,
  feedback_types: PayloadProps["feedback_types"],
  topics: PayloadProps["topics"] = [],
): Promise<Blob | undefined> {
  try {
    const data = await fetch(`/api/download-messages-csv`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date,
        end_date,
        page: currentPage,
        feedback_types,
        topics,
      }),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (!data.ok) throw new Error("Failed to generate CSV");

    return await data.blob();
  } catch (error: unknown) {
    catchError(error);
    return undefined;
  }
}
