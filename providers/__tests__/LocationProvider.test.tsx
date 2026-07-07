import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";

const mockLoadHistory = vi.hoisted(() => vi.fn(() => []));

vi.mock("@/utils", () => ({
  loadHistory: mockLoadHistory,
}));

import { loadHistory } from "@/utils";
import { LocationProvider, useLocation } from "../LocationProvider";

beforeEach(() => {
  vi.clearAllMocks();
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <LocationProvider>{children}</LocationProvider>
);

describe("LocationProvider", () => {
  it("initialises location as null when history is empty", () => {
    mockLoadHistory.mockReturnValue([]);
    const { result } = renderHook(() => useLocation(), { wrapper });
    expect(result.current.location).toBeNull();
  });

  it("initialises location from chat history with hasSetCountry", () => {
    vi.mocked(loadHistory).mockReturnValue([
      { question: "q", answer: "a", hasSetCountry: true, location: "Wales" },
    ]);
    const { result } = renderHook(() => useLocation(), { wrapper });
    expect(result.current.location).toBe("Wales");
  });

  it("updates location via setLocation", () => {
    mockLoadHistory.mockReturnValue([]);
    const { result } = renderHook(() => useLocation(), { wrapper });

    act(() => {
      result.current.setLocation("Scotland");
    });

    expect(result.current.location).toBe("Scotland");
  });
});

describe("useLocation outside provider", () => {
  it("throws when used outside LocationProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() => renderHook(() => useLocation())).toThrow(
      "useLocation must be used within a LocationProvider",
    );
  });
});
