"use client";

import { useRouter } from "next/navigation";
import {
  BackLink,
  ErrorSummary,
  Paragraph,
  Title,
  WarningText,
} from "@/components";
import type { PageDescriptionProps } from "@/types";
import styles from "./PageDescription.module.css";

/**
 * Reusable page header section with back link, title, optional warning text,
 * description paragraph, and optional error summary.
 */
export default function PageDescription({
  backLink,
  title,
  warningText,
  description,
  errorSummary,
}: PageDescriptionProps) {
  const router = useRouter();

  return (
    <>
      <BackLink
        data-testid="history-back-link"
        aria-label="Back"
        tabIndex={0}
        onClick={() => router.push(backLink)}
      >
        <span className={styles.chatBacklink}>Back</span>
      </BackLink>

      {errorSummary && <ErrorSummary errors={errorSummary} />}

      <Title level="h2" data-testid="history-title">
        {title}
      </Title>
      {warningText && (
        <WarningText>
          <span data-testid="history-warning-text">
            <strong>{warningText}</strong>
          </span>
        </WarningText>
      )}
      <Paragraph
        className={styles.chatFilterMessage}
        data-testid="history-paragraph"
      >
        {description}
      </Paragraph>
    </>
  );
}
