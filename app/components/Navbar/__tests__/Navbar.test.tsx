import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Navbar server component", () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it("hides admin wrapper on landing page (/)", async () => {
    // Mock next/headers to simulate server-provided pathname
    jest.doMock("next/headers", () => ({
      headers: () => ({ get: () => "/" }),
    }));

    // Mock client-only child components so hooks (usePathname) are not executed
    jest.doMock("../NavbarHydrator", () => ({
      __esModule: true,
      default: () =>
        React.createElement("div", { "data-testid": "navbar-hydrator" }),
    }));
    jest.doMock("../NavbarClient", () => ({
      __esModule: true,
      default: () =>
        React.createElement("div", { "data-testid": "navbar-client" }),
    }));
    // Mock accordion client so hooks (useState) are not executed in test
    jest.doMock("../NavbarAccordionClient", () => ({
      __esModule: true,
      default: () =>
        React.createElement("div", { "data-testid": "navbar-accordion" }),
    }));
    // Mock Link so client-side useContext/useRouter isn't executed
    jest.doMock("../../Packages/Link/Link", () => ({
      __esModule: true,
      default: ({ children }: any) => React.createElement("a", {}, children),
    }));
    // Mock AdminViewNavigation so server-side auth wrappers don't affect rendering
    jest.doMock(
      "../../Packages/AdminViewNavigation/AdminViewNavigation",
      () => ({
        __esModule: true,
        default: () =>
          React.createElement("div", { "data-testid": "admin-view" }),
      }),
    );

    jest.doMock("../../ChangeClaimantLocation/ChangeClaimantLocation", () => ({
      __esModule: true,
      default: () =>
        React.createElement("div", {
          "data-testid": "change-claimant-location",
        }),
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
    jest.doMock("next/headers", () => ({
      headers: () => ({ get: () => "/chat" }),
    }));

    jest.doMock("../NavbarHydrator", () => ({
      __esModule: true,
      default: () =>
        React.createElement("div", { "data-testid": "navbar-hydrator" }),
    }));
    jest.doMock("../NavbarClient", () => ({
      __esModule: true,
      default: () =>
        React.createElement("div", { "data-testid": "navbar-client" }),
    }));
    // Mock accordion client so hooks (useState) are not executed in test
    jest.doMock("../NavbarAccordionClient", () => ({
      __esModule: true,
      default: () =>
        React.createElement("div", { "data-testid": "navbar-accordion" }),
    }));
    // Mock Link so client-side useContext/useRouter isn't executed
    jest.doMock("../../Packages/Link/Link", () => ({
      __esModule: true,
      default: ({ children }: any) => React.createElement("a", {}, children),
    }));
    jest.doMock(
      "../../Packages/AdminViewNavigation/AdminViewNavigation",
      () => ({
        __esModule: true,
        default: () =>
          React.createElement("div", { "data-testid": "admin-view" }),
      }),
    );

    jest.doMock("../../ChangeClaimantLocation/ChangeClaimantLocation", () => ({
      __esModule: true,
      default: () =>
        React.createElement("div", {
          "data-testid": "change-claimant-location",
        }),
    }));

    const { default: Navbar } = await import("../Navbar");
    const element = await Navbar();
    const { container } = render(element as React.ReactElement);

    const adminWrapper = container.querySelector("#admin-view-wrapper");
    expect(adminWrapper).not.toBeNull();
    // On non-landing pages the wrapper should be visible (not display: none)
    expect(adminWrapper).not.toHaveStyle({ display: "none" });
  });
});
