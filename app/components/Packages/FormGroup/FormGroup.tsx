type FormGroupProps = {
  children: React.ReactNode;
  error?: boolean;
};

export default function FormGroup({ children, error }: FormGroupProps) {
  return (
    <div
      className={`govuk-form-group ${error ? "govuk-form-group--error" : ""}`}
    >
      {children}
    </div>
  );
}
