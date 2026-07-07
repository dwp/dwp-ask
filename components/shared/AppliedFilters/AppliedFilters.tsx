import { AccordionFilterItem, BorderedText, Link } from "@/components";
import { FILTER_IDS } from "@/constants/Ids";
import type { AppliedFiltersProps } from "@/types";
import { getFilterItems } from "@/utils";

export default function AppliedFilters({
  filters,
  handleReset,
}: AppliedFiltersProps) {
  const filterItems = getFilterItems({ filters, handleReset });

  return (
    <div data-testid="applied-filters" id={FILTER_IDS.applied}>
      <AccordionFilterItem
        title="Applied filters"
        openByDefault
        children={
          <div data-testid="applied-filters-section">
            <section data-testid="applied-filters-items">
              <ul className="flex flex-wrap gap-2 list-none p-0">
                {filterItems.map(({ label, value }) => (
                  <li key={`${label}-${value}`}>
                    <BorderedText text={`${label}: ${value}`} />
                  </li>
                ))}
              </ul>
            </section>

            <Link
              className="govuk-link mt-3"
              aria-label="Reset"
              tabIndex={0}
              onClick={handleReset}
              data-testid="applied-filters-reset-link"
            >
              Reset
            </Link>
          </div>
        }
      />
    </div>
  );
}
