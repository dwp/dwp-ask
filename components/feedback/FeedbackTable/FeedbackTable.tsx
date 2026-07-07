"use client";

import { TableCell, TableRow, TableWrapper } from "@/components";
import type { FeedbackTableProps } from "@/types";
import { dateFormatForHistoryPage } from "@/utils";

/**
 * Admin table displaying feedback entries with date, selected options, and free text columns.
 */
export default function FeedbackTable({ tableContent }: FeedbackTableProps) {
  return (
    <div>
      <TableWrapper
        data-testid="feedback-table"
        columnTitles={["Date", "Selected Options", "Free Text"]}
      >
        {tableContent?.map((item) => {
          const parsedDate = dateFormatForHistoryPage(item.created_at);
          const optionsText = item.selected_options
            .map((option: { name: string }) => option.name)
            .join(", ");

          return (
            <TableRow key={item.id} data-testid="feedback-table-row">
              <TableCell data-testid="feedback-table-row-date">
                {parsedDate[0]}
              </TableCell>
              <TableCell data-testid="feedback-table-row-options">
                {optionsText}
              </TableCell>
              <TableCell data-testid="feedback-table-row-text">
                {item.feedback_free_text}
              </TableCell>
            </TableRow>
          );
        })}
      </TableWrapper>
    </div>
  );
}
