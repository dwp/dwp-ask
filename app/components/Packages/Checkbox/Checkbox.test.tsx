import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Checkbox from "./Checkbox";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
  jest.spyOn(console, "log").mockImplementation(jest.fn());
});

describe("Checkbox renders correctly", () => {
  it("renders correctly", () => {
    render(<Checkbox>Test</Checkbox>);
    const checkbox = screen.getByText("Test");
    expect(checkbox).toBeInTheDocument();
  });
});
