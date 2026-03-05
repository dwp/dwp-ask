import { ChatViewType } from "@/app/types";
import { catchError } from "@/app/utils";

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
      signal: AbortSignal.timeout(90000),
    });
    if (!data.ok) throw new Error("Failed to generate PDF");

    return await data.blob();
  } catch (error: any) {
    console.log(error);
    catchError(error?.cause?.code || 500);
    return error;
  }
}
