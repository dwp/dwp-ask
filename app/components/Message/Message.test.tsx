import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

jest.mock("@/app/utils/api", () => ({
  sendQuery: jest.fn().mockResolvedValue([]),
}));

import Message from "./Message";
import Providers from "@/app/providers/Providers";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

const ChatHistoryType = {
  question: "Test question",
  answer: "Test answer",
};

const TestMessage = () => (
  <Providers>
    <Message
      message={ChatHistoryType}
      setLoadedChatHistory={() => {}}
      setTyping={() => {}}
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
