type GDSUnorderedListProps = {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
};

export default function UnorderedList({
  children,
  ...props
}: GDSUnorderedListProps) {
  const dataTest = props["data-testid"];

  return (
    <ul
      className="govuk-list govuk-list--bullet"
      data-testid={dataTest}
      {...props}
    >
      {children}
    </ul>
  );
}
