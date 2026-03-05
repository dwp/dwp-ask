import React from "react";

type LabelTextProps = {
  children: React.ReactNode;
  className?: string;
};

export default function LabelText({
  children,
  className,
  ...props
}: LabelTextProps) {
  return (
    <span className={`govuk-label ${className}`} {...props}>
      {children}
    </span>
  );
}
