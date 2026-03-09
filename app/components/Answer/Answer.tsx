"use client";

import { type SetStateAction, useEffect, useState } from "react";
import {
  Card,
  CountryCards,
  Feedback,
  FeedbackExpanded,
  Paragraph,
  SanitisedMarkdown,
  SourceLink,
} from "@/app/components";
import { useLocation, useResponsive } from "@/app/providers";
import type { ChatHistoryType } from "@/app/types";
import { confirmChangeLocation, trimWhitespace } from "@/app/utils";
import sendQueryMessage from "@/app/utils/api/sendQueryMessage";
import questionTemplateStyles from "../Packages/QuestionTemplates/QuestionTemplates.module.css";
import StructuredFeedback from "../StructuredFeedback/StructuredFeedback";
import styles from "./Answer.module.css";
import { createAnswerMarkdownOptions } from "./AnswerMarkdownConfig";

type AnswerProps = {
  setLoadedChatHistory: Function;
  setTyping: Function;
  message: ChatHistoryType;
  isView?: boolean;
  counter: number;
  setCounter: React.Dispatch<SetStateAction<number>>;
};

type IsFeedbackHelpful = "yes" | "no" | null;

const errorText =
  "Apologies, we have had a technical issue. Please try again in a few minutes.";

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

  const { location, setLocation } = useLocation();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const { isSmallScreen } = useResponsive();
  const answer = message.answer;
  const isError = message.type === "error" || answer === errorText;
  const isSourceLinks = Boolean(message.citations?.length);
  const isFirstMessage = message.type === "chooseCountry";
  const showAIStatement = !isError && !isFirstMessage && isSourceLinks;
  const showCountryCards = !location && !message.hasSetCountry && isMounted;
  const questionFeedback = message.question_feedback;
  const shouldUseQuestionFeedback =
    Boolean(questionFeedback) && !questionFeedback?.out_of_scope;

  const suggestionQuestions = shouldUseQuestionFeedback
    ? (questionFeedback?.suggested_questions ?? [])
    : [];
  const shouldShowSuggestionButtons =
    shouldUseQuestionFeedback &&
    suggestionQuestions.length > 0 &&
    !isView &&
    !isError;

  const hasStructuredQuestionFeedback =
    shouldShowSuggestionButtons &&
    (Boolean(questionFeedback?.preamble) ||
      Boolean(questionFeedback?.postscript));

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
      setCounter((prev) => prev + 1);
      setLoadedChatHistory(history);
    } catch (error) {
      console.error("Failed to submit suggested question:", error);
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

      {/* Markdown response */}
      <div className={styles.answer} data-testid="message-answer">
        {showAIStatement && (
          <div className={styles.ai_disclaimer_span}>
            <strong
              className={styles.ai_disclaimer}
              data-testid="ai-answer-disclaimer"
            >
              This AI summary may contain errors.{"\n"}
            </strong>
            <strong
              className={styles.ai_disclaimer}
              data-testid="ai-answer-disclaimer"
            >
              Use the Universal Learning guidance links below to check the
              answer. All links open in a new tab.
            </strong>
          </div>
        )}

        {isSourceLinks && (
          <div
            data-testid="source-links"
            className={styles.sourceLinksContainer}
          >
            {message.citations?.map((citation, index) => (
              <SourceLink key={index} source={citation} index={index} />
            ))}
          </div>
        )}

        {!hasStructuredQuestionFeedback && (
          <SanitisedMarkdown
            data-testid="answer-markdown"
            options={options}
            className={styles.markdownContainer}
          >
            {answer}
          </SanitisedMarkdown>
        )}

        {hasStructuredQuestionFeedback && questionFeedback?.preamble && (
          <div
            className={styles.questionFeedbackStructured}
            data-testid="question-feedback-structured"
          >
            <StructuredFeedback
              options={options}
              copy={questionFeedback?.preamble}
            />
          </div>
        )}

        {shouldShowSuggestionButtons && (
          <div
            className={styles.questionFeedbackButtons}
            data-testid="question-feedback-buttons"
          >
            {suggestionQuestions.map((question) => (
              <Card
                key={question}
                text={question}
                onClick={handleSuggestedQuestionClick}
                className={questionTemplateStyles.templateCard}
                dataTestId="question-feedback-button"
                disabled={isSubmittingSuggestion || !location}
              />
            ))}
          </div>
        )}

        {hasStructuredQuestionFeedback && questionFeedback?.postscript && (
          <div
            className={styles.questionFeedbackPostscript}
            data-testid="question-feedback-postscript"
          >
            <StructuredFeedback
              options={options}
              copy={questionFeedback?.postscript}
            />
          </div>
        )}

        {showCountryCards && (
          <CountryCards
            onClickHandler={(country: string) => {
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

        {!isError &&
          !isFeedbackHelpful &&
          !isView &&
          message.id !== undefined && (
            <Feedback
              feedbackCompleted={feedbackCompleted}
              setIsFeedbackHelpful={setIsFeedbackHelpful}
              messageId={message.id}
            />
          )}
        {!isError &&
          isFeedbackHelpful === "no" &&
          !feedbackCompleted &&
          message.id !== undefined &&
          !isView && (
            <FeedbackExpanded
              setFeedbackCompleted={setFeedbackCompleted}
              setIsFeedbackHelpful={setIsFeedbackHelpful}
              messageId={message.id}
            />
          )}
      </div>
    </article>
  );
}
 