import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import H3 from "./H3";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("H3 renders correctly", () => {
  it("H3 text renders correctly", () => {
    render(<H3 data-testid="test-h3">H3 text</H3>);
    const h3 = screen.getByTestId("test-h3");
    expect(h3.innerHTML).toEqual("H3 text");
  });
});
