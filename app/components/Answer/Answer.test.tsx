import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Providers from "@/app/providers/Providers";

jest.mock("@/app/utils/api", () => ({
  sendQuery: jest.fn().mockResolvedValue([]),
}));

import Answer from "./Answer";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
  jest.spyOn(console, "log").mockImplementation(jest.fn());
});

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

const ChatHistoryType = {
  question: "Test question",
  answer: "Test answer",
  id: 1,
};

const errorMessage = {
  question: "Test question",
  answer:
    "Apologies, we had a technical issue. Please try again in few minutes",
  type: "error",
  citations: [],
};

const TestAnswer = () => (
  <Providers>
    <Answer
      message={ChatHistoryType}
      setLoadedChatHistory={() => {}}
      setTyping={() => {}}
    />
  </Providers>
);

describe("Answer renders", () => {
  it("Message Answer Container is present in document body", () => {
    render(<TestAnswer />);
    const messageAnswerContainer = screen.getByTestId(
      "message-answer-container",
    );
    expect(messageAnswerContainer).toBeInTheDocument();
  });

  it("renders the error message correctly", () => {
    render(
      <Providers>
        <Answer
          message={errorMessage}
          setLoadedChatHistory={() => {}}
          setTyping={() => {}}
        />
      </Providers>,
    );
    const errorElement = screen.getByText(
      /Apologies, we had a technical issue/,
    );
    expect(errorElement).toBeInTheDocument();
  });
});
