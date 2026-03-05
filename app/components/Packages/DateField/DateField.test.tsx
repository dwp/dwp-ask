import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DateField from "./DateField";
import type { DateParts } from "@/app/types";

describe("DateField Component", () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    id: "test-date",
    title: "Enter a date",
    errorText: "This field is required",
    value: { day: "01", month: "01", year: "2023" } as DateParts,
    onChange: mockOnChange,
    "data-testid": "date-field",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with all fields and error message", () => {
    render(<DateField {...defaultProps} />);

    // Check if the component is rendered
    const dateField = screen.getByTestId("date-field");
    expect(dateField).toBeInTheDocument();
    expect(dateField).toHaveClass("govuk-form-group govuk-form-group--error");

    // Check the title
    expect(screen.getByText("Enter a date")).toBeInTheDocument();

    // Check the error message
    const errorMessage = screen.getByText("This field is required");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("govuk-error-message");

    // Check the input fields
    expect(screen.getByLabelText("Day")).toHaveValue("01");
    expect(screen.getByLabelText("Month")).toHaveValue("01");
    expect(screen.getByLabelText("Year")).toHaveValue("2023");
  });

  it("calls onChange when the day input value changes", () => {
    render(<DateField {...defaultProps} />);

    const dayInput = screen.getByLabelText("Day");
    fireEvent.change(dayInput, { target: { value: "15" } });

    expect(mockOnChange).toHaveBeenCalledWith({
      day: "15",
      month: "01",
      year: "2023",
    });
  });

  it("calls onChange when the month input value changes", () => {
    render(<DateField {...defaultProps} />);

    const monthInput = screen.getByLabelText("Month");
    fireEvent.change(monthInput, { target: { value: "12" } });

    expect(mockOnChange).toHaveBeenCalledWith({
      day: "01",
      month: "12",
      year: "2023",
    });
  });

  it("calls onChange when the year input value changes", () => {
    render(<DateField {...defaultProps} />);

    const yearInput = screen.getByLabelText("Year");
    fireEvent.change(yearInput, { target: { value: "2024" } });

    expect(mockOnChange).toHaveBeenCalledWith({
      day: "01",
      month: "01",
      year: "2024",
    });
  });

  it("renders without error message when errorText is empty", () => {
    render(<DateField {...defaultProps} errorText="" />);

    const errorMessage = screen.queryByText("This field is required");
    expect(errorMessage).not.toBeInTheDocument();

    const dateField = screen.getByTestId("date-field");
    expect(dateField).not.toHaveClass("govuk-form-group--error");
  });
});
