import type { DateParts } from "@/app/types";
import styles from "./DateField.module.css";

type DateFieldProps = {
  id: string;
  title: string;
  errorText: string;
  value: DateParts;
  onChange: (e: DateParts) => void;
  "data-testid": string;
};

export default function DateField({
  id,
  title,
  errorText,
  value,
  onChange,
  ...props
}: DateFieldProps) {
  const dataTestId = props["data-testid"];
  const { day, month, year } = value;

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target;
    const field = name.split("-").pop() as keyof DateParts;
    onChange({ ...value, [field]: inputValue });
  };

  return (
    <div
      className={`govuk-form-group ${errorText ? "govuk-form-group--error" : ""}`}
      role="alert"
      data-testid={dataTestId}
    >
      <legend>
        <p className={`govuk-body ${styles.no_margin_bottom}`}>
          <strong>{title}</strong>
        </p>
      </legend>
      {errorText && (
        <p id={`${id}-error`} className="govuk-error-message">
          <span className="govuk-visually-hidden">Error:</span> {errorText}
        </p>
      )}
      <div className="govuk-date-input" id={id}>
        <div className="govuk-date-input__item">
          <div className="govuk-form-group">
            <label
              className="govuk-label govuk-date-input__label"
              htmlFor={`${id}-day`}
            >
              Day
            </label>
            <input
              className="govuk-input govuk-date-input__input govuk-input--width-2"
              id={`${id}-day`}
              name={`${id}-day`}
              type="text"
              inputMode="numeric"
              value={day}
              onChange={changeHandler}
            />
          </div>
        </div>
        <div className="govuk-date-input__item">
          <div className="govuk-form-group">
            <label
              className="govuk-label govuk-date-input__label"
              htmlFor={`${id}-month`}
            >
              Month
            </label>
            <input
              className="govuk-input govuk-date-input__input govuk-input--width-2"
              id={`${id}-month`}
              name={`${id}-month`}
              type="text"
              inputMode="numeric"
              value={month}
              onChange={changeHandler}
            />
          </div>
        </div>
        <div className="govuk-date-input__item">
          <div className="govuk-form-group">
            <label
              className="govuk-label govuk-date-input__label"
              htmlFor={`${id}-year`}
            >
              Year
            </label>
            <input
              className="govuk-input govuk-date-input__input govuk-input--width-4"
              id={`${id}-year`}
              name={`${id}-year`}
              type="text"
              inputMode="numeric"
              value={year}
              onChange={changeHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
