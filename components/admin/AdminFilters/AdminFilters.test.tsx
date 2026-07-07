import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Dispatch, SetStateAction } from "react";
import { describe, expect, it, vi } from "vitest";
import { FILTER_IDS } from "@/constants/Ids";
import type { AdminFiltersProps, AdminFiltersState, DateParts } from "@/types";
import AdminFilters from "./AdminFilters";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/components", () => ({
  AccordionFilterItem: ({
    title,
    children,
    openByDefault,
  }: {
    title: string;
    children: React.ReactNode;
    openByDefault?: boolean;
  }) => (
    <div
      data-testid={`accordion-filter-item-${title.toLowerCase().replace(/\s+/g, "-")}`}
      data-open-by-default={openByDefault}
    >
      <span>{title}</span>
      {children}
    </div>
  ),

  SectionBreak: ({ visible, level }: { visible: boolean; level: string }) => (
    <hr data-testid="section-break" data-visible={visible} data-level={level} />
  ),

  ErrorFormGroup: ({
    children,
    error,
    errorMessage,
    errorId,
  }: {
    children: React.ReactNode;
    error: boolean;
    errorMessage: string;
    errorId: string;
  }) => (
    <div data-testid={`error-form-group-${errorId}`} data-error={error}>
      {error && (
        <span data-testid={`error-message-${errorId}`}>{errorMessage}</span>
      )}
      {children}
    </div>
  ),

  DateFilters: ({
    from,
    to,
    onDateChange,
  }: {
    from: DateParts;
    to: DateParts;
    onDateChange: (e: DateParts, source: "from" | "to") => void;
  }) => (
    <div data-testid="date-filters">
      <button
        data-testid="date-filters-change-from"
        onClick={() =>
          onDateChange({ day: "01", month: "01", year: "2024" }, "from")
        }
      >
        Change From
      </button>
      <button
        data-testid="date-filters-change-to"
        onClick={() =>
          onDateChange({ day: "31", month: "12", year: "2024" }, "to")
        }
      >
        Change To
      </button>
      <span data-testid="date-filters-from-value">{JSON.stringify(from)}</span>
      <span data-testid="date-filters-to-value">{JSON.stringify(to)}</span>
    </div>
  ),

  TopicFilters: ({
    topicList,
    topicsSelected,
  }: {
    topicList: AdminFiltersProps["topicList"];
    topicsSelected: AdminFiltersProps["adminFilters"]["topics"];
    setTopicsSelected: Dispatch<SetStateAction<AdminFiltersState>>;
  }) => (
    <div
      data-testid="topic-filters"
      data-topic-count={topicList.length}
      data-topics-selected={JSON.stringify(topicsSelected)}
    />
  ),

  FeedbackFilters: ({
    feedbackFilters,
  }: {
    feedbackFilters: AdminFiltersState["feedback"]["values"];
    setFeedbackFilters: Dispatch<SetStateAction<AdminFiltersState>>;
  }) => (
    <div
      data-testid="feedback-filters"
      data-feedback-count={feedbackFilters.length}
    />
  ),

  Button: ({
    children,
    onClick,
    "data-testid": testId,
    "aria-label": ariaLabel,
    buttonColour,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    "data-testid"?: string;
    "aria-label"?: string;
    buttonColour?: string;
  }) => (
    <button
      data-testid={testId}
      aria-label={ariaLabel}
      data-colour={buttonColour}
      onClick={onClick}
    >
      {children}
    </button>
  ),

  Link: ({
    children,
    onClick,
    className,
    tabIndex,
    "data-testid": testId,
    "aria-label": ariaLabel,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    tabIndex?: number;
    "data-testid"?: string;
    "aria-label"?: string;
  }) => (
    <a
      data-testid={testId}
      aria-label={ariaLabel}
      className={className}
      tabIndex={tabIndex}
      onClick={onClick}
    >
      {children}
    </a>
  ),
}));

vi.mock("@/constants/Ids", () => ({
  FILTER_IDS: { admin: "filter-admin-id" },
}));

vi.mock("@/constants/Colours", () => ({
  GDS_COLOURS: { BLUE: "blue" },
}));

