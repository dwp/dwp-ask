import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import InsetText from "./InsetText";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("InsetText renders correctly", () => {
  it("InsetText text renders correctly", () => {
    render(<InsetText data-testid="sample-data-testid">Sample Text</InsetText>);
    const heading = screen.getByTestId("sample-data-testid");
    expect(heading.innerHTML).toEqual("Sample Text");
  });
});
