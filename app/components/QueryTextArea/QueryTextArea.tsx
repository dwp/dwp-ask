"use client";

import { useRef, useEffect } from "react";
import { useResponsive, useModal, useSidebar } from "@/app/providers";
import {
  InputError,
  Button,
  QuestionTemplates,
  WarningText,
} from "@/app/components";
import { usePathname } from "next/navigation";
import { TextAreaConfig } from "@/app/constants/QueryTextArea";
import type { QueryTextAreaProps } from "@/app/types";
import { loadHistory } from "@/app/utils";
import styles from "./QueryTextArea.module.css";

const {
  MIN_TEXTAREA_HEIGHT,
  MAX_TEXTAREA_HEIGHT,
  CHARACTER_LIMIT,
  disallowedCharacters,
} = TextAreaConfig;

export default function QueryTextArea({
  onChange,
  error,
  setError,
  value,
  isModalOpen,
  onKeyDown,
  sendQueryAndClear,
}: QueryTextAreaProps) {
  const pathname = usePathname();
  const { setModalVisible } = useModal();
  const { isSidebarVisible } = useSidebar();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isError = Object.values(error).includes(true);

  useEffect(() => {
    if (value.match(disallowedCharacters)) {
      setError((state) => ({ ...state, invalidchar: true }));
    } else {
      setError((state) => ({ ...state, invalidchar: false }));
    }

    // Error handling for exceeding the character count
    setError((state) => ({
      ...state,
      charcount: value.length > CHARACTER_LIMIT,
    }));

    if (textareaRef.current) {
      textareaRef.current.style.height = `${MIN_TEXTAREA_HEIGHT}px`;
      textareaRef.current.style.height = `${Math.min(
        Math.max(textareaRef.current.scrollHeight, MIN_TEXTAREA_HEIGHT),
        MAX_TEXTAREA_HEIGHT,
      )}px`;
    }
  }, [value, setError]);

  const handleTemplateClick = (templateText: string) => {
    onChange(null, templateText);
  };

  const { isSmallScreen } = useResponsive();
  const isDisabled =
    isModalOpen ||
    (isSmallScreen && isSidebarVisible && pathname.includes("version-b"));

  return (
    <div
      data-testid="query-text-area-container"
      className={`${styles.queryTextAreaWrapper} ${isError ? "govuk-form-group--error" : ""}`}
      data-module="govuk-character-count"
      data-maxlength={CHARACTER_LIMIT}
    >
      {/* Invalid chars error */}
      {error.invalidchar && <InputError type="invalidchar" />}
      {/* Blank query error */}
      {error.blank && <InputError type="blank" />}
      {/* No location error */}
      {error.location && <InputError type="location" />}
      {/* Character count error */}
      {error.charcount && (
        <InputError
          type="charcount"
          query={value}
          charLimit={CHARACTER_LIMIT}
        />
      )}
      <WarningText>
        Do not include claimants&apos; personally identifiable information (PII)
        in your searches.
      </WarningText>
      <div className={styles.chatWindowInputButton}>
        {/* Query textarea */}
        <textarea
          aria-describedby={isDisabled ? "location-announcement" : undefined}
          aria-label="search bar"
          id="query-text-area"
          autoComplete="off"
          className={`govuk-textarea ${styles.chatTextArea} govuk-js-character-count ${isError ? "govuk-textarea--error" : ""}`}
          onChange={onChange}
          ref={textareaRef}
          style={{
            minHeight: MIN_TEXTAREA_HEIGHT,
            resize: "none",
          }}
          value={value}
          onKeyDown={onKeyDown}
          placeholder="Enter your question here…"
          data-testid="chat-window-input"
          disabled={isDisabled}
        ></textarea>
        <div className={styles.queryTextAreaButtons}>
          <Button
            className={styles.chatSend}
            data-testid="chat-window-send-button"
            disabled={isDisabled}
            aria-label="Send"
            buttonShadowColour="#fff"
            onClick={sendQueryAndClear}
          >
            Send
          </Button>
          <Button
            className={styles.newChatButton}
            disabled={isDisabled}
            type="button"
            data-testid="chat-window-new-chat-button"
            aria-label="New chat"
            buttonColour="#f3f2f1"
            buttonTextColour="#0b0c0c"
            onClick={() => {
              const history = loadHistory();
              if (history.length) {
                setModalVisible("clearChat");
              }
            }}
          >
            New chat
          </Button>
        </div>
      </div>
      <QuestionTemplates
        handleCardClick={handleTemplateClick}
        isDisabled={isDisabled}
      />
    </div>
  );
}
