import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { AdminTableProps, MessagesResponseType } from "@/types";
import AdminTable from "./AdminTable";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/components", () => ({
  CustomTable: <T,>({
    tableContent,
    currentPage,
    setCurrentPage,
    totalPages,
    columnTitles,
    renderRow,
  }: {
    tableContent: T[];
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    columnTitles: string[];
    renderRow: (item: T, index: number) => React.ReactNode;
  }) => (
    <div
      data-testid="custom-table"
      data-current-page={currentPage}
      data-total-pages={totalPages}
    >
      <div data-testid="column-titles">{columnTitles.join(",")}</div>
      <button
        data-testid="pagination-trigger"
        onClick={() => setCurrentPage(2)}
      >
        Page 2
      </button>
      <div data-testid="table-rows">
        {tableContent.map((item, index) => renderRow(item, index))}
      </div>
    </div>
  ),

  TableRow: ({
    children,
    "data-testid": testId,
  }: {
    children: React.ReactNode;
    "data-testid"?: string;
  }) => <tr data-testid={testId}>{children}</tr>,

  TableCell: ({
    children,
    title,
    "data-testid": testId,
  }: {
    children: React.ReactNode;
    title?: string;
    "data-testid"?: string;
  }) => (
    <td data-testid={testId} title={title}>
      {children}
    </td>
  ),

  Link: ({
    children,
    onClick,
    tabIndex,
    "data-testid": testId,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    tabIndex?: number;
    "data-testid"?: string;
  }) => (
    <a data-testid={testId} tabIndex={tabIndex} onClick={onClick}>
      {children}
    </a>
  ),
}));

vi.mock("@/constants/Layout", () => ({
  TRUNCATE_LENGTH: { ADMIN: 50 },
}));

