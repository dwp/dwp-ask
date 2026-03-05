import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@/app/utils/api", () => ({
  sendQuery: jest.fn().mockResolvedValue([]),
  sendFeedback: jest.fn().mockResolvedValue({ id: 1 }),
}));

import Feedback from "./Feedback";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
  jest.clearAllMocks();
});

const setIsFeedbackHelpful = jest.fn();
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

  it("shoudl render thank you when feedbackCompleted is true", () => {
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

  it("when no is pressed", () => {
    render(<TestFeedback />);
    const noButton = screen.getByTestId("feedback-no");
    fireEvent.click(noButton);
    expect(setIsFeedbackHelpful).toHaveBeenCalled();
  });
});
