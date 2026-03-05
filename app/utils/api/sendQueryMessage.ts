import {
  loadHistory,
  addHistory,
  calculateIndex,
  updateHistory,
  catchError,
  // filterChatHistory,
} from "@/app/utils";
// import type { QueryResponseType } from "@/app/types";
// import { getSessionId } from "../storage/storage";
import { returnPrototypeResponse } from "../prototypeResponses";

export default async function sendQueryMessage(
  query: string,
  _location: string,
  counter: number
) {
  // Define chat history object
  let chat_history = loadHistory();
  // Insert the question into session storage
  addHistory({ question: query });
  // const sessionId = getSessionId();

  // const filteredChatHistory = filterChatHistory(chat_history);

  // Send query and handle response
  try {
    const response: any = returnPrototypeResponse(counter);

    // Update session storage chat history
    chat_history = loadHistory();
    const index = calculateIndex("query");
    const lastItem = chat_history[index];
    await new Promise((res) => setTimeout(res, 5000));
    updateHistory({
      ...lastItem,
      answer: response.answer,
      citations: response.citations || [],
      default_response: response.default_response ?? false,
      id: response.id ?? null,
    });
  } catch (error: any) {
    console.log(error);
    // The HTTP error code should be passed to this function so an appropriate message can be displayed on the frontend and the metadata for the chat history object can be updated
    catchError(error?.cause?.code || 500);
  }

  // Reload chat_history to return it
  chat_history = loadHistory();
  return chat_history;
}
