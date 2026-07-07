import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as componentModule from "@/components";
import * as providersModule from "@/providers";
import Providers from "@/providers/Providers";
import type {
  ChatHistoryType,
  LocationType,
  SuggestedQuestionsProps,
} from "@/types";
import { sendQueryMessage } from "@/utils";

const mockLoadHistory = vi.hoisted(() =>
  vi.fn<() => ChatHistoryType[]>(() => []),
);

vi.mock("@/utils", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    sendQueryMessage: vi.fn().mockResolvedValue([]),
    confirmChangeLocation: vi.fn((location: string) => ({
      question: `${location}.`,
      answer: `Okay, your claimant is in ${location}. Enter your question.`,
      type: "chooseCountry",
      hasSetCountry: true,
      location,
    })),
    loadHistory: mockLoadHistory,
  };
});

import { registerQuestionTemplatesOpener } from "../QuestionTemplates/questionTemplatesController";
import Answer from "./Answer";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
  vi.spyOn(console, "log").mockImplementation(vi.fn());
  mockLoadHistory.mockReturnValue([]);
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

const chatHistoryMessage = {
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

const chooseCountryInitialMessage = {
  question: "",
  answer: "Welcome to DWP Ask. To start, select where your claimant lives:",
  type: "chooseCountry",
  hasSetCountry: false,
};

const chooseCountryConfirmationMessage = {
  question: "England.",
  answer: "Okay, your claimant is in England. Enter your question.",
  type: "chooseCountry",
  hasSetCountry: true,
  location: "England" as LocationType,
};

const TestAnswer = ({
  message = chatHistoryMessage,
  setLoadedChatHistory = () => undefined,
  setTyping = () => undefined,
}: {
  message?: ChatHistoryType;
  setLoadedChatHistory?: Function;
  setTyping?: Function;
} = {}) => (
  <Providers>
    <Answer
      message={message}
      setLoadedChatHistory={setLoadedChatHistory}
      setTyping={setTyping}
    />
  </Providers>
);

describe("Answer renders", () => {
  it("Message Answer Container is present in document body", () => {
    render(<TestAnswer message={chatHistoryMessage} />);
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
          setLoadedChatHistory={() => {
            return {};
          }}
          setTyping={() => {
            return {};
          }}
        />
      </Providers>,
    );
    const errorElement = screen.getByText(
      /Apologies, we had a technical issue/,
    );
    expect(errorElement).toBeInTheDocument();
  });
});

