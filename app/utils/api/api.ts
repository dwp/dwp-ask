import { sendQueryMessage } from "./";

export const sendQuery = async (
  query: string,
  location: string,
  counter: number,
) => {
  const chat_history = sendQueryMessage(query, location, counter);
  return chat_history;
};
