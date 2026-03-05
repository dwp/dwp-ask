type TableCellProps = Readonly<{
  "data-testid"?: string;
  title?: string;
  children: React.ReactNode;
}>;

export default function TableCell({
  children,
  title,
  ...props
}: TableCellProps) {
  const dataTestId = props["data-testid"] ?? "";

  return (
    <td
      className="govuk-table__cell"
      data-testid={dataTestId}
      title={title ?? ""}
    >
      {children}
    </td>
  );
}
