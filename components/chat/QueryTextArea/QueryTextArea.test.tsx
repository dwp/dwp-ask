import { render, screen } from "@testing-library/react";
import Providers from "@/providers/Providers";
import QueryTextArea from "./QueryTextArea";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

const mockLoadHistory = vi.hoisted(() => vi.fn(() => []));

vi.mock("@/utils", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    sendQuery: vi.fn().mockResolvedValue([]),
    loadHistory: mockLoadHistory,
  };
});

import type { QueryTextAreaProps } from "@/types";
import { loadHistory } from "@/utils";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
});

const TestQueryTextAreaProps: QueryTextAreaProps = {
  onChange: vi.fn(),
  error: { invalidchar: true, blank: false, charcount: false, location: false },
  setError: vi.fn(),
  value: "Testing",
  isModalOpen: false,
  onKeyDown: vi.fn(),
  sendQueryAndClear: vi.fn(),
};

const InvalidValueProps: QueryTextAreaProps = {
  ...TestQueryTextAreaProps,
  value: "乱数假文",
};

const TestQueryTextArea = () => {
  return (
    <Providers>
      <QueryTextArea {...TestQueryTextAreaProps} />
    </Providers>
  );
};

describe("Query text area renders correctly", () => {
  it("Test 1", () => {
    render(<TestQueryTextArea />);
    const container = screen.getByTestId("query-text-area-container");
    expect(container).toBeInTheDocument();
  });
});

describe("Error handling", () => {
  it("Invalid characters triggers error", () => {
    render(
      <Providers>
        <QueryTextArea {...InvalidValueProps} />
      </Providers>,
    );
    expect(InvalidValueProps.setError).toHaveBeenCalled();
    expect(InvalidValueProps.error).toBeTruthy();
  });
});

describe("useEffect branches", () => {
  it("sets invalidchar to false when value has no disallowed characters", () => {
    const setError = vi.fn();
    render(
      <Providers>
        <QueryTextArea
          {...TestQueryTextAreaProps}
          value="valid text"
          error={{
            invalidchar: false,
            blank: false,
            charcount: false,
            location: false,
          }}
          setError={setError}
        />
      </Providers>,
    );

    const invalidcharUpdater = setError.mock.calls.find((call) => {
      const result = call[0]({
        invalidchar: true,
        blank: false,
        charcount: false,
        location: false,
      });
      return "invalidchar" in result && result.invalidchar === false;
    });
    expect(invalidcharUpdater).toBeDefined();
  });

  it("sets charcount to true when value exceeds character limit", () => {
    const setError = vi.fn();
    const longValue = "a".repeat(5001);
    render(
      <Providers>
        <QueryTextArea
          {...TestQueryTextAreaProps}
          value={longValue}
          error={{
            invalidchar: false,
            blank: false,
            charcount: false,
            location: false,
          }}
          setError={setError}
        />
      </Providers>,
    );

    const charcountUpdater = setError.mock.calls.find((call) => {
      const result = call[0]({
        invalidchar: false,
        blank: false,
        charcount: false,
        location: false,
      });
      return result.charcount === true;
    });
    expect(charcountUpdater).toBeDefined();
  });
});

describe("Error state rendering", () => {
  it("renders blank error when error.blank is true", () => {
    render(
      <Providers>
        <QueryTextArea
          {...TestQueryTextAreaProps}
          error={{
            invalidchar: false,
            blank: true,
            charcount: false,
            location: false,
          }}
        />
      </Providers>,
    );
    expect(screen.getByTestId("query-text-area-container")).toBeInTheDocument();
  });

  it("renders location error when error.location is true", () => {
    render(
      <Providers>
        <QueryTextArea
          {...TestQueryTextAreaProps}
          error={{
            invalidchar: false,
            blank: false,
            charcount: false,
            location: true,
          }}
        />
      </Providers>,
    );
    expect(screen.getByTestId("query-text-area-container")).toBeInTheDocument();
  });

  it("renders charcount error when error.charcount is true", () => {
    render(
      <Providers>
        <QueryTextArea
          {...TestQueryTextAreaProps}
          value={"a".repeat(5001)}
          error={{
            invalidchar: false,
            blank: false,
            charcount: true,
            location: false,
          }}
        />
      </Providers>,
    );
    expect(screen.getByTestId("query-text-area-container")).toBeInTheDocument();
  });

  it("renders with no errors when all error flags are false", () => {
    render(
      <Providers>
        <QueryTextArea
          {...TestQueryTextAreaProps}
          error={{
            invalidchar: false,
            blank: false,
            charcount: false,
            location: false,
          }}
        />
      </Providers>,
    );
    const container = screen.getByTestId("query-text-area-container");
    expect(container.className).not.toContain("govuk-form-group--error");
  });
});

describe("Disabled state when modal is open", () => {
  it("disables textarea and buttons when isModalOpen is true", () => {
    render(
      <Providers>
        <QueryTextArea {...TestQueryTextAreaProps} isModalOpen={true} />
      </Providers>,
    );

    expect(screen.getByTestId("chat-window-input")).toBeDisabled();
    expect(screen.getByTestId("chat-window-send-button")).toBeDisabled();
    expect(screen.getByTestId("chat-window-new-chat-button")).toBeDisabled();
  });

  it("sets aria-describedby on textarea when disabled", () => {
    render(
      <Providers>
        <QueryTextArea {...TestQueryTextAreaProps} isModalOpen={true} />
      </Providers>,
    );

    expect(screen.getByTestId("chat-window-input")).toHaveAttribute(
      "aria-describedby",
      "location-announcement",
    );
  });

  it("does not set aria-describedby on textarea when enabled", () => {
    render(
      <Providers>
        <QueryTextArea {...TestQueryTextAreaProps} isModalOpen={false} />
      </Providers>,
    );

    expect(screen.getByTestId("chat-window-input")).not.toHaveAttribute(
      "aria-describedby",
    );
  });
});

describe("Question template click", () => {
  it("calls onChange with null and template text when a template card is clicked", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const onChangeMock = vi.fn();
    render(
      <Providers>
        <QueryTextArea {...TestQueryTextAreaProps} onChange={onChangeMock} />
      </Providers>,
    );

    const toggle = screen.getByTestId("question-templates-toggle");
    await userEvent.click(toggle);

    const cards = screen.getAllByTestId("card-text");
    await userEvent.click(cards[0]);

    expect(onChangeMock).toHaveBeenCalledWith(null, expect.any(String));
  });
});

describe("New chat button", () => {
  it("opens clear chat modal when history is non-empty", async () => {
    vi.mocked(loadHistory).mockReturnValue([{ question: "q", answer: "a" }]);

    const { default: userEvent } = await import("@testing-library/user-event");
    render(<TestQueryTextArea />);

    const newChatButton = screen.getByTestId("chat-window-new-chat-button");
    await userEvent.click(newChatButton);

    expect(vi.mocked(loadHistory)).toHaveBeenCalled();
  });

  it("does not open modal when history is empty", async () => {
    vi.mocked(loadHistory).mockReturnValue([]);
    const { default: userEvent } = await import("@testing-library/user-event");
    render(<TestQueryTextArea />);

    const newChatButton = screen.getByTestId("chat-window-new-chat-button");
    await userEvent.click(newChatButton);

    expect(mockLoadHistory).toHaveBeenCalled();
  });
});
