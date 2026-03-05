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

jest.mock("@/app/utils/api", () => ({
  sendQuery: jest.fn().mockResolvedValue([]),
}));

import { ReturnHomeModal, ClearChatModal } from "./ModalsExport";

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
});

describe("ClearChatModal", () => {
  it("renders correctly", () => {
    render(
      <Providers>
        <ClearChatModal />
      </Providers>,
    );
    const modal = screen.getByTestId("modal-container");
    expect(modal).toBeInTheDocument();
  });
});
