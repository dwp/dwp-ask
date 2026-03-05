"use client";

import { useState } from "react";
import { H4, Button } from "@/app/components";
import styles from "./Feedback.module.css";
import { sendFeedback } from "@/app/utils/api";

type FeedbackType = "yes" | "no";

type FeedbackProps = {
  setIsFeedbackHelpful: Function;
  feedbackCompleted: boolean;
  messageId: number;
};

export default function Feedback({
  setIsFeedbackHelpful,
  feedbackCompleted,
  messageId,
}: Readonly<FeedbackProps>) {
  const [feedback, setFeedback] = useState<null | FeedbackType>(null);

  const handleFeedbackClick = async (type: FeedbackType) => {
    setFeedback(type);
    if (type === "no") {
      setIsFeedbackHelpful(type);
    } else {
      const response = await sendFeedback(messageId, [], "", true);
      if (response?.id) {
        setIsFeedbackHelpful(null);
      }
    }
  };

  return (
    <div
      className={styles.feedbackContainer}
      data-testid="feedback-container"
      tabIndex={0}
    >
      {feedback || feedbackCompleted ? (
        <p
          data-testid="feedback-thank-you"
          role="alert"
          className={styles.feedbackComplete}
        >
          Thank you for your feedback
        </p>
      ) : (
        <div className={styles.feedbackInner}>
          <div>
            <H4 className={styles.feedbackContainerTitle}>
              Is this response useful?
            </H4>
          </div>

          <div className={styles.feedbackButtons}>
            <Button
              buttonColour="#1d70b8"
              buttonShadowColour="#fff"
              className={styles.feedbackButton}
              data-testid="feedback-yes"
              aria-label="Yes"
              tabIndex={0}
              onClick={() => handleFeedbackClick("yes")}
            >
              Yes
            </Button>

            <Button
              buttonColour="#1d70b8"
              buttonShadowColour="#fff"
              className={styles.feedbackButton}
              data-testid="feedback-no"
              aria-label="No"
              tabIndex={0}
              onClick={() => handleFeedbackClick("no")}
            >
              No
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
