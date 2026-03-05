type SectionBreakProps = {
  visible: boolean;
  level: "m" | "l" | "xl";
};

export default function SectionBreak({ visible, level }: SectionBreakProps) {
  return (
    <hr
      className={`govuk-section-break govuk-section-break--${level} ${visible ? "govuk-section-break--visible" : ""}`}
    />
  );
}
