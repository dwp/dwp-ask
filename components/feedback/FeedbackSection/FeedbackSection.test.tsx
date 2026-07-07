import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FeedbackSection from "./FeedbackSection";

vi.mock("@/components", () => ({
  Feedback: ({ messageId }: { messageId: number }) => (
    <div data-testid="feedback">{messageId}</div>
  ),
  FeedbackExpanded: ({ messageId }: { messageId: number }) => (
    <div data-testid="feedback-expanded">{messageId}</div>
  ),
}));

describe("FeedbackSection", () => {
  const mockSetIsFeedbackHelpful = vi.fn();
  const mockSetFeedbackCompleted = vi.fn();

  it("renders initial feedback when not helpful", () => {
    const message = { id: 1, question: "Test question", answer: "Test" };

    render(
      <FeedbackSection
        message={message}
        isError={false}
        isView={false}
        isFeedbackHelpful={null}
        feedbackCompleted={false}
        setIsFeedbackHelpful={mockSetIsFeedbackHelpful}
        setFeedbackCompleted={mockSetFeedbackCompleted}
      />,
    );

    expect(screen.getByTestId("feedback")).toBeInTheDocument();
  });

  it("renders expanded feedback when marked as not helpful", () => {
    const message = { id: 1, question: "Test question", answer: "Test" };

    render(
      <FeedbackSection
        message={message}
        isError={false}
        isView={false}
        isFeedbackHelpful="no"
        feedbackCompleted={false}
        setIsFeedbackHelpful={mockSetIsFeedbackHelpful}
        setFeedbackCompleted={mockSetFeedbackCompleted}
      />,
    );

    expect(screen.getByTestId("feedback-expanded")).toBeInTheDocument();
  });

  it("does not render when isError is true", () => {
    const message = { id: 1, question: "Test question", answer: "Test" };

    render(
      <FeedbackSection
        message={message}
        isError={true}
        isView={false}
        isFeedbackHelpful={null}
        feedbackCompleted={false}
        setIsFeedbackHelpful={mockSetIsFeedbackHelpful}
        setFeedbackCompleted={mockSetFeedbackCompleted}
      />,
    );

    expect(screen.queryByTestId("feedback")).not.toBeInTheDocument();
  });
});
