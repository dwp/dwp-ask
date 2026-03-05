"use client";

import React, { useState } from "react";
import {
  Checkbox,
  H4,
  Button,
  InputError,
  LoadingBox,
  FormGroup,
} from "@/app/components";
import { options } from "@/app/constants/FeedbackExpanded";
import { sendFeedback } from "@/app/utils/api";
import styles from "./FeedbackExpanded.module.css";

type FeedbackExpandedProps = {
  messageId: number;
  setFeedbackCompleted: Function;
  setIsFeedbackHelpful: Function;
};

const CHARACTER_LIMIT = 1000;

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
          <H4 data-testid="feedback-expanded-title" role="alert">
            Tell us why this response is not useful
          </H4>
          {errorMessage !== "" && (
            <InputError errorMessage={errorMessage} type="other" />
          )}
          {options.map((op) => (
            <Checkbox
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
