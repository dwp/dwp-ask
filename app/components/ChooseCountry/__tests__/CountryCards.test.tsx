import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import CountryCards from "../CountryCards";
import { locations } from "../../Landing/config";
import Providers from "@/app/providers/Providers";

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

describe("CountryCards", () => {
  it("renders a card for each location and calls handler on click", () => {
    const onClickHandler = jest.fn();

    render(
      <Providers>
        <CountryCards onClickHandler={onClickHandler} />
      </Providers>,
    );

    // All locations should render
    locations.forEach((loc) => {
      expect(screen.getByText(loc)).toBeInTheDocument();
    });

    // Click the first location and expect handler called with the location
    const first = locations[0];
    const node = screen.getByText(first);
    fireEvent.click(node);
    expect(onClickHandler).toHaveBeenCalledTimes(1);
    expect(onClickHandler).toHaveBeenCalledWith(first);
  });
});
