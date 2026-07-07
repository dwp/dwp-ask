import type {
  AdminViewDataResponse,
  DateParts,
  TopicFiltersType,
} from "@/types";
import getFeedbackList from "../api/getFeedbackList";
import { convertDateToISO } from "../helpers";
import logger from "../logger";
import { validateDateRange } from "../shared/helper";
import { normaliseTopics } from "./normaliseTopics";

/**
 * Fetches admin view data given filters
 *
 * @param fromDate from date
 * @param toDate to date
 * @param feedback feedback filters
 * @param topics topic filters
 * @param page current page from pagination
 * @returns void
 */
const fetchAdminViewData = async (
  fromDate: DateParts,
  toDate: DateParts,
  feedback: string[],
  topics: TopicFiltersType,
  page?: number,
): Promise<AdminViewDataResponse | undefined> => {
  const page_number = page ?? 1;
  const validDate = validateDateRange(fromDate, toDate);
  if (validDate.valid) {
    const start_date = convertDateToISO(fromDate);
    const end_date = convertDateToISO(toDate);
    const topicsToFilter = normaliseTopics(topics);
    try {
      const res = await getFeedbackList(
        start_date,
        end_date,
        page_number,
        feedback,
        topicsToFilter,
      );
      return res;
    } catch (error: unknown) {
      logger.error("Error in fetchAdminViewData", {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }
};

export { fetchAdminViewData };
