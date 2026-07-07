"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Analytics,
  BackLink,
  Button,
  InsetText,
  Main,
  Message,
  Title,
  WarningText,
} from "@/components";
import { GDS_COLOURS } from "@/constants/Colours";
import { SCROLL_OFFSET } from "@/constants/Layout";
import { useModal } from "@/providers";
import type { ChatViewType } from "@/types";
import { getPdfDownload, getViewDetails, isEmptyObject } from "@/utils";
import styles from "./ChatView.module.css";

export default function Chat() {
  const { isModalVisible } = useModal();
  const isModalOpen = Object.values(isModalVisible).includes(true);
  const variableTabIndex = isModalOpen ? -1 : 0;
  const [loadedChatView, setLoadedChatView] = useState<ChatViewType[]>([]);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [downloadError, setDownloadError] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const combine_previous_chat = (items: ChatViewType): ChatViewType[] => {
    const results: ChatViewType[] = [];
    results.push(items);
    if (!isEmptyObject(items.previous_chat_history)) {
      results.push(items.previous_chat_history);
    }
    return results;
  };
  const handleDownload = async () => {
    try {
      setDownloadError(false);
      const chatHistory = getViewDetails();
      const data_to_download = combine_previous_chat(chatHistory.items);
      const blob = await getPdfDownload("", "", 0, data_to_download);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `export-chat-${date}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      setDownloadError(true);
    }
  };

  useEffect(() => {
    const chatHistory = getViewDetails();
    if (chatHistory) {
      setDate(chatHistory.parsedDate[0]);
      setTime(chatHistory.parsedDate[1]);
      setLoadedChatView(combine_previous_chat(chatHistory.items));
    } else {
      router.push("/chat");
    }
  }, [router]);

  useEffect(() => {
    if (messageContainerRef.current && loadedChatView.length) {
      messageContainerRef.current.scrollBy({
        top: SCROLL_OFFSET,
        behavior: "smooth",
      });
    }
  }, [loadedChatView]);

  const dateLabel = `Details of chat from ${date}`;
  const timeLabel = `Question asked at ${time}`;
  const previousQuestionLabel = "Previous question asked";
  return (
    <Main className={styles.chatWrapper}>
      <Analytics />

      <BackLink
        data-testid="chat-details-back-link"
        aria-label="Home"
        tabIndex={0}
        onClick={() => router.push("/chat/history")}
      >
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>
          Back
        </span>
      </BackLink>
      <Title
        level="h3"
        className={styles.chatLabel}
        data-testid="chat-details-date"
      >
        {dateLabel}
      </Title>

      <WarningText>
        <span data-testid="chat-details-warning-text">
          <strong>
            Only use the chat archive for complaints procedures. Do not use old
            chats for advice.
          </strong>
        </span>
      </WarningText>

      {loadedChatView.map((chat, item) => {
        const loadedChat = [chat];
        return (
          <section key={item} id="main" tabIndex={-1}>
            <Title level="h4" className={styles.chatLabelSecondary}>
              {item == 0 ? timeLabel : previousQuestionLabel}
            </Title>
            <div className={styles.chatWindow}>
              <InsetText
                className={styles.chatWindowClearedText}
                data-testid="chat-details-disclaimer"
              >
                This response may be out of date. We may have replaced personal
                identifiable information (PII) that you entered, for data
                protection reasons.
              </InsetText>

              <section
                className={styles.chatContainer}
                ref={messageContainerRef}
                role="feed"
                tabIndex={0}
                data-testid="chat-details-section-container"
              >
                {/* Required as the parent div has an aria-role of feed so must have at least one article child at all times */}
                {!loadedChat.length && <article></article>}
                {loadedChat.length > 0 && (
                  <>
                    {loadedChat.map((message, index) => (
                      <article
                        key={message.question}
                        data-testid="chat-details-message"
                        tabIndex={variableTabIndex}
                        aria-posinset={index + 1}
                      >
                        <Message
                          message={message}
                          setLoadedChatHistory={() => {
                            return {};
                          }}
                          setTyping={() => {
                            return {};
                          }}
                          isView={true}
                        />
                      </article>
                    ))}
                  </>
                )}
              </section>
            </div>
          </section>
        );
      })}
      <div>
        {downloadError && (
          <p
            className="govuk-error-message"
            data-testid="chat-download-error"
            role="alert"
          >
            There was a problem downloading the PDF. Please try again.
          </p>
        )}
        <Button
          className={styles.chatSend}
          data-testid="chat-history-download-button"
          disabled={false}
          aria-label="Send"
          buttonColour={GDS_COLOURS.BLUE}
          onClick={handleDownload}
        >
          Download as PDF
        </Button>
      </div>
    </Main>
  );
}
