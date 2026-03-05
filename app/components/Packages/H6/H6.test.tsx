import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import H6 from "./H6";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("H6 renders correctly", () => {
  it("H6 text renders correctly", () => {
    render(<H6 data-testid="test-h6">H6 text</H6>);
    const h6 = screen.getByTestId("test-h6");
    expect(h6.innerHTML).toEqual("H6 text");
  });
});
