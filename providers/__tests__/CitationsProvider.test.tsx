import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { CitationsProvider, useCitations } from "../CitationsProvider";

describe("CitationsProvider", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CitationsProvider>{children}</CitationsProvider>
  );

  it("provides default citations as undefined", () => {
    const { result } = renderHook(() => useCitations(), { wrapper });
    expect(result.current.citations).toBeUndefined();
  });

  it("updates citations via setCitations", () => {
    const { result } = renderHook(() => useCitations(), { wrapper });

    act(() => {
      result.current.setCitations([
        {
          title: "Policy",
          url: "https://example.com",
          chunks: "chunk",
          highlights_url: "",
          highlights_text: "",
        },
      ]);
    });

    expect(result.current.citations).toHaveLength(1);
    expect(result.current.citations?.[0].title).toBe("Policy");
  });
});

describe("useCitations outside provider", () => {
  it("throws when used outside CitationsProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    expect(() => renderHook(() => useCitations())).toThrow(
      "useCitations must be used within a CitationsProvider",
    );
  });
});
