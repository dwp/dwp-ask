import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Paragraph from "./Paragraph";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("Paragraph renders correctly", () => {
  it("Paragraph text renders correctly", () => {
    render(<Paragraph>Sample Paragraph Text</Paragraph>);
    const para = screen.getByRole("paragraph");
    expect(para.innerHTML).toEqual("Sample Paragraph Text");
  });
});
