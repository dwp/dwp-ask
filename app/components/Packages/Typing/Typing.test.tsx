import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Typing from "./Typing";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

// 3 typing dots
const CHILD_NODES_LENGTH = 4;
describe("Typing renders correctly", () => {
  it("3 child elements", () => {
    render(<Typing />);
    const container = screen.getByTestId("typing-container");
    expect(container.childNodes.length).toEqual(CHILD_NODES_LENGTH);
  });
});
