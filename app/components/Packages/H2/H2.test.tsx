import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import H2 from "./H2";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("H2 renders correctly", () => {
  it("H2 text renders correctly", () => {
    render(<H2 data-testid="test-h2">H2 text</H2>);
    const h2 = screen.getByTestId("test-h2");
    expect(h2.innerHTML).toEqual("H2 text");
  });
});
