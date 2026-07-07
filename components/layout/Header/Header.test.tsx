import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../Navbar/Navbar", () => {
  return {
    default: function MockNavbar() {
      return <div data-testid="mock-navbar">Navbar</div>;
    },
  };
});

const mockGet = vi.fn().mockReturnValue("");

vi.mock("next/headers", () => {
  return {
    headers: vi.fn().mockReturnValue({
      get: (...args: unknown[]) => mockGet(...args),
    }),
  };
});

import Header from "./Header";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
  mockGet.mockReturnValue("");
});

describe("Header renders correctly", () => {
  it("Title renders correctly", async () => {
    const HeaderComponent = await Header();
    render(HeaderComponent);
    const dwpText = screen.getByTestId("header-dwp-text");
    expect(dwpText.innerHTML).toEqual("DWP");
  });
  it("Subtitle renders correctly", async () => {
    const HeaderComponent = await Header();
    render(HeaderComponent);
    const askText = screen.getByTestId("header-ask-text");
    expect(askText.innerHTML).toEqual("Ask");
  });
});

describe("Header visibility based on pathname", () => {
  it("hides header on the landing page", async () => {
    mockGet.mockReturnValue("/");
    const HeaderComponent = await Header();
    render(HeaderComponent);
    const header = screen.getByRole("banner", { hidden: true });
    expect(header).toHaveStyle({ display: "none" });
  });

  it("shows header on non-landing pages", async () => {
    mockGet.mockReturnValue("/chat");
    const HeaderComponent = await Header();
    render(HeaderComponent);
    const header = screen.getByRole("banner");
    expect(header).not.toHaveStyle({ display: "none" });
  });

  it("shows header when pathname header is null", async () => {
    mockGet.mockReturnValue(null);
    const HeaderComponent = await Header();
    render(HeaderComponent);
    const header = screen.getByRole("banner");
    expect(header).not.toHaveStyle({ display: "none" });
  });
});
