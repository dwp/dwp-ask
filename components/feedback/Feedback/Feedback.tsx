"use client";

import { useState } from "react";
import { Button, Title } from "@/components";
import { GDS_COLOURS } from "@/constants/Colours";
import type { FeedbackProps, FeedbackType } from "@/types";
import { sendFeedback } from "@/utils";
import styles from "./Feedback.module.css";

/**
 * Initial feedback prompt with Yes/No buttons asking if the AI response was useful.
 * Submits positive feedback immediately; negative feedback opens the expanded form.
 */
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
            <Title level="h4" className={styles.feedbackContainerTitle}>
              Is this response useful?
            </Title>
          </div>

          <div className={styles.feedbackButtons}>
            <Button
              buttonColour={GDS_COLOURS.BLUE}
              buttonShadowColour={GDS_COLOURS.WHITE}
              className={styles.feedbackButton}
              data-testid="feedback-yes"
              aria-label="Yes"
              tabIndex={0}
              onClick={() => handleFeedbackClick("yes")}
            >
              Yes
            </Button>

            <Button
              buttonColour={GDS_COLOURS.BLUE}
              buttonShadowColour={GDS_COLOURS.WHITE}
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
