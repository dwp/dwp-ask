import { render } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MockChildrenAndProps } from "@/types";

describe("Navbar server component", () => {
  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("hides admin wrapper on landing page (/)", async () => {
    // Mock next/headers to simulate server-provided pathname
    vi.doMock("next/headers", () => ({
      headers: () => ({ get: () => "/" }),
    }));

    // Mock client-only child components so hooks (usePathname) are not executed
    vi.doMock("../NavbarHydrator", () => ({
      __esModule: true,
      default: () => createElement("div", { "data-testid": "navbar-hydrator" }),
    }));
    // Mock accordion client so hooks (useState) are not executed in test
    vi.doMock("../NavbarAccordionClient", () => ({
      __esModule: true,
      default: () =>
        createElement("div", { "data-testid": "navbar-accordion" }),
    }));
    // Mock @/components barrel since Navbar imports from there
    vi.doMock("@/components", () => ({
      __esModule: true,
      Link: ({ children }: MockChildrenAndProps) =>
        createElement("a", {}, children),
      AdminViewNavigation: () =>
        createElement("div", { "data-testid": "admin-view" }),
      ChangeClaimantLocation: () =>
        createElement("div", { "data-testid": "change-claimant-location" }),
    }));

    const { default: Navbar } = await import("../Navbar");

    // Navbar is an async server component function
    const element = await Navbar();
    const { container } = render(element as React.ReactElement);

    const adminWrapper = container.querySelector("#admin-view-wrapper");
    expect(adminWrapper).toBeTruthy();
    // On landing page the wrapper should be hidden (display: none)
    expect(adminWrapper).toHaveStyle({ display: "none" });
  });

  it("shows admin wrapper on non-landing page (/chat)", async () => {
    vi.doMock("next/headers", () => ({
      headers: () => ({ get: () => "/chat" }),
    }));

    vi.doMock("../NavbarHydrator", () => ({
      __esModule: true,
      default: () => createElement("div", { "data-testid": "navbar-hydrator" }),
    }));
    // Mock accordion client so hooks (useState) are not executed in test
    vi.doMock("../NavbarAccordionClient", () => ({
      __esModule: true,
      default: () =>
        createElement("div", { "data-testid": "navbar-accordion" }),
    }));
    // Mock @/components barrel since Navbar imports from there
    vi.doMock("@/components", () => ({
      __esModule: true,
      Link: ({ children }: MockChildrenAndProps) =>
        createElement("a", {}, children),
      AdminViewNavigation: () =>
        createElement("div", { "data-testid": "admin-view" }),
      ChangeClaimantLocation: () =>
        createElement("div", { "data-testid": "change-claimant-location" }),
    }));

    const { default: Navbar } = await import("../Navbar");
    const element = await Navbar();
    const { container } = render(element as React.ReactElement);

    const adminWrapper = container.querySelector("#admin-view-wrapper");
    expect(adminWrapper).not.toBeNull();
    // On non-landing pages the wrapper should be visible (not display: none)
    expect(adminWrapper).not.toHaveStyle({ display: "none" });
  });

  it("defaults to empty string when x-current-pathname header is null", async () => {
    vi.doMock("next/headers", () => ({
      headers: () => ({ get: () => null }),
    }));

    vi.doMock("../NavbarHydrator", () => ({
      __esModule: true,
      default: () => createElement("div", { "data-testid": "navbar-hydrator" }),
    }));
    vi.doMock("../NavbarAccordionClient", () => ({
      __esModule: true,
      default: () =>
        createElement("div", { "data-testid": "navbar-accordion" }),
    }));
    vi.doMock("@/components", () => ({
      __esModule: true,
      Link: ({ children }: MockChildrenAndProps) =>
        createElement("a", {}, children),
      AdminViewNavigation: () =>
        createElement("div", { "data-testid": "admin-view" }),
      ChangeClaimantLocation: () =>
        createElement("div", { "data-testid": "change-claimant-location" }),
    }));

    const { default: Navbar } = await import("../Navbar");
    const element = await Navbar();
    const { container } = render(element as React.ReactElement);

    const adminWrapper = container.querySelector("#admin-view-wrapper");
    expect(adminWrapper).not.toHaveStyle({ display: "none" });
  });
});
