"use client";

import { useEffect, useState } from "react";
import {
  Paragraph,
  Feedback,
  FeedbackExpanded,
  SanitisedMarkdown,
  CountryCards,
  SourceLink,
  Link,
} from "@/app/components";
import { useResponsive, useSidebar, useLocation } from "@/app/providers";
import { trimWhitespace, confirmChangeLocation } from "@/app/utils";
import { ChatHistoryType } from "@/app/types";
import { createAnswerMarkdownOptions } from "./AnswerMarkdownConfig";
import { usePathname } from "next/navigation";
import styles from "./Answer.module.css";
import { emitCitations } from "@/app/(pages)/version-b/chat/emitCitations";

type AnswerProps = {
  setLoadedChatHistory: Function;
  setTyping: Function;
  message: ChatHistoryType;
  isView?: boolean;
};

type IsFeedbackHelpful = "yes" | "no" | null;

const errorText =
  "Apologies, we have had a technical issue. Please try again in a few minutes.";

export default function Answer({
  message,
  setLoadedChatHistory,
  isView,
}: Readonly<AnswerProps>) {
  const [isFeedbackHelpful, setIsFeedbackHelpful] =
    useState<IsFeedbackHelpful>(null);
  const [feedbackCompleted, setFeedbackCompleted] = useState(
    message.feedback_given || false,
  );

  const pathname = usePathname();
  const isVersionB = pathname?.includes("version-b");
  const { toggleSidebar, isSidebarVisible } = useSidebar();

  const { location, setLocation } = useLocation();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const { isSmallScreen } = useResponsive();
  const answer = message.answer;
  const isError = message.type === "error" || answer === errorText;
  const isSourceLinks = message.citations && message.citations.length > 0;
  const isFirstMessage = message.type === "chooseCountry";
  const showAIStatement = !isError && !isFirstMessage && isSourceLinks;

  const aiStatement =
    "This AI summary may contain errors. Use the Universal Learning guidance links below to check it:";

  const options = createAnswerMarkdownOptions(styles);

  const handleGuidanceLinkClick = () => {
    toggleSidebar();
    emitCitations(message.citations);
  };

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
              {aiStatement.split(". ")[0]}.{"\n"}
            </strong>
            <strong
              className={styles.ai_disclaimer}
              data-testid="ai-answer-disclaimer"
            >
              {aiStatement.split(". ")[1]}
            </strong>
          </div>
        )}

        {isVersionB && !isError && isSourceLinks && (
          <Link
            tabIndex={isSidebarVisible ? -1 : 0}
            className={styles.viewGuidanceLink}
            onClick={handleGuidanceLinkClick}
          >
            View the guidance links
          </Link>
        )}

        {!isVersionB && isSourceLinks && (
          <div
            data-testid="source-links"
            className={styles.sourceLinksContainer}
          >
            {message.citations?.map((citation, index) => (
              <SourceLink key={index} source={citation} index={index} />
            ))}
          </div>
        )}

        <SanitisedMarkdown
          data-testid="answer-markdown"
          options={options}
          className={styles.markdownContainer}
        >
          {answer}
        </SanitisedMarkdown>

        {message.type === "chooseCountry" && isMounted && !location && (
          <CountryCards
            onClickHandler={(country: string) => {
              const newItem = confirmChangeLocation(country);
              // update provider so all consumers react immediately
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
          message.id !== undefined &&
          !message.default_response && (
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
