import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedFunction } from "vitest";
import * as locationProvider from "@/providers";
import { sendQueryMessage } from "@/utils";
import { mockComponents } from "@/utils/test";
import ChatInput from "./ChatInput";

vi.mock("@/components", () => mockComponents);
vi.mock("@/providers");
vi.mock("@/utils", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return { ...actual, sendQueryMessage: vi.fn() };
});

const mockUseLocation = locationProvider.useLocation as MockedFunction<
  typeof locationProvider.useLocation
>;
const mockSendQueryMessage = sendQueryMessage as MockedFunction<
  typeof sendQueryMessage
>;

const mockProps = {
  loadedChatHistory: [],
  setLoadedChatHistory: vi.fn(),
  typing: false,
  setTyping: vi.fn(),
  isModalOpen: false,
};

describe("ChatInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocation.mockReturnValue({
      location: "England",
      setLocation: vi.fn(),
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
    mockUseLocation.mockReturnValue({ location: null, setLocation: vi.fn() });

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
        "England",
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
