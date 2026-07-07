import type { FormGroupProps } from "@/types";

export default function FormGroup({ children, error }: FormGroupProps) {
  return (
    <div
      className={`govuk-form-group ${error ? "govuk-form-group--error" : ""}`}
    >
      {children}
    </div>
  );
}
