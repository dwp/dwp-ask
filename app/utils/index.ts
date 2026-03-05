import {
  loadHistory,
  addHistory,
  updateHistory,
  clearHistory,
  initiateSession,
  clearSession,
  confirmChangeLocation,
  confirmClearChat,
  getLocation,
  clearLocation,
} from "./storage/storage";

import {
  calculateIndex,
  capitalise,
  catchError,
  filterChatHistory,
  sanitisePathname,
} from "./helpers";

import { trimWhitespace } from "./message-helpers";

export {
  loadHistory,
  addHistory,
  updateHistory,
  clearHistory,
  calculateIndex,
  capitalise,
  catchError,
  initiateSession,
  clearSession,
  filterChatHistory,
  confirmChangeLocation,
  confirmClearChat,
  sanitisePathname,
  trimWhitespace,
  getLocation,
  clearLocation,
};
