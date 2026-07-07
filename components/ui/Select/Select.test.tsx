import { render, screen } from "@testing-library/react";
import Select from "./Select";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
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

  it("renders with className and error state", () => {
    render(
      <Select
        id="err-select"
        data-testid="err-select"
        label="Error Select"
        options={["A"]}
        className="custom"
        error={true}
      />,
    );
    const select = screen.getByTestId("err-select");
    expect(select.className).toContain("govuk-select--error");
    expect(select.className).toContain("custom");
  });

  it("renders without className or error", () => {
    render(
      <Select
        id="plain-select"
        data-testid="plain-select"
        label="Plain"
        options={["X"]}
      />,
    );
    const select = screen.getByTestId("plain-select");
    expect(select.className).not.toContain("govuk-select--error");
  });
});
