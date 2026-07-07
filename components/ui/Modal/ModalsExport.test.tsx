import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Providers from "@/providers/Providers";

const mockPush = vi.fn();
const mockClearHistory = vi.hoisted(() => vi.fn());

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

vi.mock("@/utils", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    sendQuery: vi.fn().mockResolvedValue([]),
    clearHistory: mockClearHistory,
  };
});

import { NewChatModal, ReturnHomeModal } from "./ModalsExport";

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
  usePathname() {
    return "/";
  },
}));

describe("ReturnHomeModal", () => {
  it("renders correctly", () => {
    render(
      <Providers>
        <ReturnHomeModal />
      </Providers>,
    );
    const modal = screen.getByTestId("modal-container");
    expect(modal).toBeInTheDocument();
  });

  it("calls clearHistory and router.push when confirm is clicked", async () => {
    render(
      <Providers>
        <ReturnHomeModal />
      </Providers>,
    );

    await userEvent.click(screen.getByTestId("modal-confirm-button"));

    expect(mockClearHistory).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});

describe("NewChatModal", () => {
  it("renders correctly", () => {
    render(
      <Providers>
        <NewChatModal />
      </Providers>,
    );
    const modal = screen.getByTestId("modal-container");
    expect(modal).toBeInTheDocument();
  });
});
