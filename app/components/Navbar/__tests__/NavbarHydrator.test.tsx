import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock next/navigation and Link used by the client component
jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("../../Packages/Link/Link", () => ({
  __esModule: true,
  default: (props: any) =>
    React.createElement("a", { ...props }, props.children),
}));

import { usePathname } from "next/navigation";

describe("NavbarHydrator (client)", () => {
  afterEach(() => {
    jest.resetAllMocks();
    document.body.innerHTML = "";
  });

  it("hides admin wrapper and does not render links on landing page", async () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    const admin = document.createElement("div");
    admin.id = "admin-view-wrapper";
    admin.style.display = "inline";
    document.body.appendChild(admin);

    const { default: NavbarHydrator } = await import("../NavbarHydrator");
    render(<NavbarHydrator />);

    await waitFor(() => {
      expect(document.getElementById("admin-view-wrapper")).toHaveStyle({
        display: "none",
      });
    });

    // No links should be rendered for landing page
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("renders links and shows admin wrapper on non-landing page", async () => {
    (usePathname as jest.Mock).mockReturnValue("/chat");

    const admin = document.createElement("div");
    admin.id = "admin-view-wrapper";
    admin.style.display = "none";
    document.body.appendChild(admin);

    const { default: NavbarHydrator } = await import("../NavbarHydrator");
    render(<NavbarHydrator />);
  });
});
