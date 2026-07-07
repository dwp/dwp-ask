import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FEEDBACK_FILTERS } from "@/constants/Filters";
import { FILTER_IDS } from "@/constants/Ids";
import type { SentimentFilter } from "@/types";
import FeedbackFilters from "./FeedbackFilters";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/components", () => ({
  Checkbox: ({
    id,
    value,
    checked,
    onChange,
    "aria-label": ariaLabel,
    "aria-checked": ariaChecked,
  }: {
    id: string;
    value: string;
    checked: boolean;
    onChange: (e: { target: { value: string } }) => void;
    children: React.ReactNode;
    "aria-label"?: string;
    "aria-checked"?: boolean;
  }) => (
    <div data-testid={`checkbox-${id}`}>
      <input
        type="checkbox"
        id={id}
        value={value}
        checked={checked}
        aria-label={ariaLabel}
        aria-checked={ariaChecked}
        onChange={(e) => onChange({ target: { value: e.target.value } })}
      />
    </div>
  ),
}));

vi.mock("@/constants/Filters", () => ({
  FEEDBACK_FILTERS: [
    { id: "true", value: "true", label: "Positive" },
    { id: "false", value: "false", label: "Negative" },
    { id: "none", value: "none", label: "None" },
  ],
}));

vi.mock("@/constants/Ids", () => ({
  FILTER_IDS: { feedback: "filter-feedback-id" },
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

type FilterState = {
  feedback: { values: SentimentFilter[] };
};

function makeFilterState(values: SentimentFilter[] = []): FilterState {
  return { feedback: { values } };
}

function renderFeedbackFilters(
  feedbackFilters: SentimentFilter[] = [],
  setFeedbackFilters = vi.fn(),
) {
  return render(
    <FeedbackFilters
      feedbackFilters={feedbackFilters}
      setFeedbackFilters={setFeedbackFilters}
    />,
  );
}

// Captures the updater fn passed to setFeedbackFilters and runs it against state
function applyUpdater(
  setFeedbackFilters: ReturnType<typeof vi.fn>,
  currentState: FilterState,
): FilterState {
  const updater = setFeedbackFilters.mock.calls[0][0];
  return updater(currentState);
}

// Helper to get the <input> inside a checkbox wrapper
function getCheckboxInput(id: string) {
  return screen.getByTestId(`checkbox-${id}`).querySelector("input")!;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("FeedbackFilters", () => {
  describe("rendering", () => {
    it("renders the outer form group with the correct id", () => {
      const { container } = renderFeedbackFilters();

      const formGroup = container.querySelector(`#${FILTER_IDS.feedback}`);
      expect(formGroup).toBeInTheDocument();
    });

    it("applies govuk-form-group and mt-6 classes to the outer div", () => {
      const { container } = renderFeedbackFilters();

      const formGroup = container.firstChild as HTMLElement;
      expect(formGroup).toHaveClass("govuk-form-group", "mt-6");
    });

    it("renders a fieldset with aria-describedby='sentiment-hint'", () => {
      renderFeedbackFilters();

      const fieldset = document.querySelector("fieldset");
      expect(fieldset).toHaveAttribute("aria-describedby", "sentiment-hint");
    });

    it("renders the 'Feedback Type' label", () => {
      renderFeedbackFilters();

      expect(screen.getByText("Feedback Type")).toBeInTheDocument();
    });

    it("renders a checkbox wrapper for every entry in FEEDBACK_FILTERS", () => {
      renderFeedbackFilters();

      FEEDBACK_FILTERS.forEach((filter) => {
        expect(screen.getByTestId(`checkbox-${filter.id}`)).toBeInTheDocument();
      });
    });

    it("passes the correct value to each checkbox input", () => {
      renderFeedbackFilters();

      FEEDBACK_FILTERS.forEach((filter) => {
        expect(getCheckboxInput(filter.id)).toHaveAttribute(
          "value",
          filter.value,
        );
      });
    });

    it("passes the correct aria-label to each checkbox input", () => {
      renderFeedbackFilters();

      FEEDBACK_FILTERS.forEach((filter) => {
        expect(getCheckboxInput(filter.id)).toHaveAttribute(
          "aria-label",
          filter.label,
        );
      });
    });
  });

  describe("checked state", () => {
    it("renders all checkboxes unchecked when feedbackFilters is empty", () => {
      renderFeedbackFilters([]);

      FEEDBACK_FILTERS.forEach((filter) => {
        expect(getCheckboxInput(filter.id)).not.toBeChecked();
      });
    });

    it("renders a checkbox as checked when its value is in feedbackFilters", () => {
      renderFeedbackFilters(["true"] as SentimentFilter[]);

      expect(getCheckboxInput("true")).toBeChecked();
      expect(getCheckboxInput("false")).not.toBeChecked();
      expect(getCheckboxInput("none")).not.toBeChecked();
    });

    it("renders multiple checkboxes as checked when multiple values are active", () => {
      renderFeedbackFilters(["true", "false"] as SentimentFilter[]);

      expect(getCheckboxInput("true")).toBeChecked();
      expect(getCheckboxInput("false")).toBeChecked();
      expect(getCheckboxInput("none")).not.toBeChecked();
    });

    it("renders all checkboxes as checked when all values are active", () => {
      const allValues = FEEDBACK_FILTERS.map(
        (f) => f.value,
      ) as SentimentFilter[];
      renderFeedbackFilters(allValues);

      FEEDBACK_FILTERS.forEach((filter) => {
        expect(getCheckboxInput(filter.id)).toBeChecked();
      });
    });

    it("sets aria-checked consistently with checked", () => {
      renderFeedbackFilters(["true"] as SentimentFilter[]);

      expect(getCheckboxInput("true")).toHaveAttribute("aria-checked", "true");
      expect(getCheckboxInput("false")).toHaveAttribute(
        "aria-checked",
        "false",
      );
    });
  });

  describe("onChange — adding a value", () => {
    it("calls setFeedbackFilters when an unchecked checkbox is clicked", async () => {
      const setFeedbackFilters = vi.fn();
      renderFeedbackFilters([], setFeedbackFilters);

      await userEvent.click(getCheckboxInput("true"));

      expect(setFeedbackFilters).toHaveBeenCalledTimes(1);
    });

    it("adds the value to feedback.values when it does not already exist", async () => {
      const setFeedbackFilters = vi.fn();
      renderFeedbackFilters([], setFeedbackFilters);

      await userEvent.click(getCheckboxInput("true"));

      const next = applyUpdater(setFeedbackFilters, makeFilterState([]));
      expect(next.feedback.values).toContain("true");
    });

    it("preserves existing values when adding a new one", async () => {
      const setFeedbackFilters = vi.fn();
      renderFeedbackFilters(["false"] as SentimentFilter[], setFeedbackFilters);

      await userEvent.click(getCheckboxInput("true"));

      const next = applyUpdater(
        setFeedbackFilters,
        makeFilterState(["false"] as SentimentFilter[]),
      );
      expect(next.feedback.values).toContain("false");
      expect(next.feedback.values).toContain("true");
    });
  });

  describe("onChange — removing a value", () => {
    it("calls setFeedbackFilters when a checked checkbox is clicked", async () => {
      const setFeedbackFilters = vi.fn();
      renderFeedbackFilters(["true"] as SentimentFilter[], setFeedbackFilters);

      await userEvent.click(getCheckboxInput("true"));

      expect(setFeedbackFilters).toHaveBeenCalledTimes(1);
    });

    it("removes the value from feedback.values when it already exists", async () => {
      const setFeedbackFilters = vi.fn();
      renderFeedbackFilters(["true"] as SentimentFilter[], setFeedbackFilters);

      await userEvent.click(getCheckboxInput("true"));

      const next = applyUpdater(
        setFeedbackFilters,
        makeFilterState(["true"] as SentimentFilter[]),
      );
      expect(next.feedback.values).not.toContain("true");
    });

    it("does not affect other values when removing one", async () => {
      const setFeedbackFilters = vi.fn();
      renderFeedbackFilters(
        ["true", "false"] as SentimentFilter[],
        setFeedbackFilters,
      );

      await userEvent.click(getCheckboxInput("true"));

      const next = applyUpdater(
        setFeedbackFilters,
        makeFilterState(["true", "false"] as SentimentFilter[]),
      );
      expect(next.feedback.values).not.toContain("true");
      expect(next.feedback.values).toContain("false");
    });

    it("results in an empty array when the only active value is removed", async () => {
      const setFeedbackFilters = vi.fn();
      renderFeedbackFilters(["true"] as SentimentFilter[], setFeedbackFilters);

      await userEvent.click(getCheckboxInput("true"));

      const next = applyUpdater(
        setFeedbackFilters,
        makeFilterState(["true"] as SentimentFilter[]),
      );
      expect(next.feedback.values).toHaveLength(0);
    });
  });
});
