import { render, screen } from "@testing-library/react";
import UnorderedList from "./UnorderedList";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
});

describe("UnorderedList renders correctly", () => {
  it("UnorderedList renders text correctly", () => {
    render(<UnorderedList>Sample Text</UnorderedList>);
    const list = screen.getByText("Sample Text");
    expect(list.innerHTML).toEqual("Sample Text");
  });
});
