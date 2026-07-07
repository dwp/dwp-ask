import { render, screen } from "@testing-library/react";
import Providers from "@/providers/Providers";
import Message from "./Message";

vi.mock("@/utils", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return { ...actual, sendQuery: vi.fn().mockResolvedValue([]) };
});

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
});

const chatHistoryMessage = {
  question: "Test question",
  answer: "Test answer",
};

const TestMessage = () => (
  <Providers>
    <Message
      message={chatHistoryMessage}
      setLoadedChatHistory={() => {
        return {};
      }}
      setTyping={() => {
        return {};
      }}
    />
  </Providers>
);

describe("Message renders", () => {
  it("Message container is present in document body", () => {
    render(<TestMessage />);
    const messageQuestion = screen.getByTestId("message-container");
    expect(messageQuestion).toBeInTheDocument();
  });
});
