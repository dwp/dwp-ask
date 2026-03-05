import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FeedbackTable from "./FeedbackTable";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

// Mock TableWrapper
jest.mock("@/app/components", () => ({
  TableWrapper: ({ children, ...props }: any) => (
    <table {...props}>
      <tbody>{children}</tbody>
    </table>
  ),
  TableRow: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  TableCell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
}));

jest.mock("@/app/utils/helpers", () => ({
  dateFormatForHistoryPage: (date: string) => [date.split("T")[0], "formatted"],
}));

describe("FeedbackTable", () => {
  it("renders no rows if tableContent is empty", () => {
    render(<FeedbackTable tableContent={[]} />);
    expect(screen.queryAllByTestId("feedback-table-row")).toHaveLength(0);
  });

  it("renders table rows with feedback data", () => {
    const mockTableContent = [
      {
        id: 1,
        created_at: "2023-12-01T10:30:00Z",
        selected_options: [
          { id: 1, name: "Not helpful" },
          { id: 2, name: "Incorrect information" },
        ],
        feedback_free_text: "This answer was not accurate",
      },
      {
        id: 2,
        created_at: "2023-12-02T14:15:00Z",
        selected_options: [{ id: 3, name: "Very helpful" }],
        feedback_free_text: "Great response",
      },
    ];

    render(<FeedbackTable tableContent={mockTableContent} />);

    expect(screen.getAllByTestId("feedback-table-row")).toHaveLength(2);
    expect(screen.getByText("2023-12-01")).toBeInTheDocument();
    expect(
      screen.getByText("Not helpful, Incorrect information"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("This answer was not accurate"),
    ).toBeInTheDocument();
    expect(screen.getByText("2023-12-02")).toBeInTheDocument();
    expect(screen.getByText("Very helpful")).toBeInTheDocument();
    expect(screen.getByText("Great response")).toBeInTheDocument();
  });
});
