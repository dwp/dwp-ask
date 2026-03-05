type GDSParagraphProps = {
  children: React.ReactNode | string;
  className?: string;
  tabIndex?: number;
  role?: string;
  "aria-hidden"?: boolean;
  "data-testid"?: string;
};

export default function Paragraph({
  children,
  className,
  tabIndex,
  role,
  ...props
}: Readonly<GDSParagraphProps>) {
  const ariaHidden = props["aria-hidden"];
  const dataTestId = props["data-testid"];

  return (
    <p
      tabIndex={tabIndex}
      className={`govuk-body ${className ? className : ""}`}
      aria-hidden={ariaHidden || false}
      role={role}
      data-testid={dataTestId}
    >
      {children}
    </p>
  );
}
