"use client";

import { Pagination, TableWrapper } from "@/components";
import type { CustomTableProps } from "@/types";
import styles from "./CustomTable.module.css";

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
