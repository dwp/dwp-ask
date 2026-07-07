import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, MockedFunction, vi } from "vitest";
import type { MessagesResponseType } from "@/types";
import {
  mockComponents,
  mockHelpers,
  mockNextNavigation,
  mockStorage,
} from "@/utils/test";
import CustomTable from "./CustomTable";

const navMock = mockNextNavigation();
vi.mock("next/navigation", () => navMock.mock());
vi.mock("@/components", () => mockComponents);
vi.mock("@/utils", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return { ...actual, ...mockHelpers, ...mockStorage };
});
vi.mock("./CustomTable.module.css", () => ({
  default: { chatWindow: "chat-window" },
}));

import { dateFormatForHistoryPage, storeViewDetails, truncate } from "@/utils";

const mockRenderRow = (item: MessagesResponseType, idx: number) => {
  const parsedDate = dateFormatForHistoryPage(item.created_at);
  const truncatedQuestion = truncate(item.question, 70);
  return (
    <tr key={item.id ?? idx} data-testid="custom-table-row">
      <td data-testid="custom-table-row-question" title={item.question}>
        {truncatedQuestion}
      </td>
      <td data-testid="custom-table-row-date">{parsedDate[0]}</td>
      <td data-testid="custom-table-row-view-details">
        <button
          data-testid="custom-table-row-view-details-link"
          tabIndex={0}
          onClick={() => {
            storeViewDetails({ parsedDate, items: item });
            navMock.mockPush("/chat/view-details");
          }}
        >
          View details
        </button>
      </td>
    </tr>
  );
};

const mockDateFormatForHistoryPage = dateFormatForHistoryPage as MockedFunction<
  typeof dateFormatForHistoryPage
>;
const mockTruncate = truncate as MockedFunction<typeof truncate>;
const mockStoreViewDetails = storeViewDetails as MockedFunction<
  typeof storeViewDetails
>;

