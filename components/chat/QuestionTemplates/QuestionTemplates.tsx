"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Card, Link, Paragraph } from "@/components";
import { QUESTION_TEMPLATES } from "@/constants/QuestionTemplates";
import type { QuestionTemplatesProps } from "@/types";
import styles from "./QuestionTemplates.module.css";
import { registerQuestionTemplatesOpener } from "./questionTemplatesController";

/**
 * Expandable panel displaying pre-defined question templates
 * that users can click to populate the query text area.
 *
 * Opened externally via registerQuestionTemplatesOpener; closed
 * locally via the "Close" control, which also carries the
 * aria-expanded/aria-controls relationship to the panel.
 */
export default function QuestionTemplates({
  handleCardClick,
  isDisabled,
}: QuestionTemplatesProps) {
  const [expanded, setExpanded] = useState(false);
  const closeToggleRef = useRef<HTMLButtonElement | null>(null);
  const panelId = useId();
  const labelId = useId();

  useEffect(() => {
    return registerQuestionTemplatesOpener(() => {
      setExpanded(true);
    });
  }, []);

  useEffect(() => {
    if (expanded) {
      closeToggleRef.current?.focus();
    }
  }, [expanded]);

  return (
    <section className="w-full" data-testid="question-templates">
      {expanded && (
        <div
          className="mb-5 w-full"
          role="region"
          aria-labelledby={labelId}
          id={panelId}
        >
          <div className="w-full flex justify-between items-center mb-3">
            <Paragraph
              id={labelId}
              className="!mb-0 !font-bold !text-base"
              data-testid="question-templates-helper-text"
            >
              Select one to help you start writing your question
            </Paragraph>
            <Link
              ref={closeToggleRef}
              className="!text-base"
              data-testid="question-templates-close-toggle"
              aria-expanded={expanded}
              aria-controls={panelId}
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
