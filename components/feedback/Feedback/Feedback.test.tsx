import { fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/utils", () => ({
  sendQuery: vi.fn().mockResolvedValue([]),
  sendFeedback: vi.fn().mockResolvedValue({ id: 1 }),
  confirmClearChat: vi.fn(),
  clearHistory: vi.fn(),
  convertDateToParts: vi.fn().mockReturnValue({
    day: "01",
    month: "01",
    year: "01",
  }),
}));

import Feedback from "./Feedback";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
  vi.clearAllMocks();
});

const setIsFeedbackHelpful = vi.fn();
const feedbackCompleted = false;

const TestFeedback = () => {
  return (
    <Feedback
      setIsFeedbackHelpful={setIsFeedbackHelpful}
      feedbackCompleted={feedbackCompleted}
      messageId={123}
    />
  );
};

describe("Feedback renders", () => {
  it("should render in the DOM", () => {
    render(<TestFeedback />);
    const feedbackContainer = screen.getByTestId("feedback-container");
    expect(feedbackContainer).toBeInTheDocument();
  });

  it("should render thank you when feedbackCompleted is true", () => {
    render(
      <Feedback
        setIsFeedbackHelpful={setIsFeedbackHelpful}
        feedbackCompleted
        messageId={123}
      />,
    );
    const message = screen.getByTestId("feedback-thank-you");
    expect(message).toBeInTheDocument();
  });
});

describe("Event listeners for feedback run", () => {
  it("when yes is pressed", () => {
    render(<TestFeedback />);
    const yesButton = screen.getByTestId("feedback-yes");
    fireEvent.click(yesButton);
    const message = screen.getByTestId("feedback-thank-you");
    expect(message).toBeInTheDocument();
  });

  it("does not call setIsFeedbackHelpful when sendFeedback returns no id", async () => {
    const { sendFeedback } = await import("@/utils");
    vi.mocked(sendFeedback).mockResolvedValueOnce({
      id: undefined,
    } as ReturnType<typeof sendFeedback> extends Promise<infer T> ? T : never);

    render(<TestFeedback />);
    fireEvent.click(screen.getByTestId("feedback-yes"));

    await vi.waitFor(() => {
      expect(setIsFeedbackHelpful).not.toHaveBeenCalled();
    });
  });

  it("when no is pressed", () => {
    render(<TestFeedback />);
    const noButton = screen.getByTestId("feedback-no");
    fireEvent.click(noButton);
    expect(setIsFeedbackHelpful).toHaveBeenCalled();
  });
});
