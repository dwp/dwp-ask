import { useId } from "react";
import type { AccordionToggleProps } from "@/types";
import { ChevronDown, ChevronUp } from "../Chevrons/Chevrons";

export default function AccordionToggle({
  toggleText,
  isOpen,
  setIsOpen,
  children,
  dataTestId,
  labelledBy,
}: AccordionToggleProps) {
  const contentId = useId();

  return (
    <div data-testid="accordion-item">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen(!isOpen)}
        data-testid={dataTestId}
        className="govuk-focus text-[19px] flex items-center gap-1 cursor-pointer text-[var(--govuk-blue)] bg-transparent border-0 p-0"
      >
        {isOpen ? (
          <ChevronUp className="text-[var(--govuk-blue)]" aria-hidden="true" />
        ) : (
          <ChevronDown
            className="text-[var(--govuk-blue)]"
            aria-hidden="true"
          />
        )}
        <span>{isOpen ? toggleText.visible : toggleText.hidden}</span>
      </button>

      {isOpen && (
        <div
          id={contentId}
          aria-labelledby={labelledBy}
          hidden={!isOpen}
          role="region"
          aria-label={isOpen ? toggleText.visible : toggleText.hidden}
          data-testid="accordion-filter-item-content"
          className="mt-5"
        >
          {children}
        </div>
      )}
    </div>
  );
}
