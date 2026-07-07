import { Feedback, FeedbackExpanded } from "@/components";
import type { FeedbackSectionProps } from "@/types";

/**
 * Orchestrates the feedback flow for a message: shows the initial Yes/No prompt,
 * then the expanded form if "No" is selected. Hidden for errors and view-only mode.
 */
export default function FeedbackSection({
  message,
  isError,
  isView,
  isFeedbackHelpful,
  feedbackCompleted,
  setIsFeedbackHelpful,
  setFeedbackCompleted,
}: FeedbackSectionProps) {
  if (isError || isView || message.id === undefined) return null;

  const showInitialFeedback = !isFeedbackHelpful;
  const showExpandedFeedback = isFeedbackHelpful === "no" && !feedbackCompleted;

  return (
    <>
      {showInitialFeedback && (
        <Feedback
          feedbackCompleted={feedbackCompleted}
          setIsFeedbackHelpful={setIsFeedbackHelpful}
          messageId={message.id}
        />
      )}
      {showExpandedFeedback && (
        <FeedbackExpanded
          setFeedbackCompleted={setFeedbackCompleted}
          setIsFeedbackHelpful={setIsFeedbackHelpful}
          messageId={message.id}
        />
      )}
    </>
  );
}
