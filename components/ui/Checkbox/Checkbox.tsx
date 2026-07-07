import type { CheckboxProps } from "@/types";

export default function Checkbox({
  id,
  value,
  children,
  onChange,
  disabled,
  tabIndex,
  checked,
  ...props
}: Readonly<CheckboxProps>) {
  const dataTest = props["data-testid"];
  const ariaChecked = props["aria-checked"];

  return (
    <div className="govuk-checkboxes__item">
      <input
        disabled={disabled}
        onChange={onChange}
        data-testid={dataTest}
        className="govuk-checkboxes__input"
        id={id}
        name={value}
        checked={checked}
        type="checkbox"
        value={value}
        aria-checked={ariaChecked}
        tabIndex={tabIndex}
      />
      <label className="govuk-label govuk-checkboxes__label" htmlFor={id}>
        {children}
      </label>
    </div>
  );
}
