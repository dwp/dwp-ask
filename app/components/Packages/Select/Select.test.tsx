import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Select from "./Select";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("Select renders correctly", () => {
  it("Select options render correctly", () => {
    render(
      <Select
        id="test-select"
        data-testid="test-select"
        label="Test Select"
        options={["Test 1", "Test 2"]}
      />,
    );
    const select = screen.getByLabelText("Test Select");
    expect(select.children.length).toEqual(2);
  });
});
