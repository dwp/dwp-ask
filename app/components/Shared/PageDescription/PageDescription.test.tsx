import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PageDescription from "./PageDescription";

// Mock next/navigation useRouter
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock components
jest.mock("@/app/components", () => ({
  BackLink: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  H2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  Paragraph: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  WarningText: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
}));

jest.mock("../../Packages/ErrorSummary/ErrorSummary", () => ({
  __esModule: true,
  default: ({ errors }: any) => (
    <div data-testid="error-summary">
      {errors.map((err: any, idx: number) => (
        <div key={idx}>{err.text}</div>
      ))}
    </div>
  ),
}));

describe("PageDescription", () => {
  const defaultProps = {
    backLink: "/back",
    title: "Test Title",
    warningText: "This is a warning",
    description: "This is a description.",
    errorSummary: [
      { text: "Error 1", href: "#field1" },
      { text: "Error 2", href: "#" },
    ],
  };

  it("renders the back link and triggers navigation on click", () => {
    render(<PageDescription {...defaultProps} />);
    const backLink = screen.getByTestId("history-back-link");
    expect(backLink).toBeInTheDocument();
    fireEvent.click(backLink);
    expect(mockPush).toHaveBeenCalledWith("/back");
  });

  it("renders the title", () => {
    render(<PageDescription {...defaultProps} />);
    expect(screen.getByTestId("history-title")).toHaveTextContent("Test Title");
  });

  it("renders the warning text when provided", () => {
    render(<PageDescription {...defaultProps} />);
    expect(screen.getByTestId("history-warning-text")).toHaveTextContent(
      "This is a warning",
    );
  });

  it("does not render warning text when not provided", () => {
    render(<PageDescription {...defaultProps} warningText={undefined} />);
    expect(
      screen.queryByTestId("history-warning-text"),
    ).not.toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<PageDescription {...defaultProps} />);
    expect(screen.getByTestId("history-paragraph")).toHaveTextContent(
      "This is a description.",
    );
  });

  it("renders the error summary when provided", () => {
    render(<PageDescription {...defaultProps} />);
    expect(screen.getByTestId("error-summary")).toBeInTheDocument();
    expect(screen.getByText("Error 1")).toBeInTheDocument();
    expect(screen.getByText("Error 2")).toBeInTheDocument();
  });

  it("does not render the error summary when not provided", () => {
    render(<PageDescription {...defaultProps} errorSummary={undefined} />);
    expect(screen.queryByTestId("error-summary")).not.toBeInTheDocument();
  });
});
