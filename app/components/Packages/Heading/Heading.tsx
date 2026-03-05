import React from "react";

type GDSHeadingProps = Readonly<{
  id?: string;
  className?: string;
  "data-testid"?: string;
  "aria-label"?: string;
  tabIndex?: number;
  role?: string;
  style?: { [key: string]: string } | object;
  children: React.ReactNode;
}>;

export default function Heading({
  id,
  className,
  tabIndex,
  role,
  children,
  ...props
}: GDSHeadingProps) {
  const dataTest = props["data-testid"];
  const ariaLabel = props["aria-label"];

  return (
    <h1
      id={id}
      className={`govuk-heading-xl ${className}`}
      tabIndex={tabIndex}
      role={role}
      aria-label={ariaLabel}
      data-testid={dataTest}
    >
      {children}
    </h1>
  );
}
