import { catchError } from "@/app/utils";

export default async function getFeedbackList(
  start_date: string,
  end_date: string,
  currentPage: number,
  sentiment: string[],
) {
  // Send feedback and handle response
  try {
    const data = await fetch(`/api/get-feedback-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date,
        end_date,
        page: currentPage,
        feedback_types: sentiment,
      }),
      signal: AbortSignal.timeout(90000),
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
  } catch (error: any) {
    console.log(error);
    catchError(error?.cause?.code || 500);
  }
}
