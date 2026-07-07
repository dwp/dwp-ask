import { LARGE_EXPORT_ERROR } from "@/constants/Admin";
import { MAX_CSV_ROWS_DEFAULT } from "@/constants/Layout";
import type {
  AdminFiltersState,
  ErrorSummaryItemType,
  PayloadProps,
} from "@/types";
import getCsvDownload from "../api/getCsvDownload";
import { handleDownload } from "../shared/helper";
import { normaliseTopics } from "./normaliseTopics";

/**
 * Adapter/helper function for exporting admin data as CSV
 *
 * @param payload the filters which will be applied to the CSV data
 * @returns Promise<Blob> raw CSV
 */
const getCsvDownloadAdapter = async (payload: PayloadProps) => {
  return await getCsvDownload(
    payload.start_date,
    payload.end_date,
    payload.currentPage,
    payload.feedback_types,
    payload.topics,
  );
};

/**
 * Export function for the admin data CSV export button
 *
 * @param e event from the button/link
 * @param setDisplayErrorMessages error setter function for UI
 * @param totalRows total rows of data
 * @param adminFilters any filters which were applied at the time of generation
 * @param currentPage current page from pagination
 * @returns void
 */
const exportAdminDataCsv = async (
  e:
    | React.MouseEvent<HTMLAnchorElement, MouseEvent>
    | React.MouseEvent<HTMLButtonElement, MouseEvent>
    | React.KeyboardEvent<HTMLButtonElement>,
  setDisplayErrorMessages: React.Dispatch<
    React.SetStateAction<ErrorSummaryItemType[]>
  >,
  totalRows: number,
  adminFilters: AdminFiltersState,
  currentPage: number,
): Promise<void> => {
  const maxRowsForCsv =
    Number(process.env.NEXT_PUBLIC_MAX_ROW_CSV) ?? MAX_CSV_ROWS_DEFAULT;
  e.preventDefault();
  if (totalRows > maxRowsForCsv) {
    setDisplayErrorMessages((prev) => prev.concat(LARGE_EXPORT_ERROR));
    return;
  }
  const { date, feedback, topics } = adminFilters;
  const normalisedTopics = normaliseTopics({
    inScope: topics.inScope,
    outOfScope: topics.outOfScope,
  });
  handleDownload(
    date.from,
    date.to,
    currentPage,
    getCsvDownloadAdapter,
    normalisedTopics,
    "csv",
    feedback.values,
  );
};

export { exportAdminDataCsv };
