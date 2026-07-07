import type { RadioProps } from "@/types";

export default function Radio({
  option,
  name,
  checked,
  onChange,
  ...props
}: RadioProps) {
  const dataTest = props["data-testid"] ?? "radio-item";

  return (
    <div className="govuk-radios__item">
      <input
        data-testid={`${dataTest}-input`}
        className="govuk-radios__input"
        type="radio"
        id={`${option.value}-radios-input`}
        value={option.value as string}
        tabIndex={0}
        checked={checked}
        onChange={() => onChange(option)}
        name={name}
      />
      <label
        htmlFor={`${option.value}-radios-input`}
        className="govuk-label govuk-radios__label"
        data-testid={`${dataTest}-input-label`}
      >
        {option.label}
      </label>
    </div>
  );
}
