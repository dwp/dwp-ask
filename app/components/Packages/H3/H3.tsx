import React from "react";

type H3Props = {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
};

export default function H3({ children, className, ...props }: H3Props) {
  const dataTest = props["data-testid"];

  return (
    <h3 className={`govuk-heading-m ${className ?? ""}`} data-testid={dataTest}>
      {children}
    </h3>
  );
}
