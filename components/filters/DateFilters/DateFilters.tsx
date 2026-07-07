import { DateField } from "@/components";
import { FILTER_IDS } from "@/constants/Ids";
import { DateFiltersProps, DateParts } from "@/types";

export default function DateFilters({
  from,
  to,
  onDateChange,
}: DateFiltersProps) {
  return (
    <div
      className="flex gap-3"
      id={FILTER_IDS.dates}
      data-testid="date-filters-container"
    >
      <div data-testid="date-filters-from-date-container">
        <DateField
          id="from-date"
          title="From date"
          data-testid="date-filters-from-date"
          errorText=""
          value={from}
          onChange={(e: DateParts) => onDateChange(e, "from")}
        />
      </div>
      <div data-testid="date-filters-to-date-container">
        <DateField
          id="to-date"
          errorText=""
          title="To date (optional)"
          data-testid="date-filters-to-date"
          value={to}
          onChange={(e: DateParts) => onDateChange(e, "to")}
        />
      </div>
    </div>
  );
}
