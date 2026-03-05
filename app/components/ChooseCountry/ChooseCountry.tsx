"use client";

import React, { SetStateAction, useEffect } from "react";
import Answer from "../Answer/Answer";
import type { ChatHistoryType } from "@/app/types";
import { addHistory, loadHistory } from "@/app/utils";
import { useLocation } from "@/app/providers";

const message: ChatHistoryType = {
  question: "",
  answer: "Welcome to DWP Ask. To start, select where your claimant lives:",
  type: "chooseCountry",
  default_response: false,
};

type ChooseCountryProps = {
  setLoadedChatHistory: React.Dispatch<SetStateAction<ChatHistoryType[]>>;
  setTyping: React.Dispatch<SetStateAction<boolean>>;
};

export default function ChooseCountry({
  setLoadedChatHistory,
  setTyping,
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
      />
    );
  }

  return <></>;
}
