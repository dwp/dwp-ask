"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import commonStyles from "@/app/common.module.css";
import { TableCell, TableRow, TableWrapper } from "@/app/components";
import type { MessagesResponseType } from "@/app/types";
import { dateFormatForHistoryPage, truncate } from "@/app/utils/helpers";
import { storeViewDetails } from "@/app/utils/storage/storage";
import Pagination from "../Pagination/Pagination";
import styles from "./HistoryTable.module.css";

type HistoryTableProps = Readonly<{
  tableContent: MessagesResponseType[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}>;

export default function HistoryTable({
  tableContent,
  currentPage,
  setCurrentPage,
  totalPages,
}: HistoryTableProps) {
  const handleView = (items: MessagesResponseType, parsedDate: any) => {
    const data = {
      parsedDate,
      items,
    };
    storeViewDetails(data);
    router.push("/chat/view-details");
  };

  const router = useRouter();
  return (
    <div className={styles.chatWindow}>
      <TableWrapper
        data-testid="chat-history-table"
        columnTitles={["Question asked", "Date", "Details"]}
      >
        {tableContent?.map((item, id) => {
          const parsedDate = dateFormatForHistoryPage(item.created_at);
          const truncatedQuestion = truncate(item.question, 70);

          return (
            <TableRow key={item.id ?? id} data-testid="chat-history-table-row">
              <TableCell
                title={item.question}
                data-testid="chat-history-table-row-question"
              >
                {truncatedQuestion}
              </TableCell>
              <TableCell data-testid="chat-history-table-row-date">
                {parsedDate[0]}
              </TableCell>
              <TableCell data-testid="chat-history-table-row-view-details">
                <button
                  data-testid="chat-history-table-row-view-details-link"
                  tabIndex={0}
                  className={`govuk-link ${commonStyles.resetButton} ${styles.viewDetailsButton} ${commonStyles.underline}`}
                  onClick={(
                    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                  ) => {
                    e.preventDefault();
                    handleView(item, parsedDate);
                  }}
                >
                  View details
                </button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableWrapper>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
