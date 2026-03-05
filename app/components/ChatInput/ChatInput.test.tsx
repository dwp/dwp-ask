import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatInput from "./ChatInput";
import * as locationProvider from "@/app/providers";
import sendQueryMessage from "@/app/utils/api/sendQueryMessage";

// Mock dependencies
jest.mock("@/app/components", () => ({
  Typing: () => <div data-testid="typing">Typing...</div>,
  QueryTextArea: ({
    value,
    onChange,
    onKeyDown,
    sendQueryAndClear,
    error,
  }: any) => (
    <div>
      <textarea
        data-testid="query-textarea"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <button data-testid="send-button" onClick={sendQueryAndClear}>
        Send
      </button>
      {error.blank && (
        <span data-testid="blank-error">Query cannot be blank</span>
      )}
      {error.location && (
        <span data-testid="location-error">Location required</span>
      )}
    </div>
  ),
}));

jest.mock("@/app/utils/storage/storage", () => ({
  getLocation: jest.fn().mockReturnValue("test-location"),
}));

jest.mock("@/app/providers");
jest.mock("@/app/utils/api/sendQueryMessage");

const mockUseLocation = locationProvider.useLocation as jest.MockedFunction<
  typeof locationProvider.useLocation
>;
const mockSendQueryMessage = sendQueryMessage as jest.MockedFunction<
  typeof sendQueryMessage
>;

const mockProps = {
  loadedChatHistory: [],
  setLoadedChatHistory: jest.fn(),
  typing: false,
  setTyping: jest.fn(),
  isModalOpen: false,
};

describe("ChatInput", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocation.mockReturnValue({
      location: "test-location",
      setLocation: jest.fn(),
    });
    mockSendQueryMessage.mockResolvedValue([
      { question: "test", answer: "response" },
    ]);
  });

  it("renders input components", () => {
    render(<ChatInput {...mockProps} />);

    expect(screen.getByTestId("chat-input-text-area")).toBeInTheDocument();
    expect(screen.getByTestId("query-textarea")).toBeInTheDocument();
    expect(screen.getByTestId("send-button")).toBeInTheDocument();
  });

  it("shows typing indicator when typing is true", () => {
    render(<ChatInput {...mockProps} typing={true} />);

    expect(screen.getByTestId("typing")).toBeInTheDocument();
  });

  it("shows location error when no location is set", async () => {
    mockUseLocation.mockReturnValue({ location: "", setLocation: jest.fn() });

    const user = userEvent.setup();
    render(<ChatInput {...mockProps} />);

    await user.click(screen.getByTestId("send-button"));

    expect(screen.getByTestId("location-error")).toBeInTheDocument();
  });

  it("shows blank error for empty query", async () => {
    const user = userEvent.setup();
    render(<ChatInput {...mockProps} />);

    await user.click(screen.getByTestId("send-button"));

    expect(screen.getByTestId("blank-error")).toBeInTheDocument();
  });

  it("sends query on Enter key press", async () => {
    const user = userEvent.setup();

    render(<ChatInput {...mockProps} />);

    const textarea = screen.getByTestId("query-textarea");
    await user.type(textarea, "test query");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(mockSendQueryMessage).toHaveBeenCalledWith(
        "test query",
        "test-location",
      );
    });
  });

  it("prevents sending when modal is open", async () => {
    const user = userEvent.setup();

    render(<ChatInput {...mockProps} isModalOpen={true} />);

    const textarea = screen.getByTestId("query-textarea");
    await user.type(textarea, "test query");
    await user.click(screen.getByTestId("send-button"));

    expect(mockSendQueryMessage).not.toHaveBeenCalled();
  });
});
