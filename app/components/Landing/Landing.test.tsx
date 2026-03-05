import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";

// Lightweight matchMedia mock for jsdom
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

  jest.spyOn(console, "error").mockImplementation(() => jest.fn());
});

// Mock provider hook used by Landing
jest.mock("@/app/providers", () => ({
  useModal: () => ({ resetModals: jest.fn() }),
}));

// Mock the initiateSession util
jest.mock("@/app/utils", () => ({
  initiateSession: jest.fn(),
}));

// Mock Next router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock shared UI components used by Landing so tests are deterministic
jest.mock("@/app/components", () => ({
  Button: ({ children, ...props }: any) => (
    <button data-testid={props["data-testid"]} {...props}>
      {children}
    </button>
  ),
  Paragraph: ({ children, ...props }: any) => (
    <p
      data-testid={props["data-testid"] ?? "paragraph"}
      className={props.className}
    >
      {children}
    </p>
  ),
  SectionBreak: ({ visible, level }: any) => (
    <div data-testid={`section-break-${level}`}>{visible ? "v" : "x"}</div>
  ),
  InsetText: ({ children }: any) => <div data-testid="inset">{children}</div>,
  Main: ({ children }: any) => <main>{children}</main>,
  H1: ({ children }: any) => <h1 data-testid="landing-heading">{children}</h1>,
  Analytics: () => <div data-testid="analytics" />,
  WarningText: ({ children }: any) => (
    <div data-testid="warning">{children}</div>
  ),
  ButtonArrow: () => <span data-testid="btn-arrow" />,
}));

import Landing from "./Landing";

describe("Landing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // reset sessionStorage mock between tests to avoid leaking values
    Storage.prototype.getItem = jest.fn(() => "");
  });

  it("renders the landing container and heading", () => {
    render(<Landing />);
    expect(screen.getByTestId("landing-container")).toBeInTheDocument();
    expect(screen.getByTestId("landing-heading")).toBeInTheDocument();
  });
});
