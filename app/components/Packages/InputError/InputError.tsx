import styles from "./InputError.module.css";

type InputErrorProps = Readonly<
  | {
      type: "charcount";
      charLimit: number;
      query?: string;
      errorMessage?: string;
    }
  | {
      type: "invalidchar" | "blank" | "other" | "location";
      charLimit?: number;
      query?: string;
      errorMessage?: string;
    }
>;

export default function InputError({
  type,
  query,
  charLimit,
  errorMessage,
}: InputErrorProps) {
  const inputErrorMap: { [key: string]: string } = {
    invalidchar: "Query contains invalid characters",
    charcount: query
      ? `Your question must be ${charLimit} characters or less.
        You have ${query.length - charLimit!} characters too many.`
      : "",
    blank: "Please type a message to continue",
    location: "Please choose a location from the message in the chat",
    other:
      errorMessage ?? "An unexpected error occurred. Please try again later.",
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
