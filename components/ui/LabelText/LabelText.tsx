import type { LabelTextProps } from "@/types";

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
