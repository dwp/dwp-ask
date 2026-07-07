import { DEFAULT_RESPONSE_TEXT } from "@/constants/Api";
import {
  addHistory,
  calculateIndex,
  catchError,
  loadHistory,
  updateHistory,
  // filterChatHistory,
} from "@/utils";
// import type { QueryResponseType } from "@/app/types";
// import { getSessionId } from "../storage/storage";
import { returnPrototypeResponse } from "../prototypeResponses";

export default async function sendQueryMessage(
  query: string,
  _location: string,
  counter: number,
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
    const responseAnswer = (response.answer ?? "").trim();
    const answerGenDisabled = !response.answer_gen_enabled;
    const isBlankResponse = answerGenDisabled && !responseAnswer;
    const resolvedAnswer =
      answerGenDisabled && !responseAnswer
        ? DEFAULT_RESPONSE_TEXT
        : (response.answer ?? "");

    await new Promise((res) => setTimeout(res, 4000));

    updateHistory({
      ...lastItem,
      answer: resolvedAnswer,
      citations: isBlankResponse ? [] : (response.citations ?? []),
      id: response.id ?? null,
      question_feedback: response.question_feedback ?? null,
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
