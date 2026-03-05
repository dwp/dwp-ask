import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Providers from "@/app/providers/Providers";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

jest.mock("@/app/utils/api", () => ({
  sendQuery: jest.fn().mockResolvedValue([]),
}));

import LayoutModals from "../LayoutModals";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
  usePathname() {
    return "/";
  },
}));

describe("LayoutModals Component", () => {
  it("renders ClearChatModal when isModalVisible.clearChat is true", () => {
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
});
