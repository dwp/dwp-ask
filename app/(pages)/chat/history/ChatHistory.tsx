"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Analytics,
  ChatFilters,
  CustomTable,
  ErrorCard,
  ExportAllButton,
  Link,
  LoadingBox,
  Main,
  PageDescription,
  TableCell,
  TableRow,
} from "@/components";
import { INITIAL_CHAT_FILTERS } from "@/constants/Filters";
import { TRUNCATE_LENGTH } from "@/constants/Layout";
import type {
  ChatFiltersState,
  ErrorSummaryItemType,
  MessagesResponseType,
} from "@/types";
import {
  convertDateToISO,
  dateFormatForHistoryPage,
  exportChatArchivePdf,
  getMessages,
  logger,
  storeViewDetails,
  truncate,
  validateChatFilters,
} from "@/utils";
import styles from "./ChatHistory.module.css";

export default function ChatHistory() {
  const [chatFilters, setChatFilters] =
    useState<ChatFiltersState>(INITIAL_CHAT_FILTERS);

  const [displayErrorMessages, setDisplayErrorMessages] = useState<
    ErrorSummaryItemType[]
  >([]);

  const [chatMessages, setChatMessages] = useState<MessagesResponseType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiErrorState, setAPIErrorState] = useState(false);

  const router = useRouter();
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchData();
  });

  const handlePagination = async (page: number) => {
    setCurrentPage(page);
    await handleApply(page);
  };

  const handleReset = () => {
    setChatFilters(INITIAL_CHAT_FILTERS);
    setDisplayErrorMessages([]);
    const { date } = INITIAL_CHAT_FILTERS;
    fetchData(date.from, date.to);
  };

  const handleApply = async (page?: number) => {
    try {
      const errors = validateChatFilters(chatFilters);
      if (errors.length > 0) {
        const datesError = errors.find((error) => error.scope === "dates");
        setDisplayErrorMessages(errors);
        setChatFilters((prev) => ({
          ...prev,
          date: {
            ...prev.date,
            errorText: datesError?.text ?? "",
          },
        }));
        return;
      }
      const pageToSend = page && typeof page === "number" ? page : currentPage;
      setCurrentPage(pageToSend);
      const start_date = convertDateToISO(chatFilters.date.from);
      const end_date = convertDateToISO(chatFilters.date.to);
      setLoading(true);
      const res = await getMessages(start_date, end_date, pageToSend);
      setCurrentPage(pageToSend);
      setChatMessages(res.data);
      setTotalPages(res.total_pages);
      setLoading(false);
    } catch (error: unknown) {
      logger.error("Error in ChatHistory - handleApply", {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      setAPIErrorState(true);
      setLoading(false);
    } finally {
      setLoading(false);
      setLoading(false);
    }
  };

  const fetchData = async (
    start = chatFilters.date.from,
    end = chatFilters.date.to,
  ) => {
    const startDate = convertDateToISO(start);
    const endDate = convertDateToISO(end);
    try {
      setLoading(true);
      const res = await getMessages(startDate, endDate, currentPage);
      setLoading(false);
      setChatMessages(res.data);
      setTotalPages(res.total_pages);
    } catch {
      setLoading(false);
      setAPIErrorState(true);
    }
  };

  const ErrorMessage = () => (
    <p>
      There is a technical issue with loading your chat archive, please try
      again later or{" "}
      <Link className="govuk-link" href="/">
        return to home
      </Link>{" "}
      to ask DWP Ask a question.
    </p>
  );

  return (
    <Main>
      <Analytics />
      {apiErrorState ? (
        <ErrorCard>
          <ErrorMessage />
        </ErrorCard>
      ) : (
        <LoadingBox className={styles.loading} loading={loading}>
          <PageDescription
            backLink="/chat"
            title="Chat archive"
            warningText="Only use the chat archive for complaints procedures. Do not use old chats for advice."
            description="The view is automatically filtered to show chats from the previous calendar week, to change this - adjust the date filter."
            errorSummary={
              displayErrorMessages.length > 0 ? displayErrorMessages : []
            }
          />

          <div className="govuk-form-group" id="main" tabIndex={-1}>
            <ChatFilters
              chatFilters={chatFilters}
              setChatFilters={setChatFilters}
              handleReset={handleReset}
              handleApply={handleApply}
            />
          </div>

          <CustomTable<MessagesResponseType>
            tableContent={chatMessages}
            currentPage={currentPage}
            setCurrentPage={handlePagination}
            totalPages={totalPages}
            columnTitles={["Question asked", "Date", "Details"]}
            renderRow={(item, id) => {
              const parsedDate = dateFormatForHistoryPage(item.created_at);
              const truncatedQuestion = truncate(
                item.question,
                TRUNCATE_LENGTH.TABLE,
              );
              return (
                <TableRow
                  key={item.id ?? id}
                  data-testid="chat-history-table-row"
                >
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
                    <span
                      onClick={() => {
                        storeViewDetails({ parsedDate, items: item });
                        router.push("/chat/view-details");
                      }}
                    >
                      <Link
                        href="/chat/view-details"
                        data-testid="chat-history-table-row-view-details-link"
                        tabIndex={0}
                        className={styles.tableLink}
                      >
                        View details
                      </Link>
                    </span>
                  </TableCell>
                </TableRow>
              );
            }}
          />
          {totalPages > 0 && (
            <ExportAllButton
              buttonName="Export all filtered chats as PDF"
              className={styles.exportButtonMarginTop}
              onClick={(e) =>
                exportChatArchivePdf(
                  e,
                  chatFilters.date.from,
                  chatFilters.date.to,
                  currentPage,
                )
              }
            />
          )}
        </LoadingBox>
      )}
    </Main>
  );
}
