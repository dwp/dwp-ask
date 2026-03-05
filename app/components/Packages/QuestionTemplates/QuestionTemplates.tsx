"use client";

import { useEffect, useState, useRef } from "react";
import { Card, Link, ChevronUp, ChevronDown } from "@/app/components";
import { templates } from "./templates";
import styles from "./QuestionTemplates.module.css";

type QuestionTemplatesProps = {
  handleCardClick: (text: string) => void;
  isDisabled: boolean;
};

export default function QuestionTemplates({
  handleCardClick,
  isDisabled,
}: QuestionTemplatesProps) {
  const accordionContentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setFocused(focused);
  }, [focused]);

  useEffect(() => {
    if (accordionContentRef.current) {
      accordionContentRef.current.focus();
    }
  }, [expanded]);

  return (
    <div className={styles.question_templates} data-testid="question-templates">
      <Link
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
              {templates.map((q, index) => (
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
