import type { GDSUnorderedListProps } from "@/types";

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
