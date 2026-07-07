import { Card } from "@/components";
import type { SuggestedQuestionsProps } from "@/types";
import styles from "./SuggestedQuestions.module.css";

/**
 * Renders a grid of suggested follow-up question cards that the user
 * can click to automatically submit as their next query.
 */
export default function SuggestedQuestions({
  suggestionQuestions,
  onSuggestionClick,
  isSubmitting,
  disabled,
}: SuggestedQuestionsProps) {
  if (suggestionQuestions.length === 0) return null;

  return (
    <div
      className={styles.questionFeedbackButtons}
      data-testid="question-feedback-buttons"
    >
      {suggestionQuestions.map((question) => (
        <Card
          key={question}
          text={question}
          className={styles.suggestedQuestionCard}
          onClick={onSuggestionClick}
          dataTestId="question-feedback-button"
          disabled={isSubmitting || disabled}
        />
      ))}
    </div>
  );
}
