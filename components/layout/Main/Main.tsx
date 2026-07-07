import type { GDSMainProps } from "@/types";

/** GOV.UK-styled main content wrapper with width container and main landmark. */
export default function Main({ children, className, ...props }: GDSMainProps) {
  const dataTest = props["data-testid"];

  return (
    <div className={`govuk-width-container ${className ?? ""}`}>
      <main data-testid={dataTest} className="govuk-main-wrapper">
        {children}
      </main>
    </div>
  );
}
