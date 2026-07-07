import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LayoutProps } from "@/types";

// Mock the imported child components so the server component can be
// rendered deterministically in tests.
vi.mock("../LayoutClient", () => ({
  __esModule: true,
  default: () => <div data-testid="layout-client">LayoutClient</div>,
}));

vi.mock("../LayoutModals", () => ({
  __esModule: true,
  default: () => <div data-testid="layout-modals">LayoutModals</div>,
}));

vi.mock("../../PhaseBanner/PhaseBanner", () => ({
  __esModule: true,
  default: () => <div data-testid="phase-banner">PhaseBanner</div>,
}));

vi.mock("../../Header/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock("../../SkipLink/SkipLink", () => ({
  __esModule: true,
  default: () => <div data-testid="skip-link">SkipLink</div>,
}));

// Mock CSS module to avoid resolving real styles in the test environment
vi.mock("../Layout.module.css", () => ({
  default: {
    appContainer: "appContainer",
    appChildren: "appChildren",
  },
}));

beforeEach(() => {
  // Silence expected console errors in tests
  vi.spyOn(console, "error").mockImplementation(vi.fn());
});

describe("Layout (server) component", () => {
  it("renders container, client, header, modals and children", async () => {
    // Import the async server component and await its rendered element
    const Layout = (await import("../Layout")).default as (
      props: LayoutProps,
    ) => Promise<React.JSX.Element>;

    const element = await Layout({
      children: <div data-testid="child">Hello</div>,
    });

    render(element);

    const container = screen.getByTestId("app-container");
    expect(container).toBeInTheDocument();

    // Layout should render skip link, client, header, phase banner and modals
    expect(screen.getByTestId("skip-link")).toBeInTheDocument();
    expect(screen.getByTestId("layout-client")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("phase-banner")).toBeInTheDocument();
    expect(screen.getByTestId("layout-modals")).toBeInTheDocument();

    // The main landmark should exist and contain our child
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(screen.getByTestId("child")).toHaveTextContent("Hello");

    // Ensure DOM structure/order: skip link, client, header, phase banner, modals, main
    expect(container.childNodes.length).toBe(6);
    expect(container.childNodes[0]).toContainElement(
      screen.getByTestId("skip-link"),
    );
    expect(container.childNodes[1]).toContainElement(
      screen.getByTestId("layout-client"),
    );
    expect(container.childNodes[2]).toContainElement(
      screen.getByTestId("header"),
    );
    expect(container.childNodes[3]).toContainElement(
      screen.getByTestId("phase-banner"),
    );
    expect(container.childNodes[4]).toContainElement(
      screen.getByTestId("layout-modals"),
    );
    expect(container.childNodes[5]).toContainElement(main);
  });
});
