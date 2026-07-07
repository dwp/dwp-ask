import { render, screen } from "@testing-library/react";
import {
  mockComponents,
  mockNextNavigation,
  mockProviders,
} from "@/utils/test";
import Landing from "./Landing";

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
  vi.spyOn(console, "error").mockImplementation(() => vi.fn());
});

vi.mock("@/providers", () => mockProviders);
vi.mock("next/navigation", () => mockNextNavigation().mock());
vi.mock("@/components", () => mockComponents);

describe("Landing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // reset sessionStorage mock between tests to avoid leaking values
    Storage.prototype.getItem = vi.fn(() => "");
    Storage.prototype.setItem = vi.fn(() => "");
  });

  it("renders the landing container and heading", () => {
    render(<Landing />);
    expect(screen.getByTestId("landing-container")).toBeInTheDocument();
    expect(screen.getByTestId("landing-heading")).toBeInTheDocument();
  });

  it("clears history and sets location to null when startChat is called", () => {
    const { getByTestId } = render(<Landing />);
    const startChatButton = getByTestId("landing-start-chat-button");
    startChatButton.click();
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      "session_id",
      expect.any(String),
    );
  });
});
