import React from "react";
import { render, screen } from "@testing-library/react";
import ButtonArrow from "./ButtonArrow";

describe("ButtonArrow", () => {
  it("renders svg with default white fill", () => {
    render(<ButtonArrow />);

    const svg = screen.getByTestId("button-arrow");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("fill", "white");
    expect(svg).toHaveAttribute("viewBox", "0 0 706 860");
  });

  it("renders svg with custom fill color", () => {
    render(<ButtonArrow fill="red" />);

    const svg = screen.getByTestId("button-arrow");
    expect(svg).toHaveAttribute("fill", "red");
  });
  it("handles undefined fill prop", () => {
    render(<ButtonArrow fill={undefined} />);

    const svg = screen.getByTestId("button-arrow");
    expect(svg).toHaveAttribute("fill", "white");
  });
});
