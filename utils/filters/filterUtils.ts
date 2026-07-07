import type {
  AppliedFilterItem,
  AppliedFiltersProps,
  DateParts,
} from "@/types";
import { normaliseTopics } from "./normaliseTopics";

/**
 * Formats a date object (DateParts) into a string in the format "DD/MM/YY".
 *
 * @param date - The date object to format.
 * @returns The formatted date string.
 */
const formatDateForApplied = (date: DateParts): string => {
  const day = String(date.day).padStart(2, "0");
  const month = String(date.month).padStart(2, "0");
  const year = String(date.year).slice(-2);

  return `${day}/${month}/${year}`;
};

/**
 * Gets the filter items for the applied filters component.
 *
 * @param props - The props for the applied filters component.
 * @returns An array of filter items.
 */
const getFilterItems = (props: AppliedFiltersProps): AppliedFilterItem[] => {
  const { filters } = props.filters;
  const items: AppliedFilterItem[] = [];

  if (filters.date) {
    items.push({
      label: "Date",
      value: `From ${formatDateForApplied(filters.date.from)} to ${formatDateForApplied(filters.date.to)}`,
    });
  }

  if (props.filters.filterType === "admin") {
    if (props.filters.filters.feedback) {
      props.filters.filters.feedback.values.forEach((feedbackType) => {
        items.push({
          label: "Feedback",
          value:
            feedbackType === "false"
              ? "negative"
              : feedbackType === "true"
                ? "positive"
                : "none",
        });
      });
    }

    if (props.filters.filters.topics) {
      const topics = normaliseTopics(props.filters.filters.topics);
      topics.forEach((topic) => {
        items.push({ label: "Topic", value: topic.replaceAll("-", " ") });
      });
    }
  }

  return items;
};

export { formatDateForApplied, getFilterItems };
