import type { TitleProps } from "@/types";

export default function Title({
  id,
  tabIndex,
  role,
  children,
  level,
  className,
  ...props
}: TitleProps) {
  const dataTest = props["data-testid"];
  const ariaLabel = props["aria-label"];

  const levelMap: { [key: string]: string } = {
    h1: "govuk-heading-xl",
    h2: "govuk-heading-l",
    h3: "govuk-heading-m",
    h4: "govuk-heading-s",
    h5: "govuk-heading-s",
    h6: "govuk-heading-s",
  };

  const Component = level;
  const headingClass = levelMap[level] || "govuk-heading-m";

  return (
    <Component
      id={id}
      tabIndex={tabIndex}
      role={role}
      aria-label={ariaLabel}
      className={`${headingClass} ${className ?? ""}`}
      data-testid={dataTest}
      {...props}
    >
      {children}
    </Component>
  );
}
