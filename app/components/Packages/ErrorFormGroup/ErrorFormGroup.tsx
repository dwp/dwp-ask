import React from "react";
import styles from "./ErrorFormGroup.module.css";

type ErrorFormGroupProps = {
  error?: boolean;
  errorMessage?: string;
  errorId?: string;
  children: React.ReactNode;
};

export default function ErrorFormGroup({
  error = false,
  errorMessage = "",
  errorId = "form-error",
  children,
}: ErrorFormGroupProps) {
  return (
    <div
      role="group"
      className={`govuk-form-group${error ? " govuk-form-group--error" : ""} ${styles.formGroup || ""}`}
    >
      {error && (
        <p id={errorId} className="govuk-error-message">
          <span className="govuk-visually-hidden">Error:</span> {errorMessage}
        </p>
      )}
      {children}
    </div>
  );
}
