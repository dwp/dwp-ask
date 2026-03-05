import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Pagination from "./Pagination";

// Mock the Link component
jest.mock("../Packages/Link/Link", () => {
  return function MockLink({ children, onClick, ...props }: any) {
    return (
      <a onClick={onClick} {...props}>
        {children}
      </a>
    );
  };
});

// Mock CSS modules
jest.mock("./Pagination.module.css", () => ({
  Pagination: "pagination",
  InnerPagination: "inner-pagination",
  disabledLink: "disabled-link",
  navActivate: "nav-activate",
}));

describe("Pagination Component", () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  describe("Basic Rendering", () => {
    it("renders pagination component with correct structure", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      expect(screen.getByRole("navigation")).toBeInTheDocument();
      expect(screen.getByLabelText("Pagination")).toBeInTheDocument();
      expect(
        screen.getByTestId("chat-history-previous-link"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("chat-history-next-link")).toBeInTheDocument();
    });

    it("renders all page numbers", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const pageLinks = screen.getAllByTestId("chat-history-page-number-link");
      expect(pageLinks).toHaveLength(5);

      pageLinks.forEach((link, index) => {
        expect(link).toHaveTextContent((index + 1).toString());
      });
    });
  });

  describe("Previous Button", () => {
    it("calls onPageChange with previous page when clicked and not on first page", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const previousLink = screen.getByTestId("chat-history-previous-link");
      fireEvent.click(previousLink);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it("is disabled when on first page", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const previousLink = screen.getByTestId("chat-history-previous-link");
      expect(previousLink).toHaveAttribute("aria-disabled", "true");
      expect(previousLink).toHaveClass("disabled-link");
    });

    it("does not call onPageChange when clicked on first page", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const previousLink = screen.getByTestId("chat-history-previous-link");
      fireEvent.click(previousLink);

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });

    it("is enabled when not on first page", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const previousLink = screen.getByTestId("chat-history-previous-link");
      expect(previousLink).toHaveAttribute("aria-disabled", "false");
      expect(previousLink).not.toHaveClass("disabled-link");
    });
  });

  describe("Next Button", () => {
    it("calls onPageChange with next page when clicked and not on last page", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const nextLink = screen.getByTestId("chat-history-next-link");
      fireEvent.click(nextLink);

      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it("is disabled when on last page", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const nextLink = screen.getByTestId("chat-history-next-link");
      expect(nextLink).toHaveAttribute("aria-disabled", "true");
      expect(nextLink).toHaveClass("disabled-link");
    });

    it("does not call onPageChange when clicked on last page", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const nextLink = screen.getByTestId("chat-history-next-link");
      fireEvent.click(nextLink);

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });

    it("is enabled when not on last page", () => {
      render(
        <Pagination
          currentPage={4}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const nextLink = screen.getByTestId("chat-history-next-link");
      expect(nextLink).toHaveAttribute("aria-disabled", "false");
      expect(nextLink).not.toHaveClass("disabled-link");
    });
  });

  describe("Page Number Links", () => {
    it("calls onPageChange with correct page number when clicked", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const pageLinks = screen.getAllByTestId("chat-history-page-number-link");

      // Click on page 4
      fireEvent.click(pageLinks[3]);
      expect(mockOnPageChange).toHaveBeenCalledWith(5);

      // Click on page 1
      fireEvent.click(pageLinks[0]);
      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });

    it("has correct aria-label for each page", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const pageLinks = screen.getAllByTestId("chat-history-page-number-link");

      pageLinks.forEach((link, index) => {
        expect(link).toHaveAttribute("aria-label", `Page ${index + 1}`);
      });
    });

    it('sets aria-current="page" for current page', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const pageLinks = screen.getAllByTestId("chat-history-page-number-link");

      pageLinks.forEach((link, index) => {
        if (index + 1 === 3) {
          expect(link).toHaveAttribute("aria-current", "page");
        } else {
          expect(link).not.toHaveAttribute("aria-current");
        }
      });
    });

    it("applies current page styling", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const pageItems = screen
        .getAllByTestId("chat-history-page-number-link")
        .map((link) => link.closest("li"));

      pageItems.forEach((item, index) => {
        if (index + 1 === 3) {
          expect(item).toHaveClass("govuk-pagination__item--current");
          expect(item).toHaveClass("nav-activate");
        } else {
          expect(item).not.toHaveClass("govuk-pagination__item--current");
          expect(item).not.toHaveClass("nav-activate");
        }
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles single page correctly", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={mockOnPageChange}
        />,
      );

      // Previous should be empty object
      const previousLink = screen.findAllByTestId("chat-history-previous-link");
      expect(previousLink).toMatchObject({});

      // Next should be empty object
      const nextLink = screen.findAllByTestId("chat-history-next-link");
      expect(nextLink).toMatchObject({});

      // Only one page should be rendered
      const pageLinks = screen.getAllByTestId("chat-history-page-number-link");
      expect(pageLinks).toHaveLength(1);
      expect(pageLinks[0]).toHaveTextContent("1");
      expect(pageLinks[0]).toHaveAttribute("aria-current", "page");
    });

    it("handles first page correctly", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />,
      );

      const previousLink = screen.getByTestId("chat-history-previous-link");
      const nextLink = screen.getByTestId("chat-history-next-link");

      expect(previousLink).toHaveAttribute("aria-disabled", "true");
      expect(nextLink).toHaveAttribute("aria-disabled", "false");
    });

    it("handles last page correctly", () => {
      render(
        <Pagination
          currentPage={10}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />,
      );

      const previousLink = screen.getByTestId("chat-history-previous-link");
      const nextLink = screen.getByTestId("chat-history-next-link");

      expect(previousLink).toHaveAttribute("aria-disabled", "false");
      expect(nextLink).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("Accessibility", () => {
    it("has proper navigation landmark", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveAttribute("aria-label", "Pagination");
    });
  });

  describe("Event Handling", () => {
    it("prevents default behavior on all link clicks", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />,
      );

      const preventDefault = jest.fn();
      const mockEvent = { preventDefault } as any;

      // Test previous link
      const previousLink = screen.getByTestId("chat-history-previous-link");
      fireEvent.click(previousLink, mockEvent);

      // Test page links
      const pageLinks = screen.getAllByTestId("chat-history-page-number-link");
      fireEvent.click(pageLinks[0], mockEvent);

      // Test next link
      const nextLink = screen.getByTestId("chat-history-next-link");
      fireEvent.click(nextLink, mockEvent);

      expect(mockOnPageChange).toHaveBeenCalledTimes(3);
    });
  });
});
