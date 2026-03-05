import React from "react";

type H5Props = {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
};

export default function H5({ children, className, ...props }: H5Props) {
  const dataTest = props["data-testid"];

  return (
    <h5 className={`govuk-heading-s ${className}`} data-testid={dataTest}>
      {children}
    </h5>
  );
}
