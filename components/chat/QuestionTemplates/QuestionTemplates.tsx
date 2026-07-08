"use client";

import { useEffect, useRef, useState } from "react";
import { Card, Link, Paragraph } from "@/components";
import { QUESTION_TEMPLATES } from "@/constants/QuestionTemplates";
import type { QuestionTemplatesProps } from "@/types";
import styles from "./QuestionTemplates.module.css";
import { registerQuestionTemplatesOpener } from "./questionTemplatesController";

/**
 * Expandable accordion panel displaying pre-defined question templates
 * that users can click to populate the query text area.
 */
export default function QuestionTemplates({
  handleCardClick,
  isDisabled,
}: QuestionTemplatesProps) {
  const accordionContentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [focused, setFocused] = useState(false);
  const toggleRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);

  useEffect(() => {
    setFocused(focused);
  }, [focused]);

  useEffect(() => {
    if (accordionContentRef.current) {
      accordionContentRef.current.focus();
    }
  }, [expanded]);

  useEffect(() => {
    return registerQuestionTemplatesOpener(() => {
      setExpanded(true);
      toggleRef.current?.focus();
    });
  }, []);

  return (
    <section
      className="w-full"
      ref={toggleRef}
      data-testid="question-templates"
    >
      {expanded && (
        <div
          className="mb-5 w-full"
          role="alert"
          ref={accordionContentRef}
          aria-hidden={!expanded}
        >
          <div className="w-full flex justify-between items-center mb-3">
            <Paragraph
              className="!mb-0 !font-bold !text-base"
              data-testid="question-templates-helper-text"
              aria-expanded={expanded}
            >
              Select one to help you start writing your question
            </Paragraph>
            <Link
              className="!text-base"
              data-testid="question-templates-close-toggle"
              onClick={() => setExpanded(false)}
            >
              Close
            </Link>
          </div>
          <div className="m-0 mx-auto">
            <div
              className={styles.templateGrid}
              data-testid="question-templates-grid"
            >
              {QUESTION_TEMPLATES.map((q, index) => (
                <Card
                  text={q}
                  key={index}
                  className={styles.templateCard}
                  onClick={(text) => {
                    handleCardClick(text);
                    setExpanded(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
