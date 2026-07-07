import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mocks
vi.mock("@/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/utils")>();
  return {
    ...actual,
    addHistory: vi.fn(),
    loadHistory: vi.fn(),
  };
});

vi.mock("@/providers/LocationProvider", () => ({
  useLocation: vi.fn(),
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  LocationProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("@/providers", () => ({
  useLocation: vi.fn(),
  useCitations: vi.fn(() => ({ citations: [], setCitations: vi.fn() })),
  useModal: vi.fn(() => ({ setModalVisible: vi.fn() })),
  useResponsive: vi.fn(() => ({ isSmallScreen: false })),
}));

vi.mock("@/components", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components")>();
  return {
    ...actual,
    Answer: () =>
      createElement("div", { "data-testid": "answer-stub" }, "AnswerStub"),
  };
});

import { useLocation } from "@/providers";
import Providers from "@/providers/Providers";
import { addHistory, loadHistory } from "@/utils";
import ChooseCountry from "../ChooseCountry";

describe("ChooseCountry", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders Answer and adds initial message when location is not set and history is empty", () => {
    vi.mocked(useLocation).mockReturnValue({
      location: null,
      setLocation: vi.fn(),
    });
    vi.mocked(loadHistory).mockReturnValue([]);

    const setLoadedChatHistory = vi.fn();
    const setTyping = vi.fn();

    render(
      <Providers>
        <ChooseCountry
          setLoadedChatHistory={setLoadedChatHistory}
          setTyping={setTyping}
        />
      </Providers>,
    );

    // Answer stub should be rendered
    expect(screen.getByTestId("answer-stub")).toBeInTheDocument();

    // setLoadedChatHistory should have been called with an updater function
    expect(setLoadedChatHistory).toHaveBeenCalled();
    const firstArg = vi.mocked(setLoadedChatHistory).mock.calls[0][0];
    expect(typeof firstArg).toBe("function");

    // When React executes the updater it should call addHistory and return the new array
    const returned = firstArg([]);
    expect(addHistory).toHaveBeenCalled();
    expect(Array.isArray(returned)).toBe(true);
  });

  it("returns prev when history is non-empty", () => {
    vi.mocked(useLocation).mockReturnValue({
      location: null,
      setLocation: vi.fn(),
    });
    vi.mocked(loadHistory).mockReturnValue([{ question: "q", answer: "a" }]);

    const setLoadedChatHistory = vi.fn();
    const setTyping = vi.fn();

    render(
      <Providers>
        <ChooseCountry
          setLoadedChatHistory={setLoadedChatHistory}
          setTyping={setTyping}
        />
      </Providers>,
    );

    const updater = vi.mocked(setLoadedChatHistory).mock.calls[0][0];
    const prev = [{ question: "existing", answer: "data" }];
    const returned = updater(prev);
    expect(returned).toBe(prev);
    expect(addHistory).not.toHaveBeenCalled();
  });

  it("renders nothing when a location is already set", () => {
    vi.mocked(useLocation).mockReturnValue({
      location: "England",
      setLocation: vi.fn(),
    });
    vi.mocked(loadHistory).mockReturnValue([]);

    const setLoadedChatHistory = vi.fn();
    const setTyping = vi.fn();

    const { container } = render(
      <Providers>
        <ChooseCountry
          setLoadedChatHistory={setLoadedChatHistory}
          setTyping={setTyping}
        />
      </Providers>,
    );

    // When a location exists, ChooseCountry returns an empty fragment
    expect(container).toBeTruthy();
    expect(screen.queryByTestId("answer-stub")).toBeNull();
  });
});
