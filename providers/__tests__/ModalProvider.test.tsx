import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { ModalProvider, useModal } from "../ModalProvider";

const wrapper = ({ children }: { children: ReactNode }) => (
  <ModalProvider>{children}</ModalProvider>
);

describe("ModalProvider", () => {
  it("provides default modal state with all modals hidden", () => {
    const { result } = renderHook(() => useModal(), { wrapper });
    expect(result.current.isModalVisible.newChat).toBe(false);
    expect(result.current.isModalVisible.returnHome).toBe(false);
  });

  it("sets a modal visible via setModalVisible", () => {
    const { result } = renderHook(() => useModal(), { wrapper });

    act(() => {
      result.current.setModalVisible("newChat");
    });

    expect(result.current.isModalVisible.newChat).toBe(true);
    expect(result.current.isModalVisible.returnHome).toBe(false);
  });

  it("resets all modals via resetModals", () => {
    const { result } = renderHook(() => useModal(), { wrapper });

    act(() => {
      result.current.setModalVisible("returnHome");
    });
    expect(result.current.isModalVisible.returnHome).toBe(true);

    act(() => {
      result.current.resetModals();
    });
    expect(result.current.isModalVisible.returnHome).toBe(false);
  });
});

describe("useModal outside provider", () => {
  it("throws when used outside ModalProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => renderHook(() => useModal())).toThrow(
      "useModal must be used within a ModalProvider",
    );
  });
});
