import { API_TIMEOUT_MS } from "@/constants/Api";
import type { ChatViewType } from "@/types";
import { catchError } from "@/utils";

/**
 * Generates a PDF export by posting date range and optional data to the download API.
 *
 * @param start_date optional ISO start date string
 * @param end_date optional ISO end date string
 * @param currentPage optional pagination page
 * @param data_to_download optional array of chat view data to include in the PDF
 * @returns Blob containing the PDF data, or undefined on failure
 */
export default async function getPdfDownload(
  start_date?: string,
  end_date?: string,
  currentPage?: number,
  data_to_download?: ChatViewType[] | null,
): Promise<Blob | undefined> {
  try {
    const data = await fetch(`/api/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date,
        end_date,
        page: currentPage,
        data: data_to_download,
      }),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (!data.ok) throw new Error("Failed to generate PDF");

    return await data.blob();
  } catch (error: unknown) {
    catchError(error);
    return undefined;
  }
}
