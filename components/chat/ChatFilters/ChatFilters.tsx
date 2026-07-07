import { Button, DateFilters, ErrorFormGroup, Link, Title } from "@/components";
import { GDS_COLOURS } from "@/constants/Colours";
import { INITIAL_CHAT_FILTERS } from "@/constants/Filters";
import { FILTER_IDS } from "@/constants/Ids";
import type { ChatFiltersProps } from "@/types/component.types";

export default function ChatFilters({
  chatFilters,
  setChatFilters,
  handleReset,
  handleApply,
}: ChatFiltersProps) {
  return (
    <div id={FILTER_IDS.chat} data-testid="chat-filters">
      <Title level="h3" data-testid="chat-history-filter-label">
        Filter
      </Title>

      <ErrorFormGroup
        error={
          chatFilters.date.errorText !== INITIAL_CHAT_FILTERS.date.errorText
        }
        errorMessage={chatFilters.date.errorText}
        errorId="chat-filters-invalid-dates-error"
      >
        <DateFilters
          from={chatFilters.date.from}
          to={chatFilters.date.to}
          onDateChange={(e, source) =>
            setChatFilters((prev) => ({
              ...prev,
              date: { ...prev.date, [source]: e },
            }))
          }
        />
      </ErrorFormGroup>

      <div
        className="w-full flex items-baseline h-7.5 mt-7.5 gap-3"
        data-testid="chat-filters-buttons-container"
      >
        <Button
          data-testid="chat-filters-apply-button"
          aria-label="Apply"
          buttonColour={GDS_COLOURS.BLUE}
          onClick={handleApply}
        >
          Apply
        </Button>
        <Link
          className="govuk-link"
          aria-label="Reset"
          tabIndex={0}
          onClick={handleReset}
          data-testid="chat-filters-reset-link"
        >
          Reset
        </Link>
      </div>
    </div>
  );
}
