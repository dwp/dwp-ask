import React from "react";

type H2Props = {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
};

export default function H2({ children, className, ...props }: H2Props) {
  const dataTest = props["data-testid"];

  return (
    <h2 className={`govuk-heading-l ${className ?? ""}`} data-testid={dataTest}>
      {children}
    </h2>
  );
}
