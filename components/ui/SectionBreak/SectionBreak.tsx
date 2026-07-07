import type { SectionBreakProps } from "@/types";

export default function SectionBreak({ visible, level }: SectionBreakProps) {
  return (
    <hr
      className={`govuk-section-break govuk-section-break--${level} ${visible ? "govuk-section-break--visible" : ""}`}
    />
  );
}
