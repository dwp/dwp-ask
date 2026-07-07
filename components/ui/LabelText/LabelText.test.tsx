import { render, screen } from "@testing-library/react";
import LabelText from "./LabelText";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
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
