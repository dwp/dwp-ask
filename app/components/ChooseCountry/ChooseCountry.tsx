"use client";

import type React from "react";
import { type SetStateAction, useEffect } from "react";
import { useLocation } from "@/app/providers";
import type { ChatHistoryType } from "@/app/types";
import { addHistory, loadHistory } from "@/app/utils";
import Answer from "../Answer/Answer";

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
