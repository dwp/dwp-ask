import "@testing-library/jest-dom";
import { sendQuery } from "../api";

// Mock the imported functions from "./"
jest.mock("../", () => ({
  sendQueryMessage: jest.fn(),
}));

// Import the mocked functions to access their mock implementations
import { sendQueryMessage } from "../";

const mockSendQueryMessage = sendQueryMessage as jest.MockedFunction<
  typeof sendQueryMessage
>;

describe("API utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sendQuery", () => {
    it("should call sendQueryMessage with correct parameters and return chat history", async () => {
      const mockChatHistory = [{ question: "test", answer: "response" }];
      mockSendQueryMessage.mockResolvedValue(mockChatHistory);

      const query = "What is the weather?";
      const location = "New York";

      const result = await sendQuery(query, location);

      expect(mockSendQueryMessage).toHaveBeenCalledWith(query, location);
      expect(mockSendQueryMessage).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockChatHistory);
    });

    it("should handle empty query and location", async () => {
      const mockChatHistory: any[] = [];
      mockSendQueryMessage.mockResolvedValue(mockChatHistory);

      const result = await sendQuery("", "");

      expect(mockSendQueryMessage).toHaveBeenCalledWith("", "");
      expect(result).toEqual(mockChatHistory);
    });
  });

  describe("Error handling", () => {
    it("should propagate errors from sendQueryMessage", async () => {
      const error = new Error("sendQueryMessage failed");
      mockSendQueryMessage.mockRejectedValue(error);

      await expect(sendQuery("test", "location")).rejects.toThrow(
        "sendQueryMessage failed",
      );
    });
  });
});
