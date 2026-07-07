import type { TableCellProps } from "@/types";

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
