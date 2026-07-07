"use client";

import { type SetStateAction, useEffect } from "react";
import { Answer } from "@/components";
import { useLocation } from "@/providers";
import type { ChatHistoryType } from "@/types";
import { addHistory, loadHistory } from "@/utils";

const message: ChatHistoryType = {
  question: "",
  answer: "Welcome to DWP Ask. To start, select where your claimant lives:",
  type: "chooseCountry",
};

type ChooseCountryProps = {
  setLoadedChatHistory: React.Dispatch<SetStateAction<ChatHistoryType[]>>;
  setTyping: React.Dispatch<SetStateAction<boolean>>;
  counter: number;
  setCounter: React.Dispatch<SetStateAction<number>>;
};

/**
 * Initial chat prompt that asks the user to select their claimant's country.
 * Adds the welcome message to chat history on first render.
 */
export default function ChooseCountry({
  setLoadedChatHistory,
  setTyping,
  counter,
  setCounter,
}: ChooseCountryProps) {
  const { location } = useLocation();

  useEffect(() => {
    const history = loadHistory();
    setLoadedChatHistory((prev) => {
      if (history.length === 0) {
        addHistory(message);
        return [message];
      } else {
        return prev;
      }
    });
  }, [setLoadedChatHistory]);

  if (!location) {
    return (
      <Answer
        message={message}
        setLoadedChatHistory={setLoadedChatHistory}
        setTyping={setTyping}
        counter={counter}
        setCounter={setCounter}
      />
    );
  }

  return <></>;
}
