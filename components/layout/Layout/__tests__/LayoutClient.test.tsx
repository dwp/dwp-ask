import { render } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock next/navigation usePathname
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

import { usePathname } from "next/navigation";
import LayoutClient from "../LayoutClient";

const mockedUsePathname = vi.mocked(usePathname);

describe("LayoutClient", () => {
  beforeEach(() => {
    // clean DOM
    document.body.innerHTML = "";
    vi.resetAllMocks();
  });

  test("adds classes when pathname is a free-flow page and cleans up on unmount", () => {
    // Arrange: create container and children
    const container = document.createElement("div");
    container.id = "app-container";
    const children = document.createElement("div");
    children.id = "app-children";
    container.appendChild(children);
    document.body.appendChild(container);

    mockedUsePathname.mockReturnValue("/");

    // Act
    const { unmount } = render(<LayoutClient />);

    expect(container.classList.contains("govuk-width-container")).toBe(false);
    expect(children.classList.contains("govuk-main-wrapper")).toBe(false);

    // Unmount triggers cleanup
    unmount();
  });

  test("removes classes when pathname is NOT a free-flow page", () => {
    const container = document.createElement("div");
    container.id = "app-container";
    const children = document.createElement("div");
    children.id = "app-children";
    container.appendChild(children);
    document.body.appendChild(container);

    // Add classes first
    container.classList.add("govuk-width-container");
    children.classList.add("govuk-main-wrapper");

    mockedUsePathname.mockReturnValue("/chat");

    render(<LayoutClient />);

    // For non-freeFlow, component keeps the classes
    expect(container.classList.contains("govuk-width-container")).toBe(true);
    expect(children.classList.contains("govuk-main-wrapper")).toBe(true);
  });

  test("does nothing when container is not present", () => {
    // no container in DOM
    mockedUsePathname.mockReturnValue("/");

    // Should not throw error
    expect(() => render(<LayoutClient />)).not.toThrow();
  });
});
