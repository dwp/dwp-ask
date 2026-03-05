import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock the imported child components so the server component can be
// rendered deterministically in tests.
jest.mock("../LayoutClient", () => ({
  __esModule: true,
  default: () => <div data-testid="layout-client">LayoutClient</div>,
}));

jest.mock("../LayoutModals", () => ({
  __esModule: true,
  default: () => <div data-testid="layout-modals">LayoutModals</div>,
}));

jest.mock("../../Packages/Header/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>,
}));

// Mock CSS module to avoid resolving real styles in the test environment
jest.mock("../Layout.module.css", () => ({
  appContainer: "appContainer",
  appChildren: "appChildren",
}));

beforeEach(() => {
  // Silence expected console errors in tests
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("Layout (server) component", () => {
  it("renders container, client, header, modals and children", async () => {
    // Import the async server component and await its rendered element
    const Layout = (await import("../Layout")).default as any;

    const element = await Layout({
      children: <div data-testid="child">Hello</div>,
    });

    render(element);

    const container = screen.getByTestId("app-container");
    expect(container).toBeInTheDocument();

    // Layout should render client, header and modals
    expect(screen.getByTestId("layout-client")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("layout-modals")).toBeInTheDocument();

    // The main landmark should exist and contain our child
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(screen.getByTestId("child")).toHaveTextContent("Hello");

    // Ensure DOM structure/order: client, header, modals, main
    expect(container.childNodes.length).toBe(4);
    expect(container.childNodes[0]).toContainElement(
      screen.getByTestId("layout-client"),
    );
    expect(container.childNodes[1]).toContainElement(
      screen.getByTestId("header"),
    );
    expect(container.childNodes[2]).toContainElement(
      screen.getByTestId("layout-modals"),
    );
    expect(container.childNodes[3]).toContainElement(main);
  });
});
