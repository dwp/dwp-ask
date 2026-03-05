"use client";

import React from "react";
import styles from "./Pagination.module.css";
import commonStyles from "@/app/common.module.css";

type PaginationProps = Readonly<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}>;

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const isCurrentClass = (page: number) =>
    currentPage === page
      ? `govuk-pagination__item--current ${styles.navActivate}`
      : styles.navDefault;

  const getVisiblePages = (
    current: number,
    total: number,
    delta = 1,
  ): (number | "...")[] => {
    if (total <= 3) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const range: (number | "...")[] = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < total - 1) range.push("...");
    if (total > 1) range.push(total);

    return range;
  };

  return (
    <div className={styles.Pagination}>
      <div className={styles.InnerPagination}>
        <nav className="govuk-pagination" aria-label="Pagination">
          {/* Previous Button */}
          {totalPages > 1 && (
            <div
              className={`govuk-pagination__prev ${isFirstPage ? styles.disabledLink : styles.navDefault}`}
            >
              <button
                data-testid="chat-history-previous-link"
                className={`govuk-link govuk-pagination__link ${isFirstPage ? styles.disabledLink : ""} ${commonStyles.resetButton} ${commonStyles.govuk_blue_text} ${commonStyles.underline}`}
                aria-disabled={isFirstPage}
                onClick={(
                  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                ) => {
                  e.preventDefault();
                  if (!isFirstPage) {
                    onPageChange(currentPage - 1);
                  }
                }}
              >
                <svg
                  className="govuk-pagination__icon govuk-pagination__icon--prev"
                  xmlns="http://www.w3.org/2000/svg"
                  height="13"
                  width="15"
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 15 13"
                >
                  <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
                </svg>
                <span className="govuk-pagination__link-title">
                  Previous<span className="govuk-visually-hidden"> page</span>
                </span>
              </button>
            </div>
          )}

          {/* Page List */}
          <ul className="govuk-pagination__list">
            {getVisiblePages(currentPage, totalPages).map((item, index) => (
              <li
                key={index}
                className={`govuk-pagination__item ${
                  item === "..."
                    ? `${"govuk-pagination__item--ellipses"} ${styles.navDefault}`
                    : isCurrentClass(item as number)
                }`}
              >
                {item === "..." ? (
                  <span>...</span>
                ) : (
                  <button
                    data-testid="chat-history-page-number-link"
                    className={`govuk-link govuk-pagination__link ${commonStyles.resetButton} ${commonStyles.underline} ${currentPage === item ? "govuk-pagination__item--current" : ""}`}
                    aria-label={`Page ${item}`}
                    aria-current={currentPage === item ? "page" : undefined}
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    ) => {
                      e.preventDefault();
                      onPageChange(item as number);
                    }}
                  >
                    {item}
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Next Button */}
          {totalPages > 1 && (
            <div
              className={`govuk-pagination__next ${isLastPage ? styles.disabledLink : styles.navDefault}`}
            >
              <button
                data-testid="chat-history-next-link"
                className={`govuk-link govuk-pagination__link ${isLastPage ? styles.disabledLink : ""} ${commonStyles.resetButton} ${commonStyles.govuk_blue_text} ${commonStyles.underline}`}
                aria-disabled={isLastPage}
                onClick={(
                  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                ) => {
                  e.preventDefault();
                  if (!isLastPage) {
                    onPageChange(currentPage + 1);
                  }
                }}
              >
                <span className="govuk-pagination__link-title">
                  Next<span className="govuk-visually-hidden"> page</span>
                </span>
                <svg
                  className="govuk-pagination__icon govuk-pagination__icon--next"
                  xmlns="http://www.w3.org/2000/svg"
                  height="13"
                  width="15"
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 15 13"
                >
                  <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
                </svg>
              </button>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
