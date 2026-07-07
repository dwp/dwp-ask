import { LOCATIONS } from "@/constants/Locations";
import { ChatHistoryType, LocationType, ViewDetailsData } from "@/types";

/**
 * Either retrieves chat history from session storage or defines it if not present
 *
 * @returns chat history array or []
 */
const loadHistory = (): ChatHistoryType[] => {
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

/**
 * Returns the current session ID from session storage.
 *
 * @returns session ID string or empty string if not set
 */
const getSessionId = () => sessionStorage.getItem("session_id") || "";

/**
 * Adds an object to chat history when a new query has been sent
 *
 * @param value obejct to add to chat history
 * @returns updated history
 */
const addHistory = (value: Partial<ChatHistoryType>) => {
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
const updateHistory = (value: ChatHistoryType) => {
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
    window.location.reload();
  }
};

/**
 * Confirm location change for modal
 *
 * @param location location to switch to
 */
const confirmChangeLocation = (location: LocationType) => {
  if (!location) return null;
  if (LOCATIONS.includes(location)) {
    const newItem = {
      question: `${location}.`,
      answer: `Okay, your claimant is in ${location}. Enter your question or click 'Help me ask' for help with starting your question.`,
      type: "chooseCountry",
      hasSetCountry: true,
      location,
    };
    addHistory(newItem);
    return newItem;
  }
  return null;
};

/**
 * Confirm chat should be cleared in modal -
 * clears chat history and reloads page
 */
const confirmClearChat = async () => {
  clearHistory();
  window.location.reload();
};

/**
 * Stores chat view details in session storage for the view-details page.
 *
 * @param items view details data to persist
 */
const storeViewDetails = (items: ViewDetailsData) => {
  sessionStorage.setItem("chat_view_page", JSON.stringify(items));
};

/**
 * Stores admin view details in session storage for the admin view-details page.
 *
 * @param items view details data to persist
 */
const storeAdminViewDetails = (items: ViewDetailsData) => {
  sessionStorage.setItem("admin_view_page", JSON.stringify(items));
};

/**
 * Retrieves chat view details from session storage.
 *
 * @returns parsed view details object or empty string if not set
 */
const getViewDetails = () => {
  // Load or define chat view from session storage
  const chat_history = sessionStorage.getItem("chat_view_page") || "";
  // Returns parsed chat view from session storage
  return chat_history ? JSON.parse(chat_history) : "";
};

/**
 * Retrieves admin view details from session storage.
 *
 * @returns parsed admin view details object or empty string if not set
 */
const getAdminViewDetails = () => {
  // Load or define admin view from session storage
  const admin_view = sessionStorage.getItem("admin_view_page") || "";
  // Returns parsed admin view from session storage
  return admin_view ? JSON.parse(admin_view) : "";
};

export {
  addHistory,
  clearHistory,
  clearSession,
  confirmChangeLocation,
  confirmClearChat,
  getAdminViewDetails,
  getSessionId,
  getViewDetails,
  loadHistory,
  storeAdminViewDetails,
  storeViewDetails,
  updateHistory,
};
