import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Dispatch, SetStateAction } from "react";
import { describe, expect, it, vi } from "vitest";
import { FILTER_IDS } from "@/constants/Ids";
import type { ChatFiltersState, DateParts } from "@/types";
import ChatFilters from "./ChatFilters";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/components", () => ({
  Title: ({
    children,
    "data-testid": testId,
  }: {
    children: React.ReactNode;
    "data-testid"?: string;
  }) => <h3 data-testid={testId}>{children}</h3>,

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
    <div
      data-testid="error-form-group"
      data-error={error}
      data-error-id={errorId}
    >
      {error && <span data-testid="error-message">{errorMessage}</span>}
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
  FILTER_IDS: { chat: "filter-chat-id" },
}));

vi.mock("@/constants/Colours", () => ({
  GDS_COLOURS: { BLUE: "blue" },
}));

vi.mock("@/constants/Filters", () => ({
  INITIAL_CHAT_FILTERS: {
    date: {
      errorText: "",
      from: { day: "", month: "", year: "" },
      to: { day: "", month: "", year: "" },
    },
  },
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const defaultFrom: DateParts = { day: "01", month: "06", year: "2023" };
const defaultTo: DateParts = { day: "30", month: "06", year: "2023" };

const defaultChatFilters: ChatFiltersState = {
  date: {
    errorText: "",
    from: defaultFrom,
    to: defaultTo,
  },
};

function renderChatFilters(
  overrides: Partial<{
    chatFilters: ChatFiltersState;
    setChatFilters: Dispatch<SetStateAction<ChatFiltersState>>;
    handleReset: () => void;
    handleApply: () => Promise<void>;
  }> = {},
) {
  const setChatFilters = overrides.setChatFilters ?? vi.fn();
  const handleReset = overrides.handleReset ?? vi.fn();
  const handleApply = overrides.handleApply ?? vi.fn();
  const chatFilters = overrides.chatFilters ?? defaultChatFilters;

  render(
    <ChatFilters
      chatFilters={chatFilters}
      setChatFilters={setChatFilters}
      handleReset={handleReset}
      handleApply={handleApply}
    />,
  );

  return { setChatFilters, handleReset, handleApply };
}

function applyUpdater(
  setChatFilters: Dispatch<SetStateAction<ChatFiltersState>>,
  currentState: ChatFiltersState,
): ChatFiltersState {
  const mock = setChatFilters as any;
  const updater = mock.mock.calls[0][0];
  return updater(currentState);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ChatFilters", () => {
  describe("rendering", () => {
    it("renders the outer container with the correct id", () => {
      renderChatFilters();

      expect(screen.getByTestId("chat-filters")).toHaveAttribute(
        "id",
        FILTER_IDS.chat,
      );
    });

    it("renders the Filter heading", () => {
      renderChatFilters();

      expect(screen.getByTestId("chat-history-filter-label")).toHaveTextContent(
        "Filter",
      );
    });

    it("renders the DateFilters component", () => {
      renderChatFilters();

      expect(screen.getByTestId("date-filters")).toBeInTheDocument();
    });

    it("renders the buttons container", () => {
      renderChatFilters();

      expect(
        screen.getByTestId("chat-filters-buttons-container"),
      ).toBeInTheDocument();
    });

    it("renders the Apply button with correct aria-label", () => {
      renderChatFilters();

      expect(screen.getByTestId("chat-filters-apply-button")).toHaveAttribute(
        "aria-label",
        "Apply",
      );
    });

    it("renders the Reset link with correct aria-label", () => {
      renderChatFilters();

      expect(screen.getByTestId("chat-filters-reset-link")).toHaveAttribute(
        "aria-label",
        "Reset",
      );
    });

    it("applies govuk-link class to the Reset link", () => {
      renderChatFilters();

      expect(screen.getByTestId("chat-filters-reset-link")).toHaveClass(
        "govuk-link",
      );
    });

    it("sets tabIndex=0 on the Reset link", () => {
      renderChatFilters();

      expect(screen.getByTestId("chat-filters-reset-link")).toHaveAttribute(
        "tabindex",
        "0",
      );
    });

    it("passes the GDS blue colour to the Apply button", () => {
      renderChatFilters();

      expect(screen.getByTestId("chat-filters-apply-button")).toHaveAttribute(
        "data-colour",
        "blue",
      );
    });
  });

  describe("DateFilters props", () => {
    it("passes date.from to DateFilters", () => {
      renderChatFilters();

      expect(screen.getByTestId("date-filters-from-value")).toHaveTextContent(
        JSON.stringify(defaultFrom),
      );
    });

    it("passes date.to to DateFilters", () => {
      renderChatFilters();

      expect(screen.getByTestId("date-filters-to-value")).toHaveTextContent(
        JSON.stringify(defaultTo),
      );
    });
  });

  describe("ErrorFormGroup", () => {
    it("renders with error=false when errorText matches the initial value", () => {
      renderChatFilters();

      expect(screen.getByTestId("error-form-group")).toHaveAttribute(
        "data-error",
        "false",
      );
    });

    it("renders with error=true when errorText differs from the initial value", () => {
      renderChatFilters({
        chatFilters: {
          date: { ...defaultChatFilters.date, errorText: "Invalid date range" },
        },
      });

      expect(screen.getByTestId("error-form-group")).toHaveAttribute(
        "data-error",
        "true",
      );
    });

    it("displays the error message when there is an error", () => {
      renderChatFilters({
        chatFilters: {
          date: { ...defaultChatFilters.date, errorText: "Invalid date range" },
        },
      });

      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Invalid date range",
      );
    });

    it("does not display an error message when there is no error", () => {
      renderChatFilters();

      expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    });

    it("passes the correct errorId to ErrorFormGroup", () => {
      renderChatFilters();

      expect(screen.getByTestId("error-form-group")).toHaveAttribute(
        "data-error-id",
        "chat-filters-invalid-dates-error",
      );
    });
  });

  describe("onDateChange — from", () => {
    it("calls setChatFilters when the from date changes", async () => {
      const { setChatFilters } = renderChatFilters();

      await userEvent.click(screen.getByTestId("date-filters-change-from"));

      expect(setChatFilters).toHaveBeenCalledTimes(1);
    });

    it("updates date.from while preserving other date fields", async () => {
      const { setChatFilters } = renderChatFilters();

      await userEvent.click(screen.getByTestId("date-filters-change-from"));

      const next = applyUpdater(setChatFilters, defaultChatFilters);

      expect(next.date.from).toEqual({ day: "01", month: "01", year: "2024" });
      expect(next.date.to).toEqual(defaultTo);
      expect(next.date.errorText).toBe("");
    });
  });

  describe("onDateChange — to", () => {
    it("calls setChatFilters when the to date changes", async () => {
      const { setChatFilters } = renderChatFilters();

      await userEvent.click(screen.getByTestId("date-filters-change-to"));

      expect(setChatFilters).toHaveBeenCalledTimes(1);
    });

    it("updates date.to while preserving other date fields", async () => {
      const { setChatFilters } = renderChatFilters();

      await userEvent.click(screen.getByTestId("date-filters-change-to"));

      const next = applyUpdater(setChatFilters, defaultChatFilters);

      expect(next.date.to).toEqual({ day: "31", month: "12", year: "2024" });
      expect(next.date.from).toEqual(defaultFrom);
      expect(next.date.errorText).toBe("");
    });
  });

  describe("button interactions", () => {
    it("calls handleApply when the Apply button is clicked", async () => {
      const { handleApply } = renderChatFilters();

      await userEvent.click(screen.getByTestId("chat-filters-apply-button"));

      expect(handleApply).toHaveBeenCalledTimes(1);
    });

    it("calls handleReset when the Reset link is clicked", async () => {
      const { handleReset } = renderChatFilters();

      await userEvent.click(screen.getByTestId("chat-filters-reset-link"));

      expect(handleReset).toHaveBeenCalledTimes(1);
    });

    it("does not call handleApply on render", () => {
      const { handleApply } = renderChatFilters();

      expect(handleApply).not.toHaveBeenCalled();
    });

    it("does not call handleReset on render", () => {
      const { handleReset } = renderChatFilters();

      expect(handleReset).not.toHaveBeenCalled();
    });
  });
});
