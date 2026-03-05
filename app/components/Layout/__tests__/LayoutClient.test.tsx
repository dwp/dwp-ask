import React from "react";
import { render } from "@testing-library/react";

// Mock next/navigation usePathname
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

import LayoutClient from "../LayoutClient";
import { usePathname } from "next/navigation";

const mockedUsePathname = usePathname as unknown as jest.Mock<
  string | undefined
>;

describe("LayoutClient", () => {
  let addSpy: jest.SpyInstance;
  let removeSpy: jest.SpyInstance;

  beforeEach(() => {
    // clean DOM
    document.body.innerHTML = "";
    jest.resetAllMocks();
    // Spy on DOMTokenList methods used by the component
    addSpy = jest.spyOn(DOMTokenList.prototype, "add");
    removeSpy = jest.spyOn(DOMTokenList.prototype, "remove");
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
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

    // Assert: class add should have been called for container and children
    expect(addSpy).toHaveBeenCalled();

    // Unmount triggers cleanup
    unmount();

    // cleanup should remove classes
    expect(removeSpy).toHaveBeenCalled();
  });

  test("removes classes when pathname is NOT a free-flow page", () => {
    const container = document.createElement("div");
    container.id = "app-container";
    const children = document.createElement("div");
    children.id = "app-children";
    container.appendChild(children);
    document.body.appendChild(container);

    mockedUsePathname.mockReturnValue("/chat");

    render(<LayoutClient />);

    // For non-freeFlow, component calls remove on mount
    expect(removeSpy).toHaveBeenCalled();
  });

  test("does nothing when container is not present", () => {
    // no container in DOM
    mockedUsePathname.mockReturnValue("/");

    render(<LayoutClient />);

    expect(addSpy).not.toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
  });
});
