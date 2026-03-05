import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import UnorderedListItem from "./UnorderedListItem";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("ListItem renders correctly", () => {
  it("ListItem renders text correctly", () => {
    render(<UnorderedListItem>Sample Text</UnorderedListItem>);
    const item = screen.getByText("Sample Text");
    expect(item.innerHTML).toEqual("Sample Text");
  });
});
