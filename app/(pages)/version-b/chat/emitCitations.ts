"use client";

import React from "react";
import { loadHistory } from "@/app/utils";
import type { ChatHistoryType, Citations } from "@/app/types";

const emitCitations = (citations: ChatHistoryType["citations"]) => {
  try {
    const event = new CustomEvent("citationsUpdated", {
      detail: { citations },
    });
    window.dispatchEvent(event);
  } catch (e: any) {
    console.warn("Could not dispatch citationsUpdated event", e.message);
  }
};

const handleCitations = (
  setCitationsVisible: React.Dispatch<
    React.SetStateAction<Citations | undefined>
  >,
) => {
  const initHistory = loadHistory();
  const lastChat: ChatHistoryType = initHistory[initHistory.length - 1];
  if (initHistory && initHistory.length > 0) {
    setCitationsVisible(lastChat.citations);
  }

  const sourceLinksHandler = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    const citations = detail?.citations;

    if (citations) {
      setCitationsVisible(citations);
      return;
    }
  };

  window.addEventListener("citationsUpdated", sourceLinksHandler);
  return () => {
    window.removeEventListener("citationsUpdated", sourceLinksHandler);
  };
};

export { emitCitations, handleCitations };
