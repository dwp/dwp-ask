import React from "react";

type InsetTextProps = {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
};

export default function InsetText({
  children,
  className,
  ...props
}: InsetTextProps) {
  const dataTest = props["data-testid"];

  return (
    <div className={`govuk-inset-text ${className}`} data-testid={dataTest}>
      {children}
    </div>
  );
}
