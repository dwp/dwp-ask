import type { GDSListItemProps } from "@/types";

export default function ListItem({
  children,
  className,
  ...props
}: GDSListItemProps) {
  const dataTest = props["data-testid"];

  return (
    <li
      className={`govuk-list--bullet ${className ?? ""}`}
      data-testid={dataTest}
    >
      {children}
    </li>
  );
}
