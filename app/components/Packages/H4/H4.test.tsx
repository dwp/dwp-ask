import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import H4 from "./H4";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("H4 renders correctly", () => {
  it("H4 text renders correctly", () => {
    render(<H4 data-testid="test-h4">H4 text</H4>);
    const h4 = screen.getByTestId("test-h4");
    expect(h4.innerHTML).toEqual("H4 text");
  });
});
