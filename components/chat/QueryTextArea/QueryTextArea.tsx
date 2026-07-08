"use client";

import { useEffect, useRef } from "react";
import {
  Button,
  InputError,
  openQuestionTemplatesPanel,
  Paragraph,
  QuestionTemplates,
} from "@/components";
import { GDS_COLOURS } from "@/constants/Colours";
import { TEXT_AREA_CONFIG } from "@/constants/QueryTextArea";
import { useModal } from "@/providers";
import type { QueryTextAreaProps } from "@/types";
import { loadHistory } from "@/utils";
import styles from "./QueryTextArea.module.css";

const {
  MIN_TEXTAREA_HEIGHT,
  MAX_TEXTAREA_HEIGHT,
  CHARACTER_LIMIT,
  disallowedCharacters,
} = TEXT_AREA_CONFIG;

/**
 * Text area input for composing policy queries. Handles character validation,
 * character count limits, PII warnings, and question template integration.
 */
export default function QueryTextArea({
  onChange,
  error,
  setError,
  value,
  isModalOpen,
  onKeyDown,
  sendQueryAndClear,
}: QueryTextAreaProps) {
  const { setModalVisible } = useModal();
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

  const isDisabled = isModalOpen;

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
      <Paragraph
        className="!font-bold !text-base"
        data-testid="pii-warning-chat-screen"
      >
        Do not include claimants&apos; personally identifiable information (PII)
        in your searches.
      </Paragraph>
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
            buttonShadowColour={GDS_COLOURS.WHITE}
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
            buttonColour={GDS_COLOURS.LIGHT_GREY}
            buttonTextColour={GDS_COLOURS.BLACK}
            onClick={() => {
              const history = loadHistory();
              if (history.length) {
                setModalVisible("newChat");
              }
            }}
          >
            New chat
          </Button>
          <Button
            className={styles.newChatButton}
            disabled={isDisabled}
            type="button"
            data-testid="chat-window-helpmeask-button"
            aria-label="Help me ask"
            buttonColour={GDS_COLOURS.LIGHT_GREY}
            buttonTextColour={GDS_COLOURS.BLACK}
            onClick={openQuestionTemplatesPanel}
          >
            Help me ask
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
