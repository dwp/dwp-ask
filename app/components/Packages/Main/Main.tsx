type GDSMainProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  "data-testid"?: string;
};

export default function Main({
  children,
  className,
  id,
  ...props
}: GDSMainProps) {
  const dataTest = props["data-testid"];

  return (
    <div className={`govuk-width-container ${className ?? ""}`}>
      <main
        id={id || "main"}
        data-testid={dataTest}
        className="govuk-main-wrapper"
      >
        {children}
      </main>
    </div>
  );
}
