"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useResponsive, useSidebar, useModal } from "@/app/providers";
import { Message, ChatInput, ChooseCountry } from "@/app/components";
import { ChatHistoryType } from "@/app/types";
import styles from "./ChatVersionB.module.css";
import { loadHistory } from "@/app/utils";
import { emitCitations } from "./emitCitations";

export default function ChatWindowVersionB() {
  const [typing, setTyping] = useState(false);
  const [loadedChatHistory, setLoadedChatHistory] = useState<ChatHistoryType[]>(
    [],
  );

  const { isModalVisible } = useModal();
  const { isSidebarVisible } = useSidebar();
  const { isSmallScreen } = useResponsive();
  const isModalOpen = Object.values(isModalVisible).includes(true);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // on reload, load chat history from local storage
    const storedChatHistory = loadHistory();
    if (storedChatHistory) {
      setLoadedChatHistory(storedChatHistory);
    }
  }, []);

  const updateSidebar = useCallback(() => {
    emitCitations(
      loadedChatHistory[loadedChatHistory.length - 1]?.citations || undefined,
    );
  }, [loadedChatHistory]);

  // Notify other components when the loaded chat history changes
  useEffect(() => {
    updateSidebar();
  }, [updateSidebar, loadedChatHistory]);

  useEffect(() => {
    if (messageContainerRef.current && loadedChatHistory.length) {
      // Get the last message article element
      const lastMessage = messageContainerRef.current.querySelector(
        'article[data-testid="chat-message"]:last-child',
      );
      if (lastMessage) {
        // Calculate the position of the last message relative to the container
        const messageTop = (lastMessage as HTMLElement).offsetTop;
        // Scroll to position the message at the top with a 15px gap
        messageContainerRef.current.scrollTo({
          top: messageTop - 15,
          behavior: "smooth",
        });
      }
    }
  }, [loadedChatHistory]);

  return (
    <>
      <section
        className={styles.chatContainer}
        ref={messageContainerRef}
        role="feed"
        tabIndex={isSidebarVisible && isSmallScreen ? -1 : 0}
        aria-busy={typing}
      >
        {isSidebarVisible && (
          <div className={styles.sidebarOverlay} data-testid="overlay" />
        )}
        {loadedChatHistory.length === 0 && (
          <ChooseCountry
            setTyping={setTyping}
            setLoadedChatHistory={setLoadedChatHistory}
          />
        )}
        {loadedChatHistory.length > 0 && (
          <>
            {loadedChatHistory.map((message, index) => {
              return (
                <article
                  key={`${message?.question}-${index}`}
                  data-testid="chat-message"
                  aria-posinset={index + 1}
                >
                  <Message
                    message={message}
                    setLoadedChatHistory={setLoadedChatHistory}
                    setTyping={setTyping}
                  />
                </article>
              );
            })}
          </>
        )}
      </section>

      <ChatInput
        isModalOpen={isModalOpen}
        loadedChatHistory={loadedChatHistory}
        setLoadedChatHistory={setLoadedChatHistory}
        typing={typing}
        setTyping={setTyping}
      />
    </>
  );
}
