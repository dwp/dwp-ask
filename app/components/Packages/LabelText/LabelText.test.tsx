import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LabelText from "./LabelText";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("LabelText renders correctly", () => {
  it("LabelText text renders correctly", () => {
    render(
      <LabelText data-testid="sample-label-text">Sample Label Text</LabelText>,
    );
    const link = screen.getByTestId("sample-label-text");
    expect(link.innerHTML).toEqual("Sample Label Text");
  });
});
