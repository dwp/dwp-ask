"use client";

import React, { useRef, useEffect } from "react";
import { useModal } from "@/app/providers";
import { Button, Heading } from "@/app/components";
import styles from "./Modal.module.css";
import commonStyles from "@/app/common.module.css";

type ModalProps = {
  heading: string;
  confirm: { text: string; action: Function };
  closeText: string;
  type: "standard" | "danger";
};

export default function Modal({
  heading,
  confirm,
  closeText,
  type,
}: ModalProps) {
  const { resetModals, isModalVisible } = useModal();
  const isModalOpen = Object.values(isModalVisible).includes(true);
  const buttonColour = type === "danger" ? "#D4351C" : "#00703c";
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
        <Heading
          id="modal-heading"
          className={styles.modalHeading}
          data-testid="modal-heading"
          style={isModalOpen ? {} : { display: "none" }}
          role="alert"
        >
          {heading}
        </Heading>

        <div className={styles.modalActions}>
          <Button
            id="modal-confirm-button"
            data-testid="modal-confirm-button"
            tabIndex={0}
            onClick={() => {
              resetModals();
              confirm.action();
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
