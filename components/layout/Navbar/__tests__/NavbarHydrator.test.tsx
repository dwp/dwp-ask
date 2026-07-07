import { render, screen, waitFor } from "@testing-library/react";
import { type AnchorHTMLAttributes, createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

// Mock next/navigation and Link used by the client component
vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));
vi.mock("../../Link/Link", () => ({
  __esModule: true,
  default: (props: AnchorHTMLAttributes<HTMLAnchorElement>) =>
    createElement("a", { ...props }, props.children),
}));

import { usePathname } from "next/navigation";

describe("NavbarHydrator (client)", () => {
  afterEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = "";
  });

  it("hides admin wrapper and does not render links on landing page", async () => {
    vi.mocked(usePathname).mockReturnValue("/");

    const admin = document.createElement("div");
    admin.id = "admin-view-wrapper";
    admin.style.display = "inline";
    document.body.appendChild(admin);

    const navbar = document.createElement("div");
    navbar.id = "navbar-container";
    document.body.appendChild(navbar);

    const header = document.createElement("header");
    header.id = "dwpask-header";
    document.body.appendChild(header);

    const { default: NavbarHydrator } = await import("../NavbarHydrator");
    render(<NavbarHydrator />);

    await waitFor(() => {
      expect(document.getElementById("admin-view-wrapper")).toHaveStyle({
        display: "none",
      });
      expect(document.getElementById("navbar-container")).toHaveStyle({
        display: "none",
      });
      expect(document.getElementById("dwpask-header")).toHaveStyle({
        display: "none",
      });
    });

    // No links should be rendered for landing page
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("renders links and shows admin wrapper on non-landing page", async () => {
    vi.mocked(usePathname).mockReturnValue("/chat");

    const admin = document.createElement("div");
    admin.id = "admin-view-wrapper";
    admin.style.display = "none";
    document.body.appendChild(admin);

    const navbar = document.createElement("div");
    navbar.id = "navbar-container";
    navbar.style.display = "none";
    document.body.appendChild(navbar);

    const header = document.createElement("header");
    header.id = "dwpask-header";
    header.style.display = "none";
    document.body.appendChild(header);

    const { default: NavbarHydrator } = await import("../NavbarHydrator");
    render(<NavbarHydrator />);

    await waitFor(() => {
      expect(document.getElementById("admin-view-wrapper")).toHaveStyle({
        display: "inline",
      });
      expect(document.getElementById("navbar-container")).not.toHaveStyle({
        display: "none",
      });
      expect(document.getElementById("dwpask-header")).not.toHaveStyle({
        display: "none",
      });
    });
  });

  it("hides navbar on agreement page", async () => {
    vi.mocked(usePathname).mockReturnValue("/agreement");

    const navbar = document.createElement("div");
    navbar.id = "navbar-container";
    document.body.appendChild(navbar);

    const header = document.createElement("header");
    header.id = "dwpask-header";
    document.body.appendChild(header);

    const { default: NavbarHydrator } = await import("../NavbarHydrator");
    render(<NavbarHydrator />);

    await waitFor(() => {
      expect(document.getElementById("navbar-container")).toHaveStyle({
        display: "none",
      });
      expect(document.getElementById("dwpask-header")).not.toHaveStyle({
        display: "none",
      });
    });
  });

  it("handles null pathname gracefully", async () => {
    vi.mocked(usePathname).mockReturnValue(null as unknown as string);

    const { default: NavbarHydrator } = await import("../NavbarHydrator");
    expect(() => render(<NavbarHydrator />)).not.toThrow();
  });
});
