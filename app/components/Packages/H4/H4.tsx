import React from "react";

type H4Props = {
  children: React.ReactNode;
  className?: string;
  role?: string;
  "data-testid"?: string;
};

export default function H4({
  children,
  className,
  role,
  ...props
}: Readonly<H4Props>) {
  const dataTest = props["data-testid"];

  return (
    <h4
      role={role}
      className={`govuk-heading-s ${className}`}
      data-testid={dataTest}
    >
      {children}
    </h4>
  );
}
