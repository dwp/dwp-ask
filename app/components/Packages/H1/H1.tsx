type H1Props = {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
};

export default function H1({ children, className, ...props }: H1Props) {
  const dataTest = props["data-testid"];

  return (
    <h1
      className={`govuk-heading-xl ${className ?? ""}`}
      data-testid={dataTest}
    >
      {children}
    </h1>
  );
}
