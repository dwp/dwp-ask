import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import UnorderedList from "./UnorderedList";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("UnorderedList renders correctly", () => {
  it("UnorderedList renders text correctly", () => {
    render(<UnorderedList>Sample Text</UnorderedList>);
    const list = screen.getByText("Sample Text");
    expect(list.innerHTML).toEqual("Sample Text");
  });
});
