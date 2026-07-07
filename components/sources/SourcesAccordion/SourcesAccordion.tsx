"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Link, SanitisedMarkdown } from "@/components";
import type { SourcesAccordionProps } from "@/types";
import { formatMarkdown, formatTitle } from "@/utils";
import styles from "./SourcesAccordion.module.css";
import { createAccordionMarkdownOptions } from "./SourcesAccordionMarkdownConfig";

/**
 * Expandable accordion for a source citation. Shows the document title as a link
 * and a toggle button to reveal/hide the source extract markdown content.
 */
export default function SourcesAccordion({
  source,
  index,
  isModalOpen,
}: Readonly<SourcesAccordionProps>) {
  const accordionContentRef = useRef<HTMLDivElement>(null);
  const variableTabIndex = isModalOpen ? -1 : 0;
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

  const options = createAccordionMarkdownOptions(styles);

  return (
    <div className={styles.sources_accordion} data-testid="sources-accordion">
      <div
        className={styles.accordion_heading}
        data-testid="sources-accordion-heading"
      >
        <Link
          target="_blank"
          href={source.url}
          className={styles.accordion_title + " " + styles.accordion_left}
          data-testid="accordion-title"
          tabIndex={variableTabIndex}
          aria-hidden={variableTabIndex === -1}
        >
          {formatTitle(source.title, index)}
        </Link>
        <button
          className={styles.accordion_button + " " + styles.accordion_right}
          aria-label={`${expanded ? "Close" : "View"} source extracts`}
          tabIndex={variableTabIndex}
          aria-expanded={expanded}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          onClick={() => setExpanded(!expanded)}
          data-testid="accordion-toggle-button"
          aria-hidden={variableTabIndex === -1}
        >
          <span>{expanded ? <ChevronUp /> : <ChevronDown />}</span>
          <span data-testid="accordion-view-close">{`${expanded ? "Close" : "View"} source extracts`}</span>
        </button>
      </div>
      {expanded && (
        <div
          className={styles.accordion_content}
          role="alert"
          ref={accordionContentRef}
          aria-hidden={!expanded}
          hidden={!expanded}
          data-testid="accordion-extract-text"
          tabIndex={variableTabIndex}
        >
          <SanitisedMarkdown data-testid="accordion-markdown" options={options}>
            {formatMarkdown(source.chunks)}
          </SanitisedMarkdown>
        </div>
      )}
    </div>
  );
}
