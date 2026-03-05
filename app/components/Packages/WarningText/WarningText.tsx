type GDSWarningTextProps = {
  children: React.ReactNode;
  bottomMargin?: boolean;
  "data-testid"?: string;
};

export default function WarningText({
  children,
  bottomMargin,
  ...props
}: GDSWarningTextProps) {
  const dataTest = props["data-testid"];

  return (
    <div
      data-testid={dataTest}
      className="govuk-warning-text"
      style={{ marginBottom: bottomMargin ? "" : "0" }}
    >
      <span className="govuk-warning-text__icon" aria-hidden="true">
        !
      </span>
      <strong className="govuk-warning-text__text">
        <span className="govuk-visually-hidden">Warning</span>
        {children}
      </strong>
    </div>
  );
}
