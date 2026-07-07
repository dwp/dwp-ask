import { TOPIC_CLASH_ERROR_INLINE } from "@/constants/Admin";
import { FILTER_IDS } from "@/constants/Ids";
import type { AdminFiltersState, ErrorSummaryItemType } from "@/types";
import { validateDateRange } from "../shared/helper";

/**
 * Validates the admin filters and returns an array of errors if any are found.
 *
 * @param filters Admin filters from UI
 * @returns an array of errors
 */
const validateAdminFilters = (
  filters: AdminFiltersState,
): ErrorSummaryItemType[] => {
  const errors: ErrorSummaryItemType[] = [];

  const { date, topics } = filters;

  const areDatesValid = validateDateRange(date.from, date.to);

  const inScopeTopics = topics.inScope;
  const outOfScopeTopics = topics.outOfScope;

  if (inScopeTopics.length > 0 && outOfScopeTopics) {
    errors.push({
      text: TOPIC_CLASH_ERROR_INLINE,
      href: FILTER_IDS.topics,
      scope: "topics",
    });
  }

  if (!areDatesValid.valid) {
    errors.push({
      text: areDatesValid.message || "Invalid date range",
      href: FILTER_IDS.dates,
      scope: "dates",
    });
  }

  return errors;
};

export { validateAdminFilters };
