import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@/app/utils/api", () => ({
  sendQuery: jest.fn().mockResolvedValue([]),
  sendFeedback: jest.fn().mockResolvedValue({ id: 1 }),
}));

import FeedbackExpanded from "./FeedbackExpanded";
import { options } from "@/app/constants/FeedbackExpanded";
import * as api from "@/app/utils/api";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

jest.mock("@/app/utils/api");
const setFeedbackCompleted = jest.fn();
const setIsFeedbackHelpful = jest.fn();

const TestFeedbackExpanded = () => {
  return (
    <FeedbackExpanded
      setFeedbackCompleted={setFeedbackCompleted}
      setIsFeedbackHelpful={setIsFeedbackHelpful}
      messageId={1}
    />
  );
};

describe("Component renders correctly", () => {
  it("renders correctly", () => {
    render(<TestFeedbackExpanded />);
    const component = screen.getByText(
      "Tell us why this response is not useful",
    );
    expect(component).toBeInTheDocument();
  });
});

describe("Event listeners run", () => {
  it("onChange for textarea runs", () => {
    render(<TestFeedbackExpanded />);
    const textarea = screen.getByTestId("feedback-detail-textarea");
    fireEvent.change(textarea, { target: { value: "Test value" } });
    expect(textarea).toHaveValue("Test value");
  });

  it("onChange for checkbox runs", () => {
    render(<TestFeedbackExpanded />);
    const checkbox = screen.getByTestId(`checkbox-${options[0]}`);
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("onChange for checkbox runs and updates state", () => {
    render(<TestFeedbackExpanded />);
    const checkbox = screen.getByTestId(`checkbox-${options[0]}`);
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("onClick for submit button runs", () => {
    (api.sendFeedback as jest.Mock).mockResolvedValue({ id: 2 });
    render(<TestFeedbackExpanded />);
    const button = screen.getByTestId("feedback-expanded-submit");
    const checkbox = screen.getByTestId(`checkbox-${options[0]}`);
    fireEvent.click(checkbox);
    fireEvent.click(button);
    expect(api.sendFeedback).toHaveBeenCalled();
  });

  it("onClick for submit button sets error with no feedback", () => {
    render(<TestFeedbackExpanded />);
    const button = screen.getByTestId("feedback-expanded-submit");
    fireEvent.click(button);
    const errorMessage = screen.getByText(
      "Provide feedback in order to submit",
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("handles character limit exceeded", () => {
    render(<TestFeedbackExpanded />);
    const textarea = screen.getByTestId("feedback-detail-textarea");
    const longText = "a".repeat(1001);
    fireEvent.change(textarea, { target: { value: longText } });

    const button = screen.getByTestId("feedback-expanded-submit");
    fireEvent.click(button);

    expect(api.sendFeedback).not.toHaveBeenCalled();
  });

  it("handles sendFeedback failure", async () => {
    (api.sendFeedback as jest.Mock).mockResolvedValue(null);
    render(<TestFeedbackExpanded />);

    const checkbox = screen.getByTestId(`checkbox-${options[0]}`);
    fireEvent.click(checkbox);

    const button = screen.getByTestId("feedback-expanded-submit");
    fireEvent.click(button);

    await screen.findByText(
      "We can't save your feedback, please try again later",
    );
  });
});
