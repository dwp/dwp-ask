import { DEFAULT_ERROR, INPUT_ERROR_MAP } from "@/constants/Errors";
import type { InputErrorProps } from "@/types";
import styles from "./InputError.module.css";

export default function InputError({
  type,
  query,
  charLimit,
  errorMessage,
}: InputErrorProps) {
  const inputErrorMap: { [key: string]: string } = {
    ...INPUT_ERROR_MAP,
    charcount: query
      ? `Your question must be ${charLimit} characters or less.
        You have ${query.length - charLimit!} characters too many.`
      : "",
    other: errorMessage ?? DEFAULT_ERROR,
  };

  return (
    <p
      data-testid="input-error"
      className={`govuk-error-message ${styles.chatError}`}
      role="alert"
    >
      <span className="govuk-visually-hidden">Error:</span>
      {inputErrorMap[type]}
    </p>
  );
}
