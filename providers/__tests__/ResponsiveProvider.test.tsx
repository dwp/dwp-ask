import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { ResponsiveProvider, useResponsive } from "../ResponsiveProvider";

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

const wrapper = ({ children }: { children: ReactNode }) => (
  <ResponsiveProvider>{children}</ResponsiveProvider>
);

describe("ResponsiveProvider", () => {
  it("provides responsive context values", () => {
    const { result } = renderHook(() => useResponsive(), { wrapper });
    expect(result.current).toHaveProperty("isSmallScreen");
    expect(result.current).toHaveProperty("width");
    expect(result.current).toHaveProperty("height");
  });
});

describe("useResponsive outside provider", () => {
  it("throws when used outside ResponsiveProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => renderHook(() => useResponsive())).toThrow(
      "useResponsive must be used within ResponsiveProvider",
    );
  });
});
