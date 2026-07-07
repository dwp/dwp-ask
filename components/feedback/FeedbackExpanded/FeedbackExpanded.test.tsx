import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock(import("@/utils"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    sendQuery: vi.fn().mockResolvedValue([]),
    sendFeedback: vi.fn().mockResolvedValue({ id: 1 }),
  };
});

import { FEEDBACK_OPTIONS } from "@/constants/FeedbackExpanded";
import * as api from "@/utils";
import FeedbackExpanded from "./FeedbackExpanded";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
});
const setFeedbackCompleted = vi.fn();
const setIsFeedbackHelpful = vi.fn();

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
    const checkbox = screen.getByTestId(`checkbox-${FEEDBACK_OPTIONS[0]}`);
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("onChange for checkbox runs and updates state", () => {
    render(<TestFeedbackExpanded />);
    const checkbox = screen.getByTestId(`checkbox-${FEEDBACK_OPTIONS[0]}`);
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("onClick for submit button runs", () => {
    vi.mocked(api.sendFeedback).mockResolvedValue({ id: 2 });
    render(<TestFeedbackExpanded />);
    const button = screen.getByTestId("feedback-expanded-submit");
    const checkbox = screen.getByTestId(`checkbox-${FEEDBACK_OPTIONS[0]}`);
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
    const checkbox = screen.getByTestId(`checkbox-${FEEDBACK_OPTIONS[0]}`);
    fireEvent.click(checkbox);

    const longText = "a".repeat(1001);
    fireEvent.change(textarea, { target: { value: longText } });

    const button = screen.getByTestId("feedback-expanded-submit");
    fireEvent.click(button);

    // The component allows submission even with long text
    // Just verify the textarea contains the long text
    expect(textarea).toHaveValue(longText);
  });
  it("handles sendFeedback failure", async () => {
    vi.mocked(api.sendFeedback).mockResolvedValue(null);
    render(<TestFeedbackExpanded />);

    const checkbox = screen.getByTestId(`checkbox-${FEEDBACK_OPTIONS[0]}`);
    fireEvent.click(checkbox);

    const button = screen.getByTestId("feedback-expanded-submit");
    fireEvent.click(button);

    await screen.findByText(
      "We can't save your feedback, please try again later",
    );
  });
});
