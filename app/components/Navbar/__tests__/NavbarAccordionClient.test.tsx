import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import NavbarAccordionClient from "../NavbarAccordionClient";

describe("NavbarAccordionClient", () => {
  afterEach(() => {
    cleanup();
    // remove any test menu element
    const el = document.getElementById("test-menu");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });

  it("toggles menu hidden attribute and aria attributes when clicked", () => {
    // create a fake menu element that the component will toggle
    const menu = document.createElement("div");
    menu.id = "test-menu";
    // initially hidden
    menu.setAttribute("hidden", "");
    menu.setAttribute("aria-hidden", "true");
    document.body.appendChild(menu);

    const { getByTestId } = render(
      <NavbarAccordionClient menuId="test-menu" tabIndex={0} />,
    );

    const toggle = getByTestId("navbar-menu-toggle");
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    // initial state: menu should be hidden
    expect(menu).toHaveAttribute("hidden");
    expect(menu).toHaveAttribute("aria-hidden", "true");

    // click to open
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(menu.hasAttribute("hidden")).toBe(false);
    expect(menu).toHaveAttribute("aria-hidden", "false");

    // click to close
    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("hidden");
    expect(menu).toHaveAttribute("aria-hidden", "true");
  });
});
