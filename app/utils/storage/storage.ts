import { locations } from "@/app/components/Landing/config";

/**
 * Either retrieves chat history from session storage or defines it if not present
 *
 * @returns chat history array or []
 */
const loadHistory = () => {
  // Load or define chat history from session storage
  let chat_history = sessionStorage.getItem("chat_history") || "";
  if (!chat_history.length) {
    sessionStorage.setItem("chat_history", JSON.stringify([]));
  }

  // Update the variable so it can be parsed
  chat_history = sessionStorage.getItem("chat_history") || "[]";
  const parsedHistory = JSON.parse(chat_history);

  // Returns parsed chat history from session storage
  return parsedHistory ?? [];
};

const getSessionId = () => sessionStorage.getItem("session_id") || "";

/**
 * Adds an object to chat history when a new query has been sent
 *
 * @param value obejct to add to chat history
 * @returns void
 */
const addHistory = (value: any) => {
  const chatHistory = sessionStorage.getItem("chat_history") || "[]";
  const parsedHistory = JSON.parse(chatHistory);
  sessionStorage.setItem(
    "chat_history",
    JSON.stringify([...parsedHistory, { ...value }]),
  );
  return [...parsedHistory, { ...value }];
};

/**
 * Updates the last item in chat history
 *
 * @param value object that should be used to update chat history
 * @returns void
 */
const updateHistory = (value: any) => {
  const history = sessionStorage.getItem("chat_history") ?? "";
  const parsedHistory = JSON.parse(history);
  parsedHistory[parsedHistory.length - 1] = value;
  sessionStorage.setItem("chat_history", JSON.stringify(parsedHistory));
};

/**
 * Deletes chat history from session storage
 *
 * @returns void
 */
const clearHistory = () => {
  // storing session_id
  sessionStorage.setItem("session_id", crypto.randomUUID());
  sessionStorage.removeItem("chat_view_page");
  sessionStorage.removeItem("chat_history");
};

/**
 * Initiate a chat in session storage
 * - Set location in session storage
 * - Set timestamp in session storage
 * - Clear any previous history
 *
 *
 * @param location location selected from dropdown
 * @returns void
 */
const initiateSession = (location: string) => {
  if (locations.includes(location)) {
    sessionStorage.setItem("location", location);
  } else {
    return;
  }
  sessionStorage.setItem(
    "session_timestamp",
    JSON.stringify(new Date().toDateString()),
  );
  clearHistory();
};

/**
 * Determines whether chat should be cleared based on session timestamp
 *
 * @returns void
 */
const clearSession = () => {
  // Store current date in a constant
  const currentDate = new Date().toDateString();
  // Retrieve the session timestamp
  const sessionDate = JSON.parse(sessionStorage.getItem("session_timestamp")!);
  // Parse the date from plaintext string into milliseconds
  const parsedDate = Date.parse(sessionDate);
  // Convert the date to a comparable Date string
  const convertedDate = new Date(parsedDate).toDateString();
  // Clear the chat if the dates are not equal and reset timestamp
  if (convertedDate !== currentDate) {
    clearHistory();
    sessionStorage.setItem(
      "session_timestamp",
      JSON.stringify(new Date().toDateString()),
    );
    sessionStorage.removeItem("location");
    window.location.reload();
  }
};

/**
 * Confirm location change for modal
 *
 * @param location location to switch to
 */
const confirmChangeLocation = (location: string) => {
  if (locations.includes(location)) {
    sessionStorage.setItem("location", location);
    const newItem = {
      question: `${location}.`,
      answer: `Okay, your claimant is in ${location}. Enter your question.`,
    };
    addHistory(newItem);
    return newItem;
  }
  return null;
};

/**
 * Clears location from session storage
 */
const clearLocation = () => {
  sessionStorage.removeItem("location");
};

/**
 * Gets location from session storage
 * @returns location
 */
const getLocation = () => {
  try {
    if (
      typeof window === "undefined" ||
      typeof window.sessionStorage === "undefined"
    ) {
      return "";
    }
    return sessionStorage.getItem("location") ?? "";
  } catch {
    return "";
  }
};

/**
 * Confirm chat should be cleared in modal -
 * clears chat history and reloads page
 */
const confirmClearChat = async () => {
  clearHistory();
  clearLocation();
  window.location.reload();
};

const storeViewDetails = (items: any) => {
  sessionStorage.setItem("chat_view_page", JSON.stringify(items));
};

const storeAdminViewDetails = (items: any) => {
  sessionStorage.setItem("admin_view_page", JSON.stringify(items));
};

const getViewDetails = () => {
  // Load or define chat view from session storage
  const chat_history = sessionStorage.getItem("chat_view_page") || "";
  // Returns parsed chat view from session storage
  return chat_history ? JSON.parse(chat_history) : "";
};

const getAdminViewDetails = () => {
  // Load or define admin view from session storage
  const admin_view = sessionStorage.getItem("admin_view_page") || "";
  // Returns parsed admin view from session storage
  return admin_view ? JSON.parse(admin_view) : "";
};

export {
  loadHistory,
  addHistory,
  updateHistory,
  clearHistory,
  initiateSession,
  clearSession,
  confirmChangeLocation,
  confirmClearChat,
  getSessionId,
  storeViewDetails,
  getViewDetails,
  storeAdminViewDetails,
  getAdminViewDetails,
  getLocation,
  clearLocation,
};
