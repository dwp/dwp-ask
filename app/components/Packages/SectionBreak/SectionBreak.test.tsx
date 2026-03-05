import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SectionBreak from "./SectionBreak";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("SectionBreak renders correctly", () => {
  it("SectionBreak renders props correctly", () => {
    render(<SectionBreak visible={false} level="m" />);
    const sectionbreak = screen.getByRole("separator");
    expect(sectionbreak).toBeInTheDocument();
  });
});
