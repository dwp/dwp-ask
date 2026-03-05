import { catchError } from "@/app/utils";

export default async function getCsvDownload(
  start_date: string,
  end_date: string,
  currentPage: number,
  feedback_types: Array<"true" | "false" | "none">,
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
      }),
      signal: AbortSignal.timeout(90000),
    });
    if (!data.ok) throw new Error("Failed to generate CSV");

    return await data.blob();
  } catch (error: any) {
    console.log(error);
    catchError(error?.cause?.code || 500);
    return error;
  }
}
