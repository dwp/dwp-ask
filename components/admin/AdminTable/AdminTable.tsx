"use client";

import { useRouter } from "next/navigation";
import { CustomTable, Link, TableCell, TableRow } from "@/components";
import { TRUNCATE_LENGTH } from "@/constants/Layout";
import type { AdminTableProps, MessagesResponseType } from "@/types";
import {
  dateFormatForHistoryPage,
  storeAdminViewDetails,
  truncate,
} from "@/utils";

export default function AdminTable({
  chatMessages,
  totalPages,
  currentPage,
  handlePagination,
}: AdminTableProps) {
  const router = useRouter();

  return (
    <CustomTable<MessagesResponseType>
      tableContent={chatMessages}
      currentPage={currentPage}
      setCurrentPage={handlePagination}
      totalPages={totalPages}
      columnTitles={["Question asked", "Date", "Feedback", "Details"]}
      renderRow={(item, id) => {
        const parsedDate = dateFormatForHistoryPage(item.created_at);
        const truncatedQuestion = truncate(
          item.question,
          TRUNCATE_LENGTH.ADMIN,
        );
        return (
          <TableRow key={item.id ?? id} data-testid="admin-history-table-row">
            <TableCell
              title={item.question}
              data-testid="admin-history-table-row-question"
            >
              {truncatedQuestion}
            </TableCell>
            <TableCell data-testid="admin-history-table-row-date">
              {parsedDate[0]}
            </TableCell>
            <TableCell data-testid="admin-history-table-row-feedback">
              {item.feedback?.is_response_useful === true
                ? "Positive"
                : item.feedback?.is_response_useful === false
                  ? "Negative"
                  : "None"}
            </TableCell>
            <TableCell data-testid="admin-history-table-row-view-details">
              <Link
                data-testid="admin-history-table-row-view-details-link"
                tabIndex={0}
                onClick={() => {
                  storeAdminViewDetails({ parsedDate, items: item });
                  router.push("/admin/view-details");
                }}
              >
                View details
              </Link>
            </TableCell>
          </TableRow>
        );
      }}
    />
  );
}