vi.mock("@/utils", () => ({
  dateFormatForHistoryPage: vi.fn((date: string) => [
    `Formatted: ${date}`,
    date,
  ]),
  truncate: vi.fn((text: string, length: number) =>
    text.length > length ? `${text.slice(0, length)}...` : text,
  ),
  storeAdminViewDetails: vi.fn(),
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

import {
  dateFormatForHistoryPage,
  storeAdminViewDetails,
  truncate,
} from "@/utils";

const makeMessage = (
  overrides: Partial<MessagesResponseType> = {},
): MessagesResponseType => ({
  id: 1,
  question: "What is universal credit?",
  created_at: "2024-01-15T10:00:00Z",
  citations: [],
  previous_chat_history: {},
  ...overrides,
});

const defaultProps: AdminTableProps = {
  chatMessages: [makeMessage()],
  totalPages: 3,
  currentPage: 1,
  handlePagination: vi.fn() as unknown as AdminTableProps["handlePagination"],
};

function renderAdminTable(overrides: Partial<AdminTableProps> = {}) {
  const handlePagination =
    vi.fn() as unknown as AdminTableProps["handlePagination"];
  const props = { ...defaultProps, handlePagination, ...overrides };
  render(<AdminTable {...props} />);
  return { handlePagination: props.handlePagination };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AdminTable", () => {
  describe("rendering", () => {
    it("renders the CustomTable", () => {
      renderAdminTable();

      expect(screen.getByTestId("custom-table")).toBeInTheDocument();
    });

    it("passes the correct column titles", () => {
      renderAdminTable();

      expect(screen.getByTestId("column-titles")).toHaveTextContent(
        "Question asked,Date,Feedback,Details",
      );
    });

    it("passes currentPage to CustomTable", () => {
      renderAdminTable({ currentPage: 2 });

      expect(screen.getByTestId("custom-table")).toHaveAttribute(
        "data-current-page",
        "2",
      );
    });

    it("passes totalPages to CustomTable", () => {
      renderAdminTable({ totalPages: 5 });

      expect(screen.getByTestId("custom-table")).toHaveAttribute(
        "data-total-pages",
        "5",
      );
    });

    it("renders a row for each message", () => {
      renderAdminTable({
        chatMessages: [makeMessage({ id: 1 }), makeMessage({ id: 2 })],
      });

      expect(screen.getAllByTestId("admin-history-table-row")).toHaveLength(2);
    });

    it("renders no rows when chatMessages is empty", () => {
      renderAdminTable({ chatMessages: [] });

      expect(
        screen.queryByTestId("admin-history-table-row"),
      ).not.toBeInTheDocument();
    });
  });

  describe("row content", () => {
    it("renders the truncated question in the question cell", () => {
      const question = "What is universal credit?";
      vi.mocked(truncate).mockReturnValueOnce("What is universal credit?");
      renderAdminTable({ chatMessages: [makeMessage({ question })] });

      expect(
        screen.getByTestId("admin-history-table-row-question"),
      ).toHaveTextContent("What is universal credit?");
    });

    it("sets the full question as the title attribute on the question cell", () => {
      const question = "What is universal credit?";
      renderAdminTable({ chatMessages: [makeMessage({ question })] });

      expect(
        screen.getByTestId("admin-history-table-row-question"),
      ).toHaveAttribute("title", question);
    });

    it("calls truncate with the question and ADMIN truncate length", () => {
      const question = "What is universal credit?";
      renderAdminTable({ chatMessages: [makeMessage({ question })] });

      expect(truncate).toHaveBeenCalledWith(question, 50);
    });

    it("renders the formatted date in the date cell", () => {
      vi.mocked(dateFormatForHistoryPage).mockReturnValueOnce([
        "15 January 2024",
        "2024-01-15",
      ]);
      renderAdminTable({
        chatMessages: [makeMessage({ created_at: "2024-01-15T10:00:00Z" })],
      });

      expect(
        screen.getByTestId("admin-history-table-row-date"),
      ).toHaveTextContent("15 January 2024");
    });

    it("calls dateFormatForHistoryPage with the message's created_at", () => {
      const created_at = "2024-03-20T09:30:00Z";
      renderAdminTable({ chatMessages: [makeMessage({ created_at })] });

      expect(dateFormatForHistoryPage).toHaveBeenCalledWith(created_at);
    });

    it("renders the 'View details' link", () => {
      renderAdminTable();

      expect(
        screen.getByTestId("admin-history-table-row-view-details-link"),
      ).toHaveTextContent("View details");
    });

    it("sets tabIndex=0 on the View details link", () => {
      renderAdminTable();

      expect(
        screen.getByTestId("admin-history-table-row-view-details-link"),
      ).toHaveAttribute("tabindex", "0");
    });
  });

  describe("feedback display", () => {
    it("renders 'Positive' when is_response_useful is true", () => {
      renderAdminTable({
        chatMessages: [
          makeMessage({
            feedback: {
              is_response_useful: true,
              selected_options: [],
              feedback_text: "",
            },
          }),
        ],
      });

      expect(
        screen.getByTestId("admin-history-table-row-feedback"),
      ).toHaveTextContent("Positive");
    });

    it("renders 'Negative' when is_response_useful is false", () => {
      renderAdminTable({
        chatMessages: [
          makeMessage({
            feedback: {
              is_response_useful: false,
              selected_options: [],
              feedback_text: "",
            },
          }),
        ],
      });

      expect(
        screen.getByTestId("admin-history-table-row-feedback"),
      ).toHaveTextContent("Negative");
    });

    it("renders 'None' when feedback is undefined", () => {
      renderAdminTable({
        chatMessages: [makeMessage({ feedback: undefined })],
      });

      expect(
        screen.getByTestId("admin-history-table-row-feedback"),
      ).toHaveTextContent("None");
    });

    it("renders 'None' when feedback is undefined", () => {
      renderAdminTable({
        chatMessages: [makeMessage({ feedback: undefined })],
      });

      expect(
        screen.getByTestId("admin-history-table-row-feedback"),
      ).toHaveTextContent("None");
    });

    it("renders 'None' when is_response_useful is null", () => {
      renderAdminTable({
        chatMessages: [
          makeMessage({
            feedback: {
              is_response_useful: null as unknown as boolean,
              selected_options: [],
              feedback_text: "",
            },
          }),
        ],
      });

      expect(
        screen.getByTestId("admin-history-table-row-feedback"),
      ).toHaveTextContent("None");
    });
  });

  describe("pagination", () => {
    it("calls handlePagination when page changes", async () => {
      const handlePagination =
        vi.fn() as unknown as AdminTableProps["handlePagination"];
      renderAdminTable({ handlePagination });

      await userEvent.click(screen.getByTestId("pagination-trigger"));

      expect(vi.mocked(handlePagination)).toHaveBeenCalledWith(2);
    });
  });

  describe("View details link interaction", () => {
    it("calls storeAdminViewDetails with parsedDate and the message item on click", async () => {
      const message = makeMessage();
      const formattedDate = ["15 January 2024", "2024-01-15"];
      vi.mocked(dateFormatForHistoryPage).mockReturnValueOnce(
        formattedDate as [string, string],
      );
      renderAdminTable({ chatMessages: [message] });

      await userEvent.click(
        screen.getByTestId("admin-history-table-row-view-details-link"),
      );

      expect(storeAdminViewDetails).toHaveBeenCalledWith({
        parsedDate: formattedDate,
        items: message,
      });
    });

    it("navigates to /admin/view-details on click", async () => {
      renderAdminTable();

      await userEvent.click(
        screen.getByTestId("admin-history-table-row-view-details-link"),
      );

      expect(mockPush).toHaveBeenCalledWith("/admin/view-details");
    });

    it("calls storeAdminViewDetails before navigating", async () => {
      const callOrder: string[] = [];
      vi.mocked(storeAdminViewDetails).mockImplementationOnce(() => {
        callOrder.push("store");
      });
      mockPush.mockImplementationOnce(() => {
        callOrder.push("push");
      });

      renderAdminTable();

      await userEvent.click(
        screen.getByTestId("admin-history-table-row-view-details-link"),
      );

      expect(callOrder).toEqual(["store", "push"]);
    });
  });
});
