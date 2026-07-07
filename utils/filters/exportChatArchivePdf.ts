import type { DateParts, PayloadProps } from "@/types";
import getPdfDownload from "../api/getPdfDownload";
import { handleDownload } from "../shared/helper";

/**
 * Adapter/helper function for exporting chat history as PDF
 *
 * @param payload the filters which will be applied to the PDF data
 * @returns Promise<Blob> raw PDF
 */
const getPdfDownloadAdapter = async (payload: PayloadProps) => {
  return await getPdfDownload(
    payload.start_date,
    payload.end_date,
    payload.currentPage,
  );
};

/**
 * Export function for the chat history PDF export button
 *
 * @param e event from the button/link
 * @param startDate start date
 * @param endDate end date
 * @param currentPage current page from pagination
 * @returns void
 */
const exportChatArchivePdf = (
  e:
    | React.MouseEvent<HTMLAnchorElement, MouseEvent>
    | React.MouseEvent<HTMLButtonElement, MouseEvent>
    | React.KeyboardEvent<HTMLButtonElement>,
  startDate: DateParts,
  endDate: DateParts,
  currentPage: number,
) => {
  e.preventDefault();

  handleDownload(
    startDate,
    endDate,
    currentPage,
    getPdfDownloadAdapter,
    [],
    "pdf",
  );
};

export { exportChatArchivePdf };
