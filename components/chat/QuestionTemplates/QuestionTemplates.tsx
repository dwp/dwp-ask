"use client";

import { useEffect, useRef, useState } from "react";
import { Card, ChevronDown, ChevronUp, Link } from "@/components";
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
    <div className={styles.question_templates} data-testid="question-templates">
      <Link
        ref={toggleRef}
        tabIndex={isDisabled ? -1 : 0}
        data-testid="question-templates-toggle"
        aria-expanded={expanded}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onClick={() => setExpanded(!expanded)}
      >
        <span>{expanded ? <ChevronUp /> : <ChevronDown />}</span>
        Question templates
      </Link>
      {expanded && (
        <div
          className={styles.templateContainer}
          role="alert"
          ref={accordionContentRef}
          aria-hidden={!expanded}
        >
          <div className={styles.templateContent}>
            <div
              className={styles.templateGrid}
              data-testid="question-templates-grid"
            >
              {QUESTION_TEMPLATES.map((q, index) => (
                <Card
                  text={q}
                  key={index}
                  onClick={handleCardClick}
                  className={styles.templateCard}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
