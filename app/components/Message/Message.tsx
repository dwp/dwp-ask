"use client";

import type { SetStateAction } from "react";
import { Paragraph, SectionBreak } from "@/app/components";
import { UserView } from "@/app/enum";
import type { ChatHistoryType } from "@/app/types";
import { trimWhitespace } from "@/app/utils";
import Answer from "../Answer/Answer";
import styles from "./Message.module.css";

type MessageProps = {
  message: ChatHistoryType;
  setLoadedChatHistory: Function;
  setTyping: Function;
  isView?: boolean | false;
  userView?: UserView;
  counter: number;
  setCounter: React.Dispatch<SetStateAction<number>>;
};

export default function Message({
  message,
  setLoadedChatHistory,
  setTyping,
  isView,
  userView = UserView.You,
  counter,
  setCounter,
}: Readonly<MessageProps>) {
  const Question = ({ question }: { question: string }) => {
    return (
      <div
        className={styles.message_question_container}
        data-testid="message-question-container"
        onCopy={trimWhitespace}
      >
        <Paragraph
          className={styles.message_label}
          data-testid="message-question-label"
        >
          {userView}
        </Paragraph>
        <div className={styles.message_question} data-testid="message-question">
          <Paragraph>{question}</Paragraph>
        </div>
      </div>
    );
  };

  return (
    <div
      className={styles.message_container}
      data-testid="message-container"
      role="article"
      aria-live="assertive"
    >
      {/* Requires conditional rendering in case of timeout so an empty query is not displayed */}
      {message?.question && <Question question={message.question} />}
      <SectionBreak level="m" visible={false} />
      {/* Requires conditional rendering so answer only appears once it has been received from the backend */}
      {message?.answer && (
        <Answer
          message={message}
          setLoadedChatHistory={setLoadedChatHistory}
          setTyping={setTyping}
          isView={isView}
          counter={counter}
          setCounter={setCounter}
        />
      )}
      <SectionBreak level="m" visible={false} />
    </div>
  );
}
