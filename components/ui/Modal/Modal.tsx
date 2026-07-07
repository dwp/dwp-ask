"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import commonStyles from "@/app/common.module.css";
import { Button, Title } from "@/components";
import { GDS_COLOURS } from "@/constants/Colours";
import { useModal } from "@/providers";
import type { ModalProps } from "@/types";
import styles from "./Modal.module.css";

export default function Modal({
  heading,
  confirm,
  closeText,
  type,
}: ModalProps) {
  const { resetModals, isModalVisible } = useModal();
  const isModalOpen = Object.values(isModalVisible).includes(true);
  const buttonColour = type === "danger" ? GDS_COLOURS.RED : GDS_COLOURS.GREEN;
  const modalRef = useRef(null);

  const firstFocusableElement = useRef<HTMLElement | null>(null);
  const lastFocusableElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      const modalElement = modalRef.current as HTMLDivElement;
      const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabIndex]:not([tabIndex="-1"])',
      );

      if (focusableElements.length > 0) {
        firstFocusableElement.current = focusableElements[0] as HTMLElement;
        lastFocusableElement.current = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;
        firstFocusableElement.current.focus();
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          if (event.shiftKey) {
            if (document.activeElement === firstFocusableElement.current) {
              lastFocusableElement.current?.focus();
              event.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement.current) {
              firstFocusableElement.current?.focus();
              event.preventDefault();
            }
          }
        } else if (event.key === "Escape") {
          resetModals();
        }
      };
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isModalOpen, resetModals]);

  useEffect(() => {
    document.getElementById("modal")!.focus();
    document.getElementById("modal-close-text")!.focus();
  }, [isModalOpen]);

  const handleEscKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isModalOpen && e.key === "Escape") {
      resetModals();
    }
  };

  return (
    <div
      id="modal"
      className={styles.modal}
      role="alert"
      aria-labelledby="modal-heading"
      data-testid="modal-container"
      ref={modalRef}
      onKeyDown={handleEscKey}
    >
      <div className={styles.modalContent} data-testid="modal-content">
        <Title
          id="modal-heading"
          level="h1"
          className={styles.modalHeading}
          data-testid="modal-heading"
          style={isModalOpen ? {} : { display: "none" }}
          role="alert"
        >
          {heading}
        </Title>

        <div className={styles.modalActions}>
          <Button
            id="modal-confirm-button"
            data-testid="modal-confirm-button"
            tabIndex={0}
            onClick={() => {
              resetModals();
              if (confirm.action) {
                confirm.action();
              }
            }}
            aria-label={confirm.text}
            buttonColour={buttonColour}
            className={styles.modalCloseButton}
          >
            {confirm.text}
          </Button>

          <button
            id="modal-close-text"
            tabIndex={0}
            data-testid="modal-close-text"
            aria-label={closeText}
            className={`govuk-link ${commonStyles.resetButton} ${styles.modalCloseText} ${commonStyles.underline}`}
            onClick={resetModals}
          >
            {closeText}
          </button>
        </div>
      </div>
    </div>
  );
}
