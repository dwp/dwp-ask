"use client";

import React from "react";
import { TableWrapper, TableRow, TableCell } from "@/app/components";
import { FeedbackResponseType } from "@/app/types";
import { dateFormatForHistoryPage } from "@/app/utils/helpers";

type FeedbackTableProps = Readonly<{
  tableContent: FeedbackResponseType[];
}>;

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
            .map((option) => option.name)
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
