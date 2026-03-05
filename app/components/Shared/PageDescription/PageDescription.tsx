"use client";

import { useRouter } from "next/navigation";
import { BackLink, H2, Paragraph, WarningText } from "@/app/components";
import { type PageDescriptionProps } from "@/app/types";
import styles from "./PageDescription.module.css";
import ErrorSummary from "../../Packages/ErrorSummary/ErrorSummary";

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

      <H2 data-testid="history-title">{title}</H2>
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