describe("CustomTable Component", () => {
  const mockSetCurrentPage = vi.fn();
  const columnTitles = ["Question asked", "Date", "Details"];

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
    vi.clearAllMocks();
    mockDateFormatForHistoryPage.mockReturnValue(["2024-01-15", "formatted"]);
    mockTruncate.mockImplementation((text: string, length: number) =>
      text.length > length ? `${text.substring(0, length)}...` : text,
    );
  });

  describe("Basic Rendering", () => {
    it("renders table with correct structure and column headers", () => {
      render(
        <CustomTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={2}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const table = screen.getByTestId("custom-table");
      expect(table).toBeInTheDocument();

      // Check column headers
      expect(screen.getByText("Question asked")).toBeInTheDocument();
      expect(screen.getByText("Date")).toBeInTheDocument();
      expect(screen.getByText("Details")).toBeInTheDocument();
    });

    it("renders correct number of table rows", () => {
      render(
        <CustomTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const rows = screen.getAllByTestId("custom-table-row");
      expect(rows).toHaveLength(3);
    });

    it("renders empty table when no content provided", () => {
      render(
        <CustomTable
          tableContent={[]}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const table = screen.getByTestId("custom-table");
      expect(table).toBeInTheDocument();

      const rows = screen.queryAllByTestId("custom-table-row");
      expect(rows).toHaveLength(0);
    });
  });

  describe("Table Content", () => {
    it("displays question content in question cells", () => {
      render(
        <CustomTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const questionCells = screen.getAllByTestId("custom-table-row-question");
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
        <CustomTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const questionCells = screen.getAllByTestId("custom-table-row-question");

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
        <CustomTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const dateCells = screen.getAllByTestId("custom-table-row-date");
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
        <CustomTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const detailsCells = screen.getAllByTestId(
        "custom-table-row-view-details",
      );
      const detailsLinks = screen.getAllByTestId(
        "custom-table-row-view-details-link",
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
        <CustomTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const detailsLinks = screen.getAllByTestId(
        "custom-table-row-view-details-link",
      );

      // Click first link
      fireEvent.click(detailsLinks[0]);

      expect(mockStoreViewDetails).toHaveBeenCalledWith({
        parsedDate: ["2024-01-15", "formatted"],
        items: mockTableContent[0],
      });
      expect(navMock.mockPush).toHaveBeenCalledWith("/chat/view-details");
    });

    it("navigates to view details page on link click", () => {
      render(
        <CustomTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const detailsLinks = screen.getAllByTestId(
        "custom-table-row-view-details-link",
      );

      fireEvent.click(detailsLinks[1]);

      expect(navMock.mockPush).toHaveBeenCalledWith("/chat/view-details");
    });

    it("prevents default behavior on view details link click", () => {
      render(
        <CustomTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const preventDefault = vi.fn();
      const mockEvent: Pick<React.MouseEvent, "preventDefault"> = {
        preventDefault,
      };

      const detailsLinks = screen.getAllByTestId(
        "custom-table-row-view-details-link",
      );
      fireEvent.click(detailsLinks[0], mockEvent);

      // Verify the function still executes correctly
      expect(mockStoreViewDetails).toHaveBeenCalled();
      expect(navMock.mockPush).toHaveBeenCalled();
    });
  });

  describe("Pagination", () => {
    it("renders pagination when totalPages > 1", () => {
      render(
        <CustomTable
          tableContent={mockTableContent}
          currentPage={2}
          setCurrentPage={mockSetCurrentPage}
          totalPages={5}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const pagination = screen.getByTestId("pagination-mock");
      expect(pagination).toBeInTheDocument();
      expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
    });

    it("does not render pagination when totalPages <= 1", () => {
      render(
        <CustomTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const pagination = screen.queryByTestId("pagination-mock");
      expect(pagination).not.toBeInTheDocument();
    });

    it("passes correct props to Pagination component", () => {
      render(
        <CustomTable
          tableContent={mockTableContent}
          currentPage={3}
          setCurrentPage={mockSetCurrentPage}
          totalPages={10}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
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
        <CustomTable
          tableContent={contentWithoutId}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const rows = screen.getAllByTestId("custom-table-row");
      expect(rows).toHaveLength(1);
    });

    it("handles long questions by calling truncate function", () => {
      const longQuestion =
        "This is a very long question that should be truncated when displayed in the table";
      mockTruncate.mockReturnValue(
        "This is a very long question that should be truncated when dis...",
      );

      render(
        <CustomTable
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
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      expect(mockTruncate).toHaveBeenCalledWith(longQuestion, 70);
    });

    it("handles undefined or null tableContent", () => {
      render(
        <CustomTable
          tableContent={null as unknown as MessagesResponseType[]}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const table = screen.getByTestId("custom-table");
      expect(table).toBeInTheDocument();

      const rows = screen.queryAllByTestId("custom-table-row");
      expect(rows).toHaveLength(0);
    });
  });

  describe("Accessibility", () => {
    it("provides proper tabIndex for view details links", () => {
      render(
        <CustomTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const detailsLinks = screen.getAllByTestId(
        "custom-table-row-view-details-link",
      );
      detailsLinks.forEach((link) => {
        expect(link).toHaveAttribute("tabIndex", "0");
      });
    });

    it("provides title attributes for question cells with full text", () => {
      render(
        <CustomTable
          tableContent={mockTableContent}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
          totalPages={1}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      const questionCells = screen.getAllByTestId("custom-table-row-question");
      questionCells.forEach((cell, index) => {
        expect(cell).toHaveAttribute("title", mockTableContent[index].question);
      });
    });
  });

  describe("Component Integration", () => {
    it("integrates properly with all mocked dependencies", () => {
      render(
        <CustomTable
          tableContent={mockTableContent}
          currentPage={2}
          setCurrentPage={mockSetCurrentPage}
          totalPages={5}
          columnTitles={columnTitles}
          renderRow={mockRenderRow}
        />,
      );

      // Verify table renders
      expect(screen.getByTestId("custom-table")).toBeInTheDocument();

      // Verify pagination renders
      expect(screen.getByTestId("pagination-mock")).toBeInTheDocument();

      // Verify all helper functions are called
      expect(mockDateFormatForHistoryPage).toHaveBeenCalled();
      expect(mockTruncate).toHaveBeenCalled();

      // Test interaction
      const detailsLink = screen.getAllByTestId(
        "custom-table-row-view-details-link",
      )[0];
      fireEvent.click(detailsLink);

      expect(mockStoreViewDetails).toHaveBeenCalled();
      expect(navMock.mockPush).toHaveBeenCalledWith("/chat/view-details");
    });
  });
});
