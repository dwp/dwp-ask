type TableProps = Readonly<{
  columnTitles: string[];
  children: React.ReactNode;
  "data-testid"?: string;
}>;

export default function TableWrapper({
  columnTitles,
  children,
  ...props
}: TableProps) {
  const dataTestId = props["data-testid"] ?? "";

  return (
    <table className="govuk-table" data-testid={dataTestId}>
      <thead className="govuk-table__head">
        <tr
          className="govuk-table__row"
          data-testid={`${dataTestId}-headers-row`}
        >
          {columnTitles.map((ct) => (
            <th
              scope="col"
              data-testid={`${dataTestId}-header-column`}
              className="govuk-table__header"
              key={ct}
            >
              {ct}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
