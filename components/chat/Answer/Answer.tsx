"use client";

import { type SetStateAction, useEffect, useState } from "react";
import {
  AIDisclaimer,
  AnswerContent,
  CountryCards,
  FeedbackSection,
  Paragraph,
  QuestionTemplateLink,
  SourceLink,
  SuggestedQuestions,
} from "@/components";
import { createAnswerMarkdownOptions } from "@/constants/AnswerMarkdownConfig";
import { GENERIC_ERROR } from "@/constants/Errors";
import { useLocation, useResponsive } from "@/providers";
import type { ChatHistoryType, IsFeedbackHelpful, LocationType } from "@/types";
import {
  confirmChangeLocation,
  sendQueryMessage,
  trimWhitespace,
} from "@/utils";
import styles from "./Answer.module.css";

type AnswerProps = {
  setLoadedChatHistory: Function;
  setTyping: Function;
  message: ChatHistoryType;
  isView?: boolean;
  counter: number;
  setCounter: React.Dispatch<SetStateAction<number>>;
};

/**
 * Renders an AI answer message including source citations, feedback controls,
 * suggested follow-up questions, and country selection cards.
 */
export default function Answer({
  message,
  setLoadedChatHistory,
  setTyping,
  isView,
  counter,
  setCounter,
}: Readonly<AnswerProps>) {
  const [isFeedbackHelpful, setIsFeedbackHelpful] =
    useState<IsFeedbackHelpful>(null);
  const [feedbackCompleted, setFeedbackCompleted] = useState(
    message.feedback_given || false,
  );
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { location, setLocation } = useLocation();
  const { isSmallScreen } = useResponsive();

  useEffect(() => setIsMounted(true), []);

  const isError = message.type === "error" || message.answer === GENERIC_ERROR;
  const hasSourceLinks = Boolean(message.citations?.length);
  const isFirstMessage = message.type === "chooseCountry";
  const showAIStatement = !isError && !isFirstMessage && hasSourceLinks;
  const showCountryCards = !location && !message.hasSetCountry && isMounted;

  const questionFeedback = message.question_feedback;
  const hasValidFeedback = questionFeedback && !questionFeedback.out_of_scope;
  const suggestionQuestions = hasValidFeedback
    ? (questionFeedback.suggested_questions ?? [])
    : [];
  const canShowSuggestions =
    hasValidFeedback && suggestionQuestions.length > 0 && !isView && !isError;
  const hasStructuredFeedback = Boolean(
    canShowSuggestions &&
      (questionFeedback?.preamble || questionFeedback?.postscript),
  );

  const handleSuggestedQuestionClick = async (suggestedQuestion: string) => {
    if (!location || isSubmittingSuggestion) {
      return;
    }

    setIsSubmittingSuggestion(true);
    setTyping(true);
    setLoadedChatHistory((state: ChatHistoryType[]) => [
      ...state,
      { question: suggestedQuestion },
    ]);

    try {
      const history = await sendQueryMessage(
        suggestedQuestion,
        location,
        counter,
      );
      setLoadedChatHistory(history);
    } catch (error: unknown) {
      console.error("Error submitting suggested question:", error);
    } finally {
      setTyping(false);
      setIsSubmittingSuggestion(false);
    }
  };

  const options = createAnswerMarkdownOptions(styles);

  return (
    <article
      data-testid="message-answer-container"
      onCopy={trimWhitespace}
      tabIndex={isSmallScreen ? -1 : 0}
    >
      <Paragraph
        className={styles.message_label}
        data-testid="message-answer-label"
      >
        DWP Ask
      </Paragraph>

      <div className={styles.answer} data-testid="message-answer">
        <AIDisclaimer showAIStatement={showAIStatement} />

        {hasSourceLinks && (
          <div
            data-testid="source-links"
            className={styles.sourceLinksContainer}
          >
            {message.citations?.map((citation, index) => (
              <SourceLink key={index} source={citation} index={index} />
            ))}
          </div>
        )}

        <AnswerContent
          message={message}
          options={options}
          hasStructuredQuestionFeedback={hasStructuredFeedback}
        />

        {canShowSuggestions && (
          <SuggestedQuestions
            suggestionQuestions={suggestionQuestions}
            onSuggestionClick={handleSuggestedQuestionClick}
            isSubmitting={isSubmittingSuggestion}
            disabled={!location}
          />
        )}

        {hasStructuredFeedback && questionFeedback?.postscript && (
          <div
            className={styles.questionFeedbackPostscript}
            data-testid="question-feedback-postscript"
          >
            <QuestionTemplateLink
              options={options}
              copy={questionFeedback.postscript}
            />
          </div>
        )}

        {showCountryCards && (
          <CountryCards
            onClickHandler={(country: LocationType) => {
              const newItem = confirmChangeLocation(country);
              setLocation(country);
              if (newItem) {
                setLoadedChatHistory((prev: ChatHistoryType[]) => [
                  ...prev,
                  newItem,
                ]);
              }
            }}
          />
        )}

        <FeedbackSection
          message={message}
          isError={isError}
          isView={isView}
          isFeedbackHelpful={isFeedbackHelpful}
          feedbackCompleted={feedbackCompleted}
          setIsFeedbackHelpful={setIsFeedbackHelpful}
          setFeedbackCompleted={setFeedbackCompleted}
        />
      </div>
    </article>
  );
}
