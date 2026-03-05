import "@testing-library/jest-dom";
import React from "react";
import { render, screen, act } from "@testing-library/react";
import AllProviders from "@/app/providers/AllProviders";

// Mock child components used by Sidebar
jest.mock("@/app/components", () => ({
  H4: ({ children }: any) => <div data-testid="h4">{children}</div>,
  Paragraph: ({ children }: any) => (
    <div data-testid="paragraph">{children}</div>
  ),
  BackLink: ({ children, ...props }: any) => (
    <button data-testid="backlink" {...props}>
      {children}
    </button>
  ),
  SectionBreak: ({ visible, level }: any) => (
    <div data-testid={`section-break-${level}`}>
      {visible ? "break" : "hidden"}
    </div>
  ),
}));

// Mock SourceLink to keep tests focused on Sidebar logic
jest.mock("../SourceLink/SourceLink", () => ({
  __esModule: true,
  default: ({ index, source }: any) => (
    <div data-testid={`source-${index}`}>{source.title}</div>
  ),
}));

// Mock the SidebarProvider module so tests can control the hook return value
// while preserving a noop provider as the default export (AllProviders composes it).
const useSidebarMock = jest.fn();
jest.mock("@/app/providers/SidebarProvider", () => {
  const useSidebar = () => useSidebarMock();
  const SidebarProvider = ({ children }: any) => <>{children}</>;
  return { __esModule: true, useSidebar, default: SidebarProvider };
});

// Use a hoist-safe indirection for the utils mock to avoid jest.mock hoisting issues.
const loadHistoryMock = jest.fn();
jest.mock("@/app/utils", () => ({
  loadHistory: (...args: any) => loadHistoryMock(...args),
  getLocation: () => null,
}));

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

import Sidebar from "./Sidebar";

describe("Sidebar client component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders static content and no sources when there is no stored history", () => {
    // Arrange: wide viewport, sidebar visible, no history
    (global as any).innerWidth = 1024;
    useSidebarMock.mockReturnValue({
      isSidebarVisible: true,
      toggleSidebar: jest.fn(),
    });
    loadHistoryMock.mockReturnValue(undefined);

    // Act
    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>,
    );

    // Assert
    expect(screen.getByTestId("h4")).toHaveTextContent(
      "Universal Learning guidance links",
    );
    expect(screen.getByTestId("paragraph")).toBeInTheDocument();
    expect(screen.queryByTestId("source-0")).toBeNull();
  });

  it("hides content on small viewports and shows after resize > 768px", () => {
    // Arrange: small viewport and sidebar not visible
    (global as any).innerWidth = 500;
    useSidebarMock.mockReturnValue({
      isSidebarVisible: false,
      toggleSidebar: jest.fn(),
    });
    loadHistoryMock.mockReturnValue(undefined);

    // Act: render with small width
    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>,
    );

    // Content should not be shown initially
    expect(screen.queryByTestId("h4")).toBeNull();

    // Act: resize to wide viewport
    act(() => {
      (global as any).innerWidth = 800;
      window.dispatchEvent(new Event("resize"));
    });

    // Content should appear after resize
    expect(screen.getByTestId("h4")).toBeInTheDocument();
  });
});
