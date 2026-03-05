import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock the providers used by NavbarClient
jest.mock("@/app/providers", () => ({
  useResponsive: jest.fn(),
}));

import { useResponsive } from "@/app/providers";

// Provide a simple matchMedia mock with add/removeEventListener
function mockMatchMedia() {
  return {
    matches: false,
    media: "(max-width: 768px)",
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
}

describe("NavbarClient", () => {
  afterEach(() => {
    jest.resetAllMocks();
    document.body.innerHTML = "";
  });

  it("works with custom containerId", async () => {
    (useResponsive as jest.Mock).mockReturnValue({ isSmallScreen: true });

    const container = document.createElement("div");
    container.id = "custom-navbar";
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = "link";
    container.appendChild(a);
    document.body.appendChild(container);

    window.matchMedia = jest.fn().mockImplementation(mockMatchMedia);

    const { default: NavbarClient } = await import("../NavbarClient");
    render(<NavbarClient containerId="custom-navbar" />);

    await waitFor(() => {
      expect(container.tabIndex).toBe(-1);
      expect(a.tabIndex).toBe(-1);
    });
  });
});
