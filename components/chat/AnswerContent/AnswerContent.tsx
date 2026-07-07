import { QuestionTemplateLink, SanitisedMarkdown } from "@/components";
import type { AnswerContentProps } from "@/types";
import styles from "./AnswerContent.module.css";

/**
 * Renders the main answer body. Displays structured question feedback preamble
 * when available, otherwise renders the full markdown answer.
 */
export default function AnswerContent({
  message,
  options,
  hasStructuredQuestionFeedback,
}: AnswerContentProps) {
  const questionFeedback = message.question_feedback;

  if (!hasStructuredQuestionFeedback) {
    return (
      <SanitisedMarkdown
        data-testid="answer-markdown"
        options={options}
        className={styles.markdownContainer}
      >
        {message.answer}
      </SanitisedMarkdown>
    );
  }

  return (
    <>
      {questionFeedback?.preamble && (
        <div
          className={styles.questionFeedbackStructured}
          data-testid="question-feedback-structured"
        >
          <QuestionTemplateLink
            options={options}
            copy={questionFeedback.preamble}
          />
        </div>
      )}
    </>
  );
}
