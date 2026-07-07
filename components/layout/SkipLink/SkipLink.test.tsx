import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import Providers from "@/providers/Providers";
import SkipLink from "./SkipLink";

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

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("@/providers", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useResponsive: vi.fn(
      actual.useResponsive as (...args: unknown[]) => unknown,
    ),
  };
});

import { useResponsive } from "@/providers";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
});

describe("SkipLink renders correctly", () => {
  it("SkipLink text renders correctly", () => {
    render(
      <Providers>
        <SkipLink />
      </Providers>,
    );
    const skiplink = screen.getAllByTestId("skip-link");
    expect(skiplink[0]).toBeInTheDocument();
  });
});

describe("SkipLink Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders SkipLink with href="#main" when the pathname is "/"', () => {
    vi.mocked(usePathname).mockReturnValue("/");

    render(
      <Providers>
        <SkipLink />
      </Providers>,
    );
    const skiplink = screen.getAllByTestId("skip-link");
    expect(skiplink[0]).toBeInTheDocument();
    expect(skiplink[0]).toHaveAttribute("href", "#main");
  });

  it("sets tabIndex to -1 on small screens", () => {
    vi.mocked(useResponsive).mockReturnValue({
      isSmallScreen: true,
      width: 500,
      height: 800,
    });

    render(
      <Providers>
        <SkipLink />
      </Providers>,
    );
    const skiplink = screen.getAllByTestId("skip-link");
    expect(skiplink[0]).toHaveAttribute("tabindex", "-1");
  });
});