vi.mock("@/constants/Filters", () => ({
  INITIAL_ADMIN_FILTERS: {
    date: {
      errorText: "",
      from: { day: "", month: "", year: "" },
      to: { day: "", month: "", year: "" },
    },
    topics: { errorText: "", inScope: [], outOfScope: "" },
    feedback: { values: [], errorText: "" },
  },
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const defaultFrom: DateParts = { day: "01", month: "06", year: "2023" };
const defaultTo: DateParts = { day: "30", month: "06", year: "2023" };

const defaultAdminFilters: AdminFiltersState = {
  date: { errorText: "", from: defaultFrom, to: defaultTo },
  topics: { errorText: "", inScope: [], outOfScope: "" },
  feedback: { values: [], errorText: "" },
  applied: false,
};

const defaultTopicList: AdminFiltersProps["topicList"] = [
  { id: 1, name: "housing", category: "in_scope" },
  { id: 2, name: "legacy-benefits", category: "out_of_scope" },
];

function renderAdminFilters(
  adminFilters: AdminFiltersState = defaultAdminFilters,
  setAdminFilters: AdminFiltersProps["setAdminFilters"] = vi.fn() as unknown as AdminFiltersProps["setAdminFilters"],
  handleReset: AdminFiltersProps["handleReset"] = vi.fn() as unknown as AdminFiltersProps["handleReset"],
  handleApply: AdminFiltersProps["handleApply"] = vi.fn() as unknown as AdminFiltersProps["handleApply"],
  topicList: AdminFiltersProps["topicList"] = defaultTopicList,
) {
  render(
    <AdminFilters
      adminFilters={adminFilters}
      setAdminFilters={setAdminFilters}
      handleReset={handleReset}
      handleApply={handleApply}
      topicList={topicList}
    />,
  );

  return { setAdminFilters, handleReset, handleApply };
}

function applyUpdater(
  setAdminFilters: AdminFiltersProps["setAdminFilters"],
  currentState: AdminFiltersState,
): AdminFiltersState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mock = setAdminFilters as any;
  const updater = mock.mock.calls[0][0];
  return updater(currentState);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AdminFilters", () => {
  describe("rendering", () => {
    it("renders the outer container with the correct id", () => {
      renderAdminFilters();

      expect(screen.getByTestId("admin-filters")).toHaveAttribute(
        "id",
        FILTER_IDS.admin,
      );
    });

    it("renders the top-level 'Filter your results' accordion", () => {
      renderAdminFilters();

      expect(
        screen.getByTestId("accordion-filter-item-filter-your-results"),
      ).toBeInTheDocument();
    });

    it("opens the top-level accordion by default", () => {
      renderAdminFilters();

      expect(
        screen.getByTestId("accordion-filter-item-filter-your-results"),
      ).toHaveAttribute("data-open-by-default", "true");
    });

    it("renders the Date accordion open by default", () => {
      renderAdminFilters();

      expect(screen.getByTestId("accordion-filter-item-date")).toHaveAttribute(
        "data-open-by-default",
        "true",
      );
    });

    it("renders the Question topics accordion", () => {
      renderAdminFilters();

      expect(
        screen.getByTestId("accordion-filter-item-question-topics"),
      ).toBeInTheDocument();
    });

    it("renders the Feedback accordion", () => {
      renderAdminFilters();

      expect(
        screen.getByTestId("accordion-filter-item-feedback"),
      ).toBeInTheDocument();
    });

    it("renders the DateFilters component", () => {
      renderAdminFilters();

      expect(screen.getByTestId("date-filters")).toBeInTheDocument();
    });

    it("renders the TopicFilters component", () => {
      renderAdminFilters();

      expect(screen.getByTestId("topic-filters")).toBeInTheDocument();
    });

    it("renders the FeedbackFilters component", () => {
      renderAdminFilters();

      expect(screen.getByTestId("feedback-filters")).toBeInTheDocument();
    });

    it("renders the buttons container", () => {
      renderAdminFilters();

      expect(
        screen.getByTestId("admin-filters-buttons-container"),
      ).toBeInTheDocument();
    });

    it("renders the Apply button with correct aria-label", () => {
      renderAdminFilters();

      expect(screen.getByTestId("admin-filters-apply-button")).toHaveAttribute(
        "aria-label",
        "Apply",
      );
    });

    it("renders the Reset link with correct aria-label", () => {
      renderAdminFilters();

      expect(screen.getByTestId("admin-filters-reset-link")).toHaveAttribute(
        "aria-label",
        "Reset",
      );
    });

    it("applies govuk-link class to the Reset link", () => {
      renderAdminFilters();

      expect(screen.getByTestId("admin-filters-reset-link")).toHaveClass(
        "govuk-link",
      );
    });

    it("sets tabIndex=0 on the Reset link", () => {
      renderAdminFilters();

      expect(screen.getByTestId("admin-filters-reset-link")).toHaveAttribute(
        "tabindex",
        "0",
      );
    });

    it("passes GDS blue colour to the Apply button", () => {
      renderAdminFilters();

      expect(screen.getByTestId("admin-filters-apply-button")).toHaveAttribute(
        "data-colour",
        "blue",
      );
    });
  });

  describe("props forwarding", () => {
    it("passes date.from to DateFilters", () => {
      renderAdminFilters();

      expect(screen.getByTestId("date-filters-from-value")).toHaveTextContent(
        JSON.stringify(defaultFrom),
      );
    });

    it("passes date.to to DateFilters", () => {
      renderAdminFilters();

      expect(screen.getByTestId("date-filters-to-value")).toHaveTextContent(
        JSON.stringify(defaultTo),
      );
    });

    it("passes topicList to TopicFilters", () => {
      renderAdminFilters();

      expect(screen.getByTestId("topic-filters")).toHaveAttribute(
        "data-topic-count",
        String(defaultTopicList.length),
      );
    });

    it("passes topics to TopicFilters as topicsSelected", () => {
      renderAdminFilters();

      expect(screen.getByTestId("topic-filters")).toHaveAttribute(
        "data-topics-selected",
        JSON.stringify(defaultAdminFilters.topics),
      );
    });

    it("passes feedback.values to FeedbackFilters", () => {
      renderAdminFilters();

      expect(screen.getByTestId("feedback-filters")).toHaveAttribute(
        "data-feedback-count",
        "0",
      );
    });
  });

  describe("ErrorFormGroup — date", () => {
    it("renders with error=false when date errorText matches initial", () => {
      renderAdminFilters();

      expect(
        screen.getByTestId(
          "error-form-group-admin-filters-invalid-dates-error",
        ),
      ).toHaveAttribute("data-error", "false");
    });

    it("renders with error=true when date errorText differs from initial", () => {
      renderAdminFilters({
        ...defaultAdminFilters,
        date: { ...defaultAdminFilters.date, errorText: "Invalid date" },
      });

      expect(
        screen.getByTestId(
          "error-form-group-admin-filters-invalid-dates-error",
        ),
      ).toHaveAttribute("data-error", "true");
    });

    it("displays the date error message when there is an error", () => {
      renderAdminFilters({
        ...defaultAdminFilters,
        date: { ...defaultAdminFilters.date, errorText: "Invalid date" },
      });

      expect(
        screen.getByTestId("error-message-admin-filters-invalid-dates-error"),
      ).toHaveTextContent("Invalid date");
    });

    it("does not display a date error message when there is no error", () => {
      renderAdminFilters();

      expect(
        screen.queryByTestId("error-message-admin-filters-invalid-dates-error"),
      ).not.toBeInTheDocument();
    });
  });

  describe("ErrorFormGroup — topics", () => {
    it("renders with error=false when topics errorText matches initial", () => {
      renderAdminFilters();

      expect(
        screen.getByTestId(
          "error-form-group-admin-filters-invalid-topics-error",
        ),
      ).toHaveAttribute("data-error", "false");
    });

    it("renders with error=true when topics errorText differs from initial", () => {
      renderAdminFilters({
        ...defaultAdminFilters,
        topics: { ...defaultAdminFilters.topics, errorText: "Invalid topic" },
      });

      expect(
        screen.getByTestId(
          "error-form-group-admin-filters-invalid-topics-error",
        ),
      ).toHaveAttribute("data-error", "true");
    });

    it("displays the topics error message when there is an error", () => {
      renderAdminFilters({
        ...defaultAdminFilters,
        topics: { ...defaultAdminFilters.topics, errorText: "Invalid topic" },
      });

      expect(
        screen.getByTestId("error-message-admin-filters-invalid-topics-error"),
      ).toHaveTextContent("Invalid topic");
    });

    it("does not display a topics error message when there is no error", () => {
      renderAdminFilters();

      expect(
        screen.queryByTestId(
          "error-message-admin-filters-invalid-topics-error",
        ),
      ).not.toBeInTheDocument();
    });
  });

  describe("onDateChange — from", () => {
    it("calls setAdminFilters when the from date changes", async () => {
      const setAdminFilters =
        vi.fn() as unknown as AdminFiltersProps["setAdminFilters"];
      renderAdminFilters(defaultAdminFilters, setAdminFilters);

      await userEvent.click(screen.getByTestId("date-filters-change-from"));

      expect(vi.mocked(setAdminFilters)).toHaveBeenCalledTimes(1);
    });

    it("updates date.from while preserving other date fields", async () => {
      const setAdminFilters =
        vi.fn() as unknown as AdminFiltersProps["setAdminFilters"];
      renderAdminFilters(defaultAdminFilters, setAdminFilters);

      await userEvent.click(screen.getByTestId("date-filters-change-from"));

      const next = applyUpdater(setAdminFilters, defaultAdminFilters);

      expect(next.date.from).toEqual({ day: "01", month: "01", year: "2024" });
      expect(next.date.to).toEqual(defaultTo);
      expect(next.date.errorText).toBe("");
    });

    it("preserves topics and feedback state when from date changes", async () => {
      const setAdminFilters =
        vi.fn() as unknown as AdminFiltersProps["setAdminFilters"];
      renderAdminFilters(defaultAdminFilters, setAdminFilters);

      await userEvent.click(screen.getByTestId("date-filters-change-from"));

      const next = applyUpdater(setAdminFilters, defaultAdminFilters);

      expect(next.topics).toEqual(defaultAdminFilters.topics);
      expect(next.feedback).toEqual(defaultAdminFilters.feedback);
    });
  });

  describe("onDateChange — to", () => {
    it("calls setAdminFilters when the to date changes", async () => {
      const setAdminFilters =
        vi.fn() as unknown as AdminFiltersProps["setAdminFilters"];
      renderAdminFilters(defaultAdminFilters, setAdminFilters);

      await userEvent.click(screen.getByTestId("date-filters-change-to"));

      expect(vi.mocked(setAdminFilters)).toHaveBeenCalledTimes(1);
    });

    it("updates date.to while preserving other date fields", async () => {
      const setAdminFilters =
        vi.fn() as unknown as AdminFiltersProps["setAdminFilters"];
      renderAdminFilters(defaultAdminFilters, setAdminFilters);

      await userEvent.click(screen.getByTestId("date-filters-change-to"));

      const next = applyUpdater(setAdminFilters, defaultAdminFilters);

      expect(next.date.to).toEqual({ day: "31", month: "12", year: "2024" });
      expect(next.date.from).toEqual(defaultFrom);
      expect(next.date.errorText).toBe("");
    });

    it("preserves topics and feedback state when to date changes", async () => {
      const setAdminFilters =
        vi.fn() as unknown as AdminFiltersProps["setAdminFilters"];
      renderAdminFilters(defaultAdminFilters, setAdminFilters);

      await userEvent.click(screen.getByTestId("date-filters-change-to"));

      const next = applyUpdater(setAdminFilters, defaultAdminFilters);

      expect(next.topics).toEqual(defaultAdminFilters.topics);
      expect(next.feedback).toEqual(defaultAdminFilters.feedback);
    });
  });

  describe("button interactions", () => {
    it("calls handleApply when the Apply button is clicked", async () => {
      const handleApply =
        vi.fn() as unknown as AdminFiltersProps["handleApply"];
      renderAdminFilters(
        defaultAdminFilters,
        undefined as unknown as AdminFiltersProps["setAdminFilters"],
        undefined as unknown as AdminFiltersProps["handleReset"],
        handleApply,
      );

      await userEvent.click(screen.getByTestId("admin-filters-apply-button"));

      expect(vi.mocked(handleApply)).toHaveBeenCalledTimes(1);
    });

    it("calls handleReset when the Reset link is clicked", async () => {
      const handleReset =
        vi.fn() as unknown as AdminFiltersProps["handleReset"];
      renderAdminFilters(
        defaultAdminFilters,
        undefined as unknown as AdminFiltersProps["setAdminFilters"],
        handleReset,
      );

      await userEvent.click(screen.getByTestId("admin-filters-reset-link"));

      expect(vi.mocked(handleReset)).toHaveBeenCalledTimes(1);
    });

    it("does not call handleApply on render", () => {
      const { handleApply } = renderAdminFilters();

      expect(vi.mocked(handleApply)).not.toHaveBeenCalled();
    });

    it("does not call handleReset on render", () => {
      const { handleReset } = renderAdminFilters();

      expect(vi.mocked(handleReset)).not.toHaveBeenCalled();
    });
  });
});
