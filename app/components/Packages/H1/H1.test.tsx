import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import H1 from "./H1";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("H1 renders correctly", () => {
  it("H1 text renders correctly", () => {
    render(<H1 data-testid="test-h1">H1 text</H1>);
    const h1 = screen.getByTestId("test-h1");
    expect(h1.innerHTML).toEqual("H1 text");
  });
});
