import type { ErrorFormGroupProps } from "@/types";
import styles from "./ErrorFormGroup.module.css";

/**
 * GOV.UK-styled form group wrapper that displays an error message
 * and applies error styling when validation fails.
 */
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
