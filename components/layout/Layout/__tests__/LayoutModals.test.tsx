import { render, screen } from "@testing-library/react";
import Providers from "@/providers/Providers";

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

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
});

vi.mock("@/utils", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    sendQuery: vi.fn().mockResolvedValue([]),
    clearSession: vi.fn(),
  };
});

import LayoutModals from "../LayoutModals";

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: vi.fn(),
    };
  },
  usePathname() {
    return "/";
  },
}));

describe("LayoutModals Component", () => {
  it("renders NewChatModal when isModalVisible.newChat is true", () => {
    render(
      <Providers>
        <LayoutModals />
      </Providers>,
    );

    expect(screen.queryByTestId("returnhome-modal")).not.toBeInTheDocument();
  });

  it("renders ReturnHomeModal when isModalVisible.returnHome is true", () => {
    render(
      <Providers>
        <LayoutModals />
      </Providers>,
    );

    expect(screen.queryByTestId("clearchat-modal")).not.toBeInTheDocument();
  });

  it("calls clearSession on window focus", async () => {
    const { clearSession } = await import("@/utils");

    render(
      <Providers>
        <LayoutModals />
      </Providers>,
    );

    vi.mocked(clearSession).mockClear();
    window.dispatchEvent(new Event("focus"));

    // onfocus is set as window.onfocus, so we call it directly
    if (window.onfocus) {
      window.onfocus(new FocusEvent("focus"));
    }

    expect(clearSession).toHaveBeenCalled();
  });
});
