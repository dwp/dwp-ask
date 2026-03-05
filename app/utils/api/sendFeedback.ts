import type { feedbackResponseType } from "@/app/types";
import { loadHistory, updateHistory } from "@/app/utils";

export default async function sendFeedback(
  id: number,
  types: string[],
  message: string,
  is_response_useful: boolean,
) {
  // Update session storage to mark feedback as given
  const chat_history = loadHistory();
  const itemIndex = chat_history.findIndex((item: any) => item.id === id);
  const lastItem = chat_history[itemIndex];
  let feedback_given = false;

  // Send feedback and handle response
  try {
    const data = await fetch(`/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        types,
        message,
        is_response_useful,
      }),
      signal: AbortSignal.timeout(90000),
    });
    const parsedResponse: feedbackResponseType = await data.json();

    if (parsedResponse.error) {
      // If the response object includes an error value, then a HTTP error has occured
      throw new Error(parsedResponse.error, {
        cause: { code: parsedResponse.code },
      });
    }
    feedback_given = true;
    return parsedResponse;
  } catch (error: any) {
    console.log(error);
  } finally {
    if (itemIndex !== -1) {
      updateHistory({
        ...lastItem,
        feedback_given,
      });
    }
  }
}
