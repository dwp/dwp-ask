import {
  calculateIndex,
  capitalise,
  catchError,
  filterChatHistory,
  sanitisePathname,
} from "./helpers";
import { trimWhitespace } from "./message-helpers";
import {
  addHistory,
  clearHistory,
  clearSession,
  confirmChangeLocation,
  confirmClearChat,
  loadHistory,
  updateHistory,
} from "./storage/storage";

export {
  loadHistory,
  addHistory,
  updateHistory,
  clearHistory,
  calculateIndex,
  capitalise,
  catchError,
  clearSession,
  filterChatHistory,
  confirmChangeLocation,
  confirmClearChat,
  sanitisePathname,
  trimWhitespace,
};
