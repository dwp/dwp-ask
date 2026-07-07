import { API_TIMEOUT_MS } from "@/constants/Api";
import { getSessionId, loadHistory, updateHistory } from "@/utils";

/**
 * Submits user feedback for a specific message. Updates session storage
 * to mark feedback as given regardless of API success.
 *
 * @param id message ID to attach feedback to
 * @param types array of selected feedback option labels
 * @param message free-text feedback detail
 * @param is_response_useful whether the user found the response useful
 * @returns parsed API response or undefined on failure
 */
export default async function sendFeedback(
  id: number,
  types: string[],
  message: string,
  is_response_useful: boolean,
) {
  // Update session storage to mark feedback as given
  const chat_history = loadHistory();
  const itemIndex = chat_history.findIndex((item) => item.id === id);
  const lastItem = chat_history[itemIndex];
  let feedback_given = false;

  // Send feedback and handle response
  try {
    const data = await fetch(`/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "session-id": getSessionId(),
      },
      body: JSON.stringify({
        id,
        types,
        message,
        is_response_useful,
      }),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    const parsedResponse = await data.json();

    if (parsedResponse.error) {
      // If the response object includes an error value, then a HTTP error has occured
      throw new Error(parsedResponse.error, {
        cause: { code: parsedResponse.code },
      });
    }
    feedback_given = true;
    return parsedResponse;
  } catch (error: unknown) {
    console.error(error);
  } finally {
    if (itemIndex !== -1) {
      updateHistory({
        ...lastItem,
        feedback_given,
      });
    }
  }
}
