import type { GDSSelectProps } from "@/types";
import styles from "./Select.module.css";

export default function Select({
  id,
  label,
  options,
  name,
  className,
  value,
  onChange,
  autoComplete,
  disabled,
  tabIndex,
  error,
  ...props
}: GDSSelectProps) {
  const dataTest = props["data-testid"];
  const ariaLabel = props["aria-label"];

  return (
    <>
      <label className="govuk-label" htmlFor={id}>
        {label}
        <select
          data-testid={dataTest}
          className={`${className ?? ""} ${styles.select} ${error ? "govuk-select--error" : ""} `}
          name={name ?? "Select"}
          id={id}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          tabIndex={tabIndex}
          aria-label={ariaLabel ?? label}
        >
          {options.map((op, index) => (
            <option key={index} value={op}>
              {op}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
