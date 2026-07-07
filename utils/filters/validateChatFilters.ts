import { FILTER_IDS } from "@/constants/Ids";
import type { ChatFiltersState, ErrorSummaryItemType } from "@/types";
import { validateDateRange } from "../shared/helper";

/**
 * Validates the chat filters and returns an array of errors if any are found.
 *
 * @param filters Chat filters from UI
 * @returns an array of errors
 */
const validateChatFilters = (
  filters: ChatFiltersState,
): ErrorSummaryItemType[] => {
  const errors: ErrorSummaryItemType[] = [];

  const { date } = filters;

  const areDatesValid = validateDateRange(date.from, date.to);

  if (!areDatesValid.valid) {
    errors.push({
      text: areDatesValid.message || "Invalid date range",
      href: FILTER_IDS.dates,
      scope: "dates",
    });
  }

  return errors;
};

export { validateChatFilters };
