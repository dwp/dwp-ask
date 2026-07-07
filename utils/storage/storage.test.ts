import { LocationType } from "@/types";
import {
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
} from "./storage";

beforeEach(() => {
  Object.defineProperty(window, "sessionStorage", {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
    writable: true,
  });

  vi.spyOn(console, "error").mockImplementation(vi.fn());
  vi.spyOn(console, "log").mockImplementation(vi.fn());
  vi.spyOn(global.crypto, "randomUUID").mockReturnValue(
    "mock-session-id-123" as `${string}-${string}-${string}-${string}-${string}`,
  );
});

describe("storage tests", () => {
  describe("confirmClearChat", () => {
    it("should clear the history and reload the page", async () => {
      const mockClearHistory = vi.fn();
      await confirmClearChat();
      expect(mockClearHistory).not.toHaveBeenCalled();
    });
  });

  describe("loadHistory", () => {
    it("should return parsed chat history if present in sessionStorage", () => {
      const mockChatHistory = JSON.stringify([{ message: "Test message" }]);
      vi.mocked(sessionStorage.getItem).mockReturnValue(mockChatHistory);
      const result = loadHistory();
      expect(result).toEqual([{ message: "Test message" }]);
    });

    it("should return an empty array if no chat history exists in sessionStorage", () => {
      vi.mocked(sessionStorage.getItem).mockReturnValue(null);
      const result = loadHistory();
      expect(result).toEqual([]);
    });

    it("should set chat history as an empty array in sessionStorage if none exists", () => {
      vi.mocked(sessionStorage.getItem).mockReturnValue(null);
      loadHistory();
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "chat_history",
        JSON.stringify([]),
      );
    });
  });

  describe("addHistory", () => {
    it("should add a new chat message to sessionStorage", () => {
      const mockChatHistory = JSON.stringify([
        { question: "existing message", answer: "" },
      ]);
      vi.mocked(sessionStorage.getItem).mockReturnValue(mockChatHistory);
      const newMessage = { question: "new message", answer: "" };
      addHistory(newMessage);
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "chat_history",
        JSON.stringify([
          { question: "existing message", answer: "" },
          newMessage,
        ]),
      );
    });

    it("should initialize chat history if it does not exists and add new message", () => {
      vi.mocked(sessionStorage.getItem).mockReturnValue(null);
      const newMessage = { question: "new message", answer: "" };
      addHistory(newMessage);
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "chat_history",
        JSON.stringify([newMessage]),
      );
    });
  });

  describe("updateHistory", () => {
    it("should update the last item in chat history", () => {
      const mockChatHistory = JSON.stringify([
        { question: "old message", answer: "" },
      ]);
      vi.mocked(sessionStorage.getItem).mockReturnValue(mockChatHistory);
      const updatedMessage = { question: "updated message", answer: "" };
      updateHistory(updatedMessage);
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "chat_history",
        JSON.stringify([updatedMessage]),
      );
    });
  });

  describe("clearHistory", () => {
    it("should clear chat history and set new session id", () => {
      clearHistory();
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "session_id",
        "mock-session-id-123",
      );
      expect(sessionStorage.removeItem).toHaveBeenCalledWith("chat_view_page");
      expect(sessionStorage.removeItem).toHaveBeenCalledWith("chat_history");
    });
  });

  describe("clearSession", () => {
    it("should not clear session when dates are same", () => {
      const mockReload = vi.fn();
      Object.defineProperty(window, "location", {
        value: { reload: mockReload },
        writable: true,
        configurable: true,
      });

      vi.mocked(sessionStorage.getItem).mockImplementation((key: string) => {
        if (key === "session_timestamp") {
          return JSON.stringify(new Date().toDateString());
        }
        return null;
      });

      clearSession();
      expect(mockReload).not.toHaveBeenCalled();
    });

    it("should clear session and reload when dates differ", () => {
      const mockReload = vi.fn();
      Object.defineProperty(window, "location", {
        value: { reload: mockReload },
        writable: true,
        configurable: true,
      });

      vi.mocked(sessionStorage.getItem).mockImplementation((key: string) => {
        if (key === "session_timestamp") {
          return JSON.stringify("Mon Jan 01 2001");
        }
        return null;
      });

      clearSession();
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "session_timestamp",
        expect.any(String),
      );
      expect(mockReload).toHaveBeenCalled();
    });
  });

  describe("getSessionId", () => {
    it("should return session id from storage", () => {
      vi.mocked(sessionStorage.getItem).mockReturnValue("test-session-id");
      const result = getSessionId();
      expect(result).toBe("test-session-id");
    });

    it("should return empty string if no session id", () => {
      vi.mocked(sessionStorage.getItem).mockReturnValue(null);
      const result = getSessionId();
      expect(result).toBe("");
    });
  });

  describe("storeViewDetails", () => {
    it("should store view details in session storage", () => {
      const testData = {
        parsedDate: ["01/01/2025", "12:00 PM"] as [string, string],
        items: {
          citations: [],
          created_at: "",
          previous_chat_history: {},
          question: "test",
          id: 1,
        },
      };

      storeViewDetails(testData);
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "chat_view_page",
        JSON.stringify(testData),
      );
    });
  });

  describe("getViewDetails", () => {
    it("should return parsed view details", () => {
      const testData = { page: "test" };
      vi.mocked(sessionStorage.getItem).mockReturnValue(
        JSON.stringify(testData),
      );
      const result = getViewDetails();
      expect(result).toEqual(testData);
    });

    it("should return empty string if no view details", () => {
      vi.mocked(sessionStorage.getItem).mockReturnValue("");
      const result = getViewDetails();
      expect(result).toBe("");
    });
  });

  describe("storeAdminViewDetails", () => {
    it("should store admin view details in session storage", () => {
      const testData = {
        parsedDate: ["01/01/2025", "12:00 PM"] as [string, string],
        items: {
          citations: [],
          created_at: "",
          previous_chat_history: {},
          question: "test",
          id: 1,
        },
      };

      storeAdminViewDetails(testData);
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "admin_view_page",
        JSON.stringify(testData),
      );
    });
  });

  describe("getAdminViewDetails", () => {
    it("should return parsed admin view details", () => {
      const testData = { admin: "test" };
      vi.mocked(sessionStorage.getItem).mockReturnValue(
        JSON.stringify(testData),
      );
      const result = getAdminViewDetails();
      expect(result).toEqual(testData);
    });

    it("should return empty string if no admin view details", () => {
      vi.mocked(sessionStorage.getItem).mockReturnValue("");
      const result = getAdminViewDetails();
      expect(result).toBe("");
    });
  });

  describe("confirmChangeLocation", () => {
    beforeEach(() => {
      vi.mocked(sessionStorage.getItem).mockReturnValue(JSON.stringify([]));
    });

    it("should add new location entry to history for valid location - England", () => {
      const mockChatHistory = JSON.stringify([]);
      vi.mocked(sessionStorage.getItem).mockReturnValue(mockChatHistory);

      const result = confirmChangeLocation("England");

      expect(result).toEqual({
        question: "England.",
        answer: "Okay, your claimant is in England. Enter your question.",
        type: "chooseCountry",
        hasSetCountry: true,
        location: "England",
      });
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "chat_history",
        JSON.stringify([
          {
            question: "England.",
            answer: "Okay, your claimant is in England. Enter your question.",
            type: "chooseCountry",
            hasSetCountry: true,
            location: "England",
          },
        ]),
      );
    });

    it("should add new location entry to history for valid location - Scotland", () => {
      const mockChatHistory = JSON.stringify([]);
      vi.mocked(sessionStorage.getItem).mockReturnValue(mockChatHistory);

      const result = confirmChangeLocation("England");

      expect(result).toEqual({
        question: "England.",
        answer: "Okay, your claimant is in England. Enter your question.",
        type: "chooseCountry",
        hasSetCountry: true,
        location: "England",
      });
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "chat_history",
        JSON.stringify([
          {
            question: "England.",
            answer: "Okay, your claimant is in England. Enter your question.",
            type: "chooseCountry",
            hasSetCountry: true,
            location: "England",
          },
        ]),
      );

      const resultScotland = confirmChangeLocation("Scotland");

      expect(resultScotland).toEqual({
        question: "Scotland.",
        answer: "Okay, your claimant is in Scotland. Enter your question.",
        type: "chooseCountry",
        hasSetCountry: true,
        location: "Scotland",
      });
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "chat_history",
        JSON.stringify([
          {
            question: "Scotland.",
            answer: "Okay, your claimant is in Scotland. Enter your question.",
            type: "chooseCountry",
            hasSetCountry: true,
            location: "Scotland",
          },
        ]),
      );
    });

    it("should return null for invalid location", () => {
      const result = confirmChangeLocation("Spain" as unknown as LocationType);

      expect(result).toBeNull();
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });

    it("should return null for null location", () => {
      const result = confirmChangeLocation(null);

      expect(result).toBeNull();
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });

    it("should return null for location with wrong casing", () => {
      const result = confirmChangeLocation(null);

      expect(result).toBeNull();
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });

    it("should append to existing chat history when adding location", () => {
      const existingHistory = JSON.stringify([
        { question: "Previous question", answer: "Previous answer" },
      ]);
      vi.mocked(sessionStorage.getItem).mockReturnValue(existingHistory);

      const result = confirmChangeLocation("England");

      expect(result).toEqual({
        question: "England.",
        answer: "Okay, your claimant is in England. Enter your question.",
        type: "chooseCountry",
        hasSetCountry: true,
        location: "England",
      });
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "chat_history",
        JSON.stringify([
          { question: "Previous question", answer: "Previous answer" },
          {
            question: "England.",
            answer: "Okay, your claimant is in England. Enter your question.",
            type: "chooseCountry",
            hasSetCountry: true,
            location: "England",
          },
        ]),
      );
    });
  });
});
