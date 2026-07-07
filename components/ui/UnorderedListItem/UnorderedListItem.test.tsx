import { render, screen } from "@testing-library/react";
import UnorderedListItem from "./UnorderedListItem";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
});

describe("ListItem renders correctly", () => {
  it("ListItem renders text correctly", () => {
    render(<UnorderedListItem>Sample Text</UnorderedListItem>);
    const item = screen.getByText("Sample Text");
    expect(item.innerHTML).toEqual("Sample Text");
  });
});
