import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import H5 from "./H5";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("H5 renders correctly", () => {
  it("H5 text renders correctly", () => {
    render(<H5 data-testid="test-h5">H5 text</H5>);
    const h5 = screen.getByTestId("test-h5");
    expect(h5.innerHTML).toEqual("H5 text");
  });
});
