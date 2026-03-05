"use client";

import React from "react";
import { TableWrapper } from "@/app/components";
import styles from "./CustomTable.module.css";
import Pagination from "../../Pagination/Pagination";

type CustomTableProps<T> = Readonly<{
  tableContent: T[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  columnTitles: string[];
  columnWidths?: string[];
  renderRow: (item: T, index: number) => React.ReactNode;
}>;

export default function CustomTable<T>({
  tableContent,
  currentPage,
  setCurrentPage,
  totalPages,
  columnTitles,
  renderRow,
}: CustomTableProps<T>) {
  return (
    <div className={styles.chatWindow}>
      <TableWrapper data-testid="custom-table" columnTitles={columnTitles}>
        {tableContent?.map((item, idx) => renderRow(item, idx))}
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
