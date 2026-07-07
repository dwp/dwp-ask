import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AnswerContent from "./AnswerContent";

const mockOptions = {};

describe("AnswerContent", () => {
  it("renders markdown when no structured feedback", () => {
    const message = {
      answer: "Test answer",
      question: "Test question",
      question_feedback: undefined,
    };
    render(
      <AnswerContent
        message={message}
        options={mockOptions}
        hasStructuredQuestionFeedback={false}
      />,
    );

    expect(screen.getByTestId("answer-markdown")).toBeInTheDocument();
  });

  it("renders structured feedback when present", () => {
    const message = {
      answer: "Test answer",
      question: "Test question",
      question_feedback: {
        preamble: "Test preamble",
        topic_label: "Test topic",
        suggested_questions: ["Q1", "Q2"],
      },
    };
    render(
      <AnswerContent
        message={message}
        options={mockOptions}
        hasStructuredQuestionFeedback={true}
      />,
    );

    expect(
      screen.getByTestId("question-feedback-structured"),
    ).toBeInTheDocument();
  });
});
