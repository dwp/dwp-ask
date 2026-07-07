"use client";

import type React from "react";
import { useState } from "react";
import {
  Button,
  Checkbox,
  FormGroup,
  InputError,
  LoadingBox,
  Title,
} from "@/components";
import { FEEDBACK_OPTIONS } from "@/constants/FeedbackExpanded";
import { CHARACTER_LIMIT } from "@/constants/Layout";
import type { FeedbackExpandedProps } from "@/types";
import { sendFeedback } from "@/utils";
import styles from "./FeedbackExpanded.module.css";

/**
 * Expanded negative feedback form with checkboxes for common issues
 * and a free-text area for additional detail. Submits to the feedback API.
 */
export default function FeedbackExpanded({
  setFeedbackCompleted,
  setIsFeedbackHelpful,
  messageId,
}: Readonly<FeedbackExpandedProps>) {
  const [checkboxesSelected, setCheckboxesSelected] = useState<string[]>([]);
  const [feedbackDetail, setFeedbackDetail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isOverLimit = feedbackDetail.length > CHARACTER_LIMIT;

  const handleCheckboxChange = (
    target: EventTarget & HTMLInputElement,
    op: string,
  ) => {
    setErrorMessage("");
    if (target.checked && !checkboxesSelected.includes(op)) {
      setCheckboxesSelected([...checkboxesSelected, op]);
    } else if (!target.checked && checkboxesSelected.includes(op)) {
      setCheckboxesSelected(checkboxesSelected.filter((cs) => cs !== op));
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackDetail(e.target.value);
    setErrorMessage("");
  };

  const onSubmit = async () => {
    if (checkboxesSelected.length === 0 && feedbackDetail === "") {
      setErrorMessage("Provide feedback in order to submit");
      return;
    }
    if (isOverLimit) {
      // The error message will be displayed if this condition is true
      return;
    }
    setLoading(true);
    setErrorMessage("");
    const response = await sendFeedback(
      messageId,
      checkboxesSelected,
      feedbackDetail,
      false,
    );
    if (response?.id) {
      setFeedbackCompleted(true);
      setIsFeedbackHelpful(null);
    } else {
      setErrorMessage("We can't save your feedback, please try again later");
    }
    setLoading(false);
  };

  return (
    <div
      className={styles.feedbackExpandedContainer}
      data-testid="feedback-expanded-container"
    >
      <LoadingBox loading={loading}>
        <FormGroup error={errorMessage != "" || isOverLimit}>
          <Title level="h4" data-testid="feedback-expanded-title" role="alert">
            Tell us why this response is not useful
          </Title>
          {errorMessage !== "" && (
            <InputError errorMessage={errorMessage} type="other" />
          )}
          {FEEDBACK_OPTIONS.map((op) => (
            <Checkbox
              id={op.replace(" ", "-")}
              value={op}
              data-testid={`checkbox-${op}`}
              aria-checked={checkboxesSelected.includes(op)}
              onChange={({ target }) => handleCheckboxChange(target, op)}
              key={op}
            >
              {op}
            </Checkbox>
          ))}
          <div className={styles.feedbackExpanded__textarea_container}>
            <label
              data-testid="feedback-detail-label"
              className={styles.feedbackExpanded__textarea_label}
              htmlFor="feedback-detail"
            >
              Provide more detail
            </label>
            {isOverLimit && (
              <InputError
                type="charcount"
                query={feedbackDetail}
                charLimit={CHARACTER_LIMIT}
              />
            )}
            <textarea
              rows={5}
              id="feedback-detail"
              data-testid="feedback-detail-textarea"
              onChange={handleTextAreaChange}
              className={styles.feedbackExpanded__textarea}
            />
          </div>
          <Button data-testid="feedback-expanded-submit" onClick={onSubmit}>
            Submit
          </Button>
        </FormGroup>
      </LoadingBox>
    </div>
  );
}
