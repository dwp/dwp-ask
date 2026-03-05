type TableRowProps = Readonly<{
  "data-testid"?: string;
  children: React.ReactNode;
}>;

export default function TableRow({ children, ...props }: TableRowProps) {
  const dataTestId = props["data-testid"] ?? "";

  return (
    <tr className="govuk-table__row" data-testid={dataTestId}>
      {children}
    </tr>
  );
}
