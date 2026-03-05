import React from "react";

type H6Props = {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
};

export default function H6({ children, className, ...props }: H6Props) {
  const dataTest = props["data-testid"];

  return (
    <h6 className={`govuk-heading-s ${className}`} data-testid={dataTest}>
      {children}
    </h6>
  );
}
