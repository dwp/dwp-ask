import React from "react";
import styles from "./ErrorSummary.module.css";

type ErrorSummaryItem = {
  text: string;
  href?: string;
};

type ErrorSummaryProps = {
  title?: string;
  errors: ErrorSummaryItem[];
  "data-testid"?: string;
};

export default function ErrorSummary({
  title = "There is a problem",
  errors,
  "data-testid": testId = "govuk-error-summary",
}: ErrorSummaryProps) {
  if (!errors || errors.length === 0) return null;
  return (
    <div
      className={`govuk-error-summary ${styles.govukErrorSummary}`}
      data-module="govuk-error-summary"
      data-testid={testId}
    >
      <div role="alert">
        <h2 className="govuk-error-summary__title">{title}</h2>
        <div className="govuk-error-summary__body">
          <ul className="govuk-list govuk-error-summary__list">
            {errors.map((err, idx) => (
              <li key={idx}>
                {err.href ? <a href={err.href}>{err.text}</a> : err.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