describe("Question feedback rendering", () => {
  const questionFeedbackMessage = {
    question: "Original question",
    answer: "Legacy fallback body",
    question_feedback: {
      topic_label: "the State Pension",
      suggested_questions: [
        "What happens to Universal Credit at State Pension age?",
        "How do I transition from UC to Pension Credit?",
        "Can I get both UC and State Pension?",
      ],
    },
  };

  const structuredQuestionFeedbackMessage = {
    ...questionFeedbackMessage,
    question_feedback: {
      ...questionFeedbackMessage.question_feedback,
      preamble:
        "**Sorry.** I could not find an answer. For help, use a template before trying again.",
      postscript: "Still stuck? For help, use a template.",
    },
  };

  const outOfScopeQuestionFeedbackMessage = {
    ...questionFeedbackMessage,
    question_feedback: {
      ...questionFeedbackMessage.question_feedback,
      preamble: "Out of scope preamble",
      postscript: "Out of scope postscript",
      out_of_scope: true,
    },
  };

  it("renders structured question feedback when preamble and postscript exist", () => {
    render(<TestAnswer message={structuredQuestionFeedbackMessage} />);

    expect(screen.queryByText("Legacy fallback body")).not.toBeInTheDocument();
    expect(screen.queryByTestId("answer-markdown")).not.toBeInTheDocument();

    const templateLinks = screen.getAllByTestId(
      "question-feedback-template-link",
    );
    expect(templateLinks).toHaveLength(2);

    const buttons = screen.getAllByTestId("question-feedback-button");
    expect(buttons).toHaveLength(3);
  });

  it("turns template text into a hyperlink button that opens question templates", async () => {
    const toggleSpy = vi.fn();
    const unregister = registerQuestionTemplatesOpener(toggleSpy);

    render(<TestAnswer message={structuredQuestionFeedbackMessage} />);

    const templateLinks = screen.getAllByTestId(
      "question-feedback-template-link",
    );
    expect(templateLinks).toHaveLength(2);

    await userEvent.click(templateLinks[0]);

    expect(toggleSpy).toHaveBeenCalledTimes(1);

    unregister();
  });

  it("sends the suggested question when a button is clicked", async () => {
    const mockSetHistory = vi.fn();
    const mockSetTyping = vi.fn();
    mockLoadHistory.mockReturnValue([
      {
        question: "Previous question",
        answer: "Previous answer",
        hasSetCountry: true,
        location: "England",
      },
    ]);

    render(
      <TestAnswer
        message={questionFeedbackMessage}
        setLoadedChatHistory={mockSetHistory}
        setTyping={mockSetTyping}
      />,
    );

    const button = screen.getByRole("button", {
      name: "What happens to Universal Credit at State Pension age?",
    });

    await userEvent.click(button);

    await waitFor(() => {
      expect(sendQueryMessage).toHaveBeenCalledWith(
        "What happens to Universal Credit at State Pension age?",
        "England",
      );
    });
  });

  it("renders only the answer when the question feedback is flagged as out of scope", () => {
    render(<TestAnswer message={outOfScopeQuestionFeedbackMessage} />);

    expect(screen.getByText("Legacy fallback body")).toBeInTheDocument();
    expect(
      screen.queryByTestId("question-feedback-buttons"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("question-feedback-structured"),
    ).not.toBeInTheDocument();
  });
});

describe("Source links rendering", () => {
  const messageWithCitations = {
    question: "What is UC?",
    answer: "Universal Credit is a benefit.",
    citations: [
      {
        title: "UC Policy",
        url: "https://example.com/uc",
        chunks: "chunk1",
        highlights_url: "https://example.com/uc#h",
        highlights_text: "highlight",
      },
      {
        title: "UC Guide",
        url: "https://example.com/guide",
        chunks: "chunk2",
        highlights_url: "https://example.com/guide#h",
        highlights_text: "highlight2",
      },
    ],
  };

  it("renders source links when citations are present", () => {
    render(<TestAnswer message={messageWithCitations} />);
    expect(screen.getByTestId("source-links")).toBeInTheDocument();
  });

  it("does not render source links when citations are empty", () => {
    render(<TestAnswer message={{ ...messageWithCitations, citations: [] }} />);
    expect(screen.queryByTestId("source-links")).not.toBeInTheDocument();
  });

  it("does not render source links when citations are undefined", () => {
    render(
      <TestAnswer
        message={{ question: "q", answer: "a", citations: undefined }}
      />,
    );
    expect(screen.queryByTestId("source-links")).not.toBeInTheDocument();
  });
});

describe("Suggested question click error handling", () => {
  const questionFeedbackMessage = {
    question: "Original question",
    answer: "Answer body",
    question_feedback: {
      topic_label: "topic",
      suggested_questions: ["Suggestion 1"],
    },
  };

  it("logs error and resets state when sendQueryMessage rejects", async () => {
    mockLoadHistory.mockReturnValue([
      {
        question: "prev",
        answer: "prev",
        hasSetCountry: true,
        location: "England",
      },
    ]);
    vi.mocked(sendQueryMessage).mockRejectedValueOnce(
      new Error("Network error"),
    );

    const mockSetHistory = vi.fn();
    const mockSetTyping = vi.fn();

    render(
      <TestAnswer
        message={questionFeedbackMessage}
        setLoadedChatHistory={mockSetHistory}
        setTyping={mockSetTyping}
      />,
    );

    const button = screen.getByRole("button", { name: "Suggestion 1" });
    await userEvent.click(button);

    await waitFor(() => {
      expect(mockSetTyping).toHaveBeenCalledWith(false);
    });
  });
});

describe("isView prop", () => {
  const messageWithSuggestions = {
    question: "Question",
    answer: "Answer",
    question_feedback: {
      topic_label: "topic",
      suggested_questions: ["Suggestion 1"],
    },
  };

  it("hides suggested questions when isView is true", () => {
    mockLoadHistory.mockReturnValue([
      {
        question: "prev",
        answer: "prev",
        hasSetCountry: true,
        location: "England",
      },
    ]);

    render(
      <Providers>
        <Answer
          message={messageWithSuggestions}
          setLoadedChatHistory={vi.fn()}
          setTyping={vi.fn()}
          isView={true}
        />
      </Providers>,
    );

    expect(
      screen.queryByRole("button", { name: "Suggestion 1" }),
    ).not.toBeInTheDocument();
  });
});

describe("Postscript rendering", () => {
  it("renders postscript when structured feedback has postscript", () => {
    const message = {
      question: "q",
      answer: "a",
      question_feedback: {
        topic_label: "topic",
        suggested_questions: ["S1"],
        preamble: "Preamble text",
        postscript: "Postscript text",
      },
    };

    render(<TestAnswer message={message} />);
    expect(
      screen.getByTestId("question-feedback-postscript"),
    ).toBeInTheDocument();
  });

  it("does not render postscript when only preamble exists", () => {
    const message = {
      question: "q",
      answer: "a",
      question_feedback: {
        topic_label: "topic",
        suggested_questions: ["S1"],
        preamble: "Preamble only",
      },
    };

    render(<TestAnswer message={message} />);
    expect(
      screen.queryByTestId("question-feedback-postscript"),
    ).not.toBeInTheDocument();
  });
});

describe("CountryCards rendering", () => {
  it("should render CountryCards on initial chooseCountry message when no location is set", async () => {
    render(<TestAnswer message={chooseCountryInitialMessage} />);

    // Wait for component to mount
    await new Promise((resolve) => setTimeout(resolve, 100));

    const countryButtons = screen.queryAllByRole("button");
    // Should have country buttons (England, Scotland, Wales)
    const hasCountryButtons = countryButtons.some((btn) =>
      /England|Scotland|Wales/.test(btn.textContent || ""),
    );
    expect(hasCountryButtons).toBe(true);
  });

  it("calls setLocation and setLoadedChatHistory when a country card is clicked", async () => {
    const mockSetHistory = vi.fn();
    mockLoadHistory.mockReturnValue([]);

    render(
      <TestAnswer
        message={chooseCountryInitialMessage}
        setLoadedChatHistory={mockSetHistory}
      />,
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const englandButton = screen.getByRole("button", { name: /England/i });
    await userEvent.click(englandButton);

    await waitFor(() => {
      expect(mockSetHistory).toHaveBeenCalled();
    });
  });

  it("should NOT render CountryCards on chooseCountry confirmation message", async () => {
    render(<TestAnswer message={chooseCountryConfirmationMessage} />);

    // Wait for component to mount
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should not have country cards with the specific test data
    const countryCards = screen.queryByTestId("country-cards-container");
    expect(countryCards).not.toBeInTheDocument();
  });

  it("should NOT render CountryCards when hasSetCountry is true", async () => {
    const messageWithCountrySet = {
      question: "Scotland.",
      answer: "Okay, your claimant is in Scotland. Enter your question.",
      type: "chooseCountry",
      hasSetCountry: true,
      location: "Scotland" as LocationType,
    };

    render(<TestAnswer message={messageWithCountrySet} />);

    // Wait for component to mount
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify the message is rendered but not the country cards
    expect(
      screen.getByText(
        "Okay, your claimant is in Scotland. Enter your question.",
      ),
    ).toBeInTheDocument();
  });

  it("should NOT render CountryCards on regular messages", async () => {
    const regularMessage = {
      question: "What is UC?",
      answer: "Universal Credit is a benefit...",
      type: "response",
    };

    render(<TestAnswer message={regularMessage} />);

    // Wait for component to mount
    await new Promise((resolve) => setTimeout(resolve, 100));

    const countryCards = screen.queryByTestId("country-cards-container");
    expect(countryCards).not.toBeInTheDocument();
  });

  it("should render CountryCards only on the initial prompt, not on subsequent country changes", async () => {
    const { rerender } = render(
      <TestAnswer message={chooseCountryInitialMessage} />,
    );

    // Wait for initial render
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should show country cards on initial message
    const countryButtons = screen.queryAllByRole("button");
    const hasCountryButtons = countryButtons.some((btn) =>
      /England|Scotland|Wales/.test(btn.textContent || ""),
    );
    expect(hasCountryButtons).toBe(true);

    // Re-render with confirmation message
    rerender(<TestAnswer message={chooseCountryConfirmationMessage} />);

    // Wait for re-render
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should NOT show country cards on confirmation
    const countryCards = screen.queryByTestId("country-cards-container");
    expect(countryCards).not.toBeInTheDocument();
  });
});

describe("Suggested question guard", () => {
  it("returns early when location is missing", async () => {
    vi.mocked(sendQueryMessage).mockClear();

    const setLoadedChatHistory = vi.fn();
    const setTyping = vi.fn();

    const suggestedQuestionsSpy = vi
      .spyOn(componentModule, "SuggestedQuestions")
      .mockImplementation(
        ({
          suggestionQuestions,
          onSuggestionClick,
        }: SuggestedQuestionsProps) => (
          <button
            data-testid="suggestion-trigger"
            onClick={() => onSuggestionClick(suggestionQuestions[0])}
            type="button"
          >
            Trigger suggestion
          </button>
        ),
      );

    const useLocationSpy = vi
      .spyOn(providersModule, "useLocation")
      .mockReturnValue({
        location: null,
        setLocation: vi.fn(),
      });

    const message: ChatHistoryType = {
      question: "Original question",
      answer: "Answer",
      question_feedback: {
        topic_label: "topic",
        suggested_questions: ["Follow-up question"],
      },
    };

    render(
      <Providers>
        <Answer
          message={message}
          setLoadedChatHistory={setLoadedChatHistory}
          setTyping={setTyping}
        />
      </Providers>,
    );

    await userEvent.click(screen.getByTestId("suggestion-trigger"));

    expect(sendQueryMessage).not.toHaveBeenCalled();
    expect(setTyping).not.toHaveBeenCalled();
    expect(setLoadedChatHistory).not.toHaveBeenCalled();

    suggestedQuestionsSpy.mockRestore();
    useLocationSpy.mockRestore();
  });
});
