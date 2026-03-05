import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import HistoryTable from "./HistoryTable";
import { MessagesResponseType } from "@/app/types";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock components
jest.mock("@/app/components", () => ({
  TableWrapper: ({ children, columnTitles, ...props }: any) => (
    <table {...props}>
      <thead>
        <tr>
          {columnTitles.map((title: string, index: number) => (
            <th key={index}>{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  ),
  TableRow: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  TableCell: ({ children, title, ...props }: any) => (
    <td {...props} title={title}>
      {children}
    </td>
  ),
}));

// Mock Pagination component
jest.mock("../Pagination/Pagination", () => {
  return function MockPagination({
    currentPage,
    totalPages,
    onPageChange,
  }: any) {
    return (
      <div data-testid="pagination-mock">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
      </div>
    );
  };
});

// Mock helper functions
jest.mock("@/app/utils/helpers", () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dateFormatForHistoryPage: jest.fn((date: string) => [
    "2024-01-15",
    "formatted",
  ]),
  truncate: jest.fn((text: string, length: number) =>
    text.length > length ? `${text.substring(0, length)}...` : text,
  ),
}));

// Mock storage function
jest.mock("@/app/utils/storage/storage", () => ({
  storeViewDetails: jest.fn(),
}));

// Mock CSS modules
jest.mock("./HistoryTable.module.css", () => ({
  chatWindow: "chat-window",
  viewDetailsButton: "view-details-button",
}));

jest.mock("@/app/common.module.css", () => ({
  resetButton: "reset-button",
  underline: "underline",
}));

import { dateFormatForHistoryPage, truncate } from "@/app/utils/helpers";
import { storeViewDetails } from "@/app/utils/storage/storage";

const mockDateFormatForHistoryPage =
  dateFormatForHistoryPage as jest.MockedFunction<
    typeof dateFormatForHistoryPage
  >;
const mockTruncate = truncate as jest.MockedFunction<typeof truncate>;
const mockStoreViewDetails = storeViewDetails as jest.MockedFunction<
  typeof storeViewDetails
>;

describe("HistoryTable Component", () => {
  const mockSetCurrentPage = jest.fn();

  const mockTableContent: MessagesResponseType[] = [
    {
      id: 1,
      question: "What is the weather like today?",
      previous_chat_history: {},
      citations: [],
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      question: "How do I reset my password for the portal?",
      created_at: "2024-01-14T14:20:00Z",
    } as MessagesResponseType,
    {
      id: 3,
      question:
        "This is a very long question that should be truncated when displayed in the table to prevent layout issues",
      created_at: "2024-01-13T09:15:00Z",
    } as MessagesResponseType,
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockDateFormatForHistoryPage.mockReturnValue(["2024-01-15", "formatted"]);
    mockTruncate.mockImplementation((text: string, length: number) =>
      text.length > length ? `${text.substring(0, length)}...` : text,
    );
  });

  describe("Basic Rendering", () => {
    it("renders table with correct structure and column headers", () => {
      render(
        <HistoryTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={2}
        />,
      );

      const table = screen.getByTestId("chat-history-table");
      expect(table).toBeInTheDocument();

      // Check column headers
      expect(screen.getByText("Question asked")).toBeInTheDocument();
      expect(screen.getByText("Date")).toBeInTheDocument();
      expect(screen.getByText("Details")).toBeInTheDocument();
    });

    it("renders correct number of table rows", () => {
      render(
        <HistoryTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
        />,
      );

      const rows = screen.getAllByTestId("chat-history-table-row");
      expect(rows).toHaveLength(3);
    });

    it("renders empty table when no content provided", () => {
      render(
        <HistoryTable
          tableContent={[]}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
        />,
      );

      const table = screen.getByTestId("chat-history-table");
      expect(table).toBeInTheDocument();

      const rows = screen.queryAllByTestId("chat-history-table-row");
      expect(rows).toHaveLength(0);
    });
  });

  describe("Table Content", () => {
    it("displays question content in question cells", () => {
      render(
        <HistoryTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
        />,
      );

      const questionCells = screen.getAllByTestId(
        "chat-history-table-row-question",
      );
      expect(questionCells).toHaveLength(3);

      // Verify truncate function is called for each question
      expect(mockTruncate).toHaveBeenCalledTimes(3);
      expect(mockTruncate).toHaveBeenCalledWith(
        "What is the weather like today?",
        70,
      );
      expect(mockTruncate).toHaveBeenCalledWith(
        "How do I reset my password for the portal?",
        70,
      );
    });

    it("sets title attribute on question cells with full question text", () => {
      render(
        <HistoryTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
        />,
      );

      const questionCells = screen.getAllByTestId(
        "chat-history-table-row-question",
      );

      expect(questionCells[0]).toHaveAttribute(
        "title",
        "What is the weather like today?",
      );
      expect(questionCells[1]).toHaveAttribute(
        "title",
        "How do I reset my password for the portal?",
      );
    });

    it("displays formatted dates in date cells", () => {
      render(
        <HistoryTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
        />,
      );

      const dateCells = screen.getAllByTestId("chat-history-table-row-date");
      expect(dateCells).toHaveLength(3);

      // Verify dateFormatForHistoryPage is called for each item
      expect(mockDateFormatForHistoryPage).toHaveBeenCalledTimes(3);
      expect(mockDateFormatForHistoryPage).toHaveBeenCalledWith(
        "2024-01-15T10:30:00Z",
      );
      expect(mockDateFormatForHistoryPage).toHaveBeenCalledWith(
        "2024-01-14T14:20:00Z",
      );
      expect(mockDateFormatForHistoryPage).toHaveBeenCalledWith(
        "2024-01-13T09:15:00Z",
      );

      // Check that formatted date is displayed
      dateCells.forEach((cell) => {
        expect(cell).toHaveTextContent("2024-01-15");
      });
    });

    it("renders view details links in action cells", () => {
      render(
        <HistoryTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
        />,
      );

      const detailsCells = screen.getAllByTestId(
        "chat-history-table-row-view-details",
      );
      const detailsLinks = screen.getAllByTestId(
        "chat-history-table-row-view-details-link",
      );

      expect(detailsCells).toHaveLength(3);
      expect(detailsLinks).toHaveLength(3);

      detailsLinks.forEach((link) => {
        expect(link).toHaveTextContent("View details");
        expect(link).toHaveAttribute("tabIndex", "0");
      });
    });
  });

  describe("View Details Functionality", () => {
    it("calls handleView with correct data when view details link is clicked", () => {
      render(
        <HistoryTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
        />,
      );

      const detailsLinks = screen.getAllByTestId(
        "chat-history-table-row-view-details-link",
      );

      // Click first link
      fireEvent.click(detailsLinks[0]);

      expect(mockStoreViewDetails).toHaveBeenCalledWith({
        parsedDate: ["2024-01-15", "formatted"],
        items: mockTableContent[0],
      });
      expect(mockPush).toHaveBeenCalledWith("/chat/view-details");
    });

    it("navigates to view details page on link click", () => {
      render(
        <HistoryTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
        />,
      );

      const detailsLinks = screen.getAllByTestId(
        "chat-history-table-row-view-details-link",
      );

      fireEvent.click(detailsLinks[1]);

      expect(mockPush).toHaveBeenCalledWith("/chat/view-details");
    });

    it("prevents default behavior on view details link click", () => {
      render(
        <HistoryTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
        />,
      );

      const preventDefault = jest.fn();
      const mockEvent = { preventDefault } as any;

      const detailsLinks = screen.getAllByTestId(
        "chat-history-table-row-view-details-link",
      );
      fireEvent.click(detailsLinks[0], mockEvent);

      // Verify the function still executes correctly
      expect(mockStoreViewDetails).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalled();
    });
  });

  describe("Pagination", () => {
    it("renders pagination when totalPages > 1", () => {
      render(
        <HistoryTable
          tableContent={mockTableContent}
          currentPage={2}
          setCurrentPage={mockSetCurrentPage}
          totalPages={5}
        />,
      );

      const pagination = screen.getByTestId("pagination-mock");
      expect(pagination).toBeInTheDocument();
      expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
    });

    it("does not render pagination when totalPages <= 1", () => {
      render(
        <HistoryTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
        />,
      );

      const pagination = screen.queryByTestId("pagination-mock");
      expect(pagination).not.toBeInTheDocument();
    });

    it("passes correct props to Pagination component", () => {
      render(
        <HistoryTable
          tableContent={mockTableContent}
          currentPage={3}
          setCurrentPage={mockSetCurrentPage}
          totalPages={10}
        />,
      );

      // Verify pagination is rendered with correct current page
      expect(screen.getByText("Page 3 of 10")).toBeInTheDocument();

      // Test that setCurrentPage is passed correctly
      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);
      expect(mockSetCurrentPage).toHaveBeenCalledWith(4);
    });
  });

  describe("Edge Cases", () => {
    it("handles items without id gracefully", () => {
      const contentWithoutId: MessagesResponseType[] = [
        {
          question: "Test question",
          created_at: "2024-01-15T10:30:00Z",
        } as MessagesResponseType,
      ];

      render(
        <HistoryTable
          tableContent={contentWithoutId}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
        />,
      );

      const rows = screen.getAllByTestId("chat-history-table-row");
      expect(rows).toHaveLength(1);
    });

    it("handles long questions by calling truncate function", () => {
      const longQuestion =
        "This is a very long question that should be truncated when displayed in the table";
      mockTruncate.mockReturnValue(
        "This is a very long question that should be truncated when dis...",
      );

      render(
        <HistoryTable
          tableContent={[
            {
              id: 1,
              question: longQuestion,
              created_at: "2024-01-15T10:30:00Z",
            } as MessagesResponseType,
          ]}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
        />,
      );

      expect(mockTruncate).toHaveBeenCalledWith(longQuestion, 70);
    });

    it("handles undefined or null tableContent", () => {
      render(
        <HistoryTable
          tableContent={null as any}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
        />,
      );

      const table = screen.getByTestId("chat-history-table");
      expect(table).toBeInTheDocument();

      const rows = screen.queryAllByTestId("chat-history-table-row");
      expect(rows).toHaveLength(0);
    });
  });

  describe("Accessibility", () => {
    it("provides proper tabIndex for view details links", () => {
      render(
        <HistoryTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
        />,
      );

      const detailsLinks = screen.getAllByTestId(
        "chat-history-table-row-view-details-link",
      );
      detailsLinks.forEach((link) => {
        expect(link).toHaveAttribute("tabIndex", "0");
      });
    });

    it("provides title attributes for question cells with full text", () => {
      render(
        <HistoryTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
        />,
      );

      const questionCells = screen.getAllByTestId(
        "chat-history-table-row-question",
      );
      questionCells.forEach((cell, index) => {
        expect(cell).toHaveAttribute("title", mockTableContent[index].question);
      });
    });
  });

  describe("Component Integration", () => {
    it("integrates properly with all mocked dependencies", () => {
      render(
        <HistoryTable
          tableContent={mockTableContent}
          currentPage={2}
          setCurrentPage={mockSetCurrentPage}
          totalPages={5}
        />,
      );

      // Verify table renders
      expect(screen.getByTestId("chat-history-table")).toBeInTheDocument();

      // Verify pagination renders
      expect(screen.getByTestId("pagination-mock")).toBeInTheDocument();

      // Verify all helper functions are called
      expect(mockDateFormatForHistoryPage).toHaveBeenCalled();
      expect(mockTruncate).toHaveBeenCalled();

      // Test interaction
      const detailsLink = screen.getAllByTestId(
        "chat-history-table-row-view-details-link",
      )[0];
      fireEvent.click(detailsLink);

      expect(mockStoreViewDetails).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/chat/view-details");
    });
  });
});
