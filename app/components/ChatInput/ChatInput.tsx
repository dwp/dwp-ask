"use client";

import React, {
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { QueryTextArea, Typing } from "@/app/components";
import { useLocation } from "@/app/providers";
import { ChatHistoryType, ErrorStateType } from "@/app/types";
import sendQueryMessage from "@/app/utils/api/sendQueryMessage";
import styles from "./ChatInput.module.css";

const initialErrorState = {
  invalidchar: false,
  blank: false,
  charcount: false,
  location: false,
};

export default function ChatInput({
  loadedChatHistory,
  setLoadedChatHistory,
  typing,
  setTyping,
  isModalOpen,
  counter,
  setCounter,
}: {
  loadedChatHistory: ChatHistoryType[];
  setLoadedChatHistory: Function;
  typing: boolean;
  setTyping: Function;
  isModalOpen: boolean;
  counter: number;
  setCounter: React.Dispatch<SetStateAction<number>>;
}) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<ErrorStateType>(initialErrorState);
  const { location } = useLocation();
  const [localLocation, setLocalLocation] = useState("");

  const isError = Object.values(error).includes(true);
  const onChange = (
    event?: React.ChangeEvent<HTMLTextAreaElement> | null,
    plainText?: string | null,
  ) => {
    setQuery(
      plainText
        ? plainText.replaceAll("[text here]", "")
        : event
          ? event.target.value
          : "",
    );
    setError((state) => ({ ...state, blank: false }));
  };

  useEffect(() => {
    if (location) {
      setError((state) => ({ ...state, location: false }));
    }
  }, [loadedChatHistory, location]);

  useEffect(() => {
    setLocalLocation(location || "");
  }, [location]);

  const sendQueryAndClear = useCallback(() => {
    if (!location) {
      setError((state) => ({ ...state, location: true }));
      return;
    }
    if (query.length === 0) {
      setError((state) => ({ ...state, blank: true }));
    }
    if (isError || isModalOpen || query === "") {
      return;
    }
    if (typing) {
      return;
    } else {
      setTyping(true);
      setLoadedChatHistory((state: ChatHistoryType[]) => [
        ...state,
        { question: query },
      ]);
      sendQueryMessage(query, localLocation, counter).then((history) => {
        setLoadedChatHistory(history);
        setTyping(false);
      });
      setQuery("");
      setCounter((prevCounter) => prevCounter + 1);
    }
  }, [
    query,
    isModalOpen,
    setTyping,
    isError,
    location,
    counter,
    setLoadedChatHistory,
    localLocation,
    typing,
  ]);

  const submitQueryEnter = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && event.shiftKey == false) {
      event.preventDefault();
      sendQueryAndClear();
    }
  };

  return (
    <>
      {typing && <Typing />}
      <div className={styles.chatInputContainer}>
        <div className={styles.chatInput} data-testid="chat-input-text-area">
          <QueryTextArea
            error={error}
            setError={setError}
            value={query}
            isModalOpen={isModalOpen}
            onChange={onChange}
            onKeyDown={submitQueryEnter}
            sendQueryAndClear={sendQueryAndClear}
          />
        </div>
      </div>
    </>
  );
}
