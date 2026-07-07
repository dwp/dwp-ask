import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Providers from "@/providers/Providers";
import SuggestedQuestions from "./SuggestedQuestions";

describe("SuggestedQuestions", () => {
  it("renders suggestion buttons", () => {
    const mockOnClick = vi.fn();
    const questions = ["Question 1", "Question 2"];

    render(
      <Providers>
        <SuggestedQuestions
          suggestionQuestions={questions}
          onSuggestionClick={mockOnClick}
          isSubmitting={false}
          disabled={false}
        />
      </Providers>,
    );

    expect(screen.getByTestId("question-feedback-buttons")).toBeInTheDocument();
    expect(screen.getAllByTestId("question-feedback-button")).toHaveLength(2);
  });

  it("does not render when no questions", () => {
    const mockOnClick = vi.fn();

    render(
      <Providers>
        <SuggestedQuestions
          suggestionQuestions={[]}
          onSuggestionClick={mockOnClick}
          isSubmitting={false}
          disabled={false}
        />
      </Providers>,
    );

    expect(
      screen.queryByTestId("question-feedback-buttons"),
    ).not.toBeInTheDocument();
  });
});
