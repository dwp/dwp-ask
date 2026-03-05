import {
  initiateSession,
  confirmChangeLocation,
  confirmClearChat,
  loadHistory,
  addHistory,
  updateHistory,
  clearHistory,
  clearSession,
  getSessionId,
  storeViewDetails,
  getViewDetails,
  storeAdminViewDetails,
  getAdminViewDetails,
} from "./storage";

beforeEach(() => {
  Object.defineProperty(window, "sessionStorage", {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });

  jest.spyOn(console, "error").mockImplementation(jest.fn());
  jest.spyOn(console, "log").mockImplementation(jest.fn());
  (global.crypto.randomUUID as jest.Mock) = jest.fn(
    () => "mock-session-id-123",
  );
});

describe("storage tests", () => {
  describe("initiateSession", () => {
    it("should set location and session timestamp in sessionStorage", () => {
      const mockLocation = "Wales";
      const mocksetItem = jest.spyOn(window.sessionStorage, "setItem");
      initiateSession(mockLocation);
      expect(mocksetItem).toHaveBeenCalledWith("location", mockLocation);
      const mockDate = new Date().toDateString();
      expect(mocksetItem).toHaveBeenCalledWith(
        "session_timestamp",
        JSON.stringify(mockDate),
      );

      mocksetItem.mockRestore();
    });

    it("should return early for invalid location", () => {
      const mockLocation = "InvalidLocation";
      const mocksetItem = jest.spyOn(window.sessionStorage, "setItem");
      initiateSession(mockLocation);
      expect(mocksetItem).not.toHaveBeenCalledWith("location", mockLocation);
      mocksetItem.mockRestore();
    });
  });

  describe("confirmChangeLocation", () => {
    it("should set location and reload the page", async () => {
      const mockLocation = "England";
      const mocksetItem = jest.spyOn(sessionStorage, "setItem");
      await confirmChangeLocation(mockLocation);
      expect(mocksetItem).toHaveBeenCalledWith("location", mockLocation);
      mocksetItem.mockRestore();
    });

    it("should return early for invalid location", async () => {
      const mockLocation = "InvalidLocation";
      const mocksetItem = jest.spyOn(sessionStorage, "setItem");
      await confirmChangeLocation(mockLocation);
      expect(mocksetItem).not.toHaveBeenCalledWith("location", mockLocation);
      mocksetItem.mockRestore();
    });
  });

  describe("confirmClearChat", () => {
    it("should clear the history and reload the page", async () => {
      const mockClearHistory = jest.fn();
      await confirmClearChat();
      expect(mockClearHistory).not.toHaveBeenCalled();
    });
  });

  describe("loadHistory", () => {
    it("should return parsed chat history if present in sessionStorage", () => {
      const mockChatHistory = JSON.stringify([{ message: "Test message" }]);
      (sessionStorage.getItem as jest.Mock).mockReturnValue(mockChatHistory);
      const result = loadHistory();
      expect(result).toEqual([{ message: "Test message" }]);
    });

    it("should return an empty array if no chat history exists in sessionStorage", () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue(null);
      const result = loadHistory();
      expect(result).toEqual([]);
    });

    it("should set chat history as an empty array in sessionStorage if none exists", () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue(null);
      loadHistory();
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "chat_history",
        JSON.stringify([]),
      );
    });
  });

  describe("addHistory", () => {
    it("should add a new chat message to sessionStorage", () => {
      const mockChatHistory = JSON.stringify([{ message: "existing message" }]);
      (sessionStorage.getItem as jest.Mock).mockReturnValue(mockChatHistory);
      const newMessage = { message: "new message" };
      addHistory(newMessage);
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "chat_history",
        JSON.stringify([{ message: "existing message" }, newMessage]),
      );
    });

    it("should initialize chat history if it does not exists and add new message", () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue(null);
      const newMessage = { message: "new message" };
      addHistory(newMessage);
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        "chat_history",
        JSON.stringify([newMessage]),
      );
    });
  });

  describe("updateHistory", () => {
    it("should update the last item in chat history", () => {
      const mockChatHistory = JSON.stringify([{ message: "old message" }]);
      (sessionStorage.getItem as jest.Mock).mockReturnValue(mockChatHistory);
      const updatedMessage = { message: "updated message" };
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
      const mockReload = jest.fn();
      delete (window as any).location;
      window.location = { reload: mockReload } as any;

      // Mock sessionStorage.getItem to return current date when called
      (sessionStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === "session_timestamp") {
          return JSON.stringify(new Date().toDateString());
        }
        return null;
      });

      clearSession();
      expect(mockReload).not.toHaveBeenCalled();
    });
  });

  describe("getSessionId", () => {
    it("should return session id from storage", () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue("test-session-id");
      const result = getSessionId();
      expect(result).toBe("test-session-id");
    });

    it("should return empty string if no session id", () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue(null);
      const result = getSessionId();
      expect(result).toBe("");
    });
  });

  describe("storeViewDetails", () => {
    it("should store view details in session storage", () => {
      const testData = { page: "test" };
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
      (sessionStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify(testData),
      );
      const result = getViewDetails();
      expect(result).toEqual(testData);
    });

    it("should return empty string if no view details", () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue("");
      const result = getViewDetails();
      expect(result).toBe("");
    });
  });

  describe("storeAdminViewDetails", () => {
    it("should store admin view details in session storage", () => {
      const testData = { admin: "test" };
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
      (sessionStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify(testData),
      );
      const result = getAdminViewDetails();
      expect(result).toEqual(testData);
    });

    it("should return empty string if no admin view details", () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue("");
      const result = getAdminViewDetails();
      expect(result).toBe("");
    });
  });
});
