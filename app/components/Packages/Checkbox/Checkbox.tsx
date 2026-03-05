type CheckboxProps = {
  children: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  tabIndex?: number;
  "aria-checked"?: boolean;
  "data-testid"?: string;
  "aria-label"?: string;
};

export default function Checkbox({
  children,
  onChange,
  disabled,
  tabIndex,
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
        id="waste-2"
        name="waste"
        type="checkbox"
        value="mines"
        aria-checked={ariaChecked}
        tabIndex={tabIndex}
      />
      <label className="govuk-label govuk-checkboxes__label" htmlFor="waste-2">
        {children}
      </label>
    </div>
  );
}
