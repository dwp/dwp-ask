type GDSListItemProps = {
  "data-testid"?: string;
  children: React.ReactNode;
};

export default function ListItem({ children, ...props }: GDSListItemProps) {
  const dataTest = props["data-testid"];

  return (
    <li className="govuk-list--bullet" data-testid={dataTest}>
      {children}
    </li>
  );
}
