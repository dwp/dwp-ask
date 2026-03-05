import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Heading from "./Heading";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("Heading renders correctly", () => {
  it("Heading text renders correctly", () => {
    render(
      <Heading data-testid="accessibility-statement-heading">
        Accessibility statement for DWP Ask
      </Heading>,
    );
    const heading = screen.getByTestId("accessibility-statement-heading");
    expect(heading.innerHTML).toEqual("Accessibility statement for DWP Ask");
  });
});
