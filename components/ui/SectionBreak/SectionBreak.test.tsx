import { render, screen } from "@testing-library/react";
import SectionBreak from "./SectionBreak";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
});

describe("SectionBreak renders correctly", () => {
  it("SectionBreak renders props correctly", () => {
    render(<SectionBreak visible={false} level="m" />);
    const sectionbreak = screen.getByRole("separator");
    expect(sectionbreak).toBeInTheDocument();
    expect(sectionbreak.className).not.toContain(
      "govuk-section-break--visible",
    );
  });

  it("renders with visible class when visible is true", () => {
    render(<SectionBreak visible={true} level="l" />);
    const sectionbreak = screen.getByRole("separator");
    expect(sectionbreak.className).toContain("govuk-section-break--visible");
    expect(sectionbreak.className).toContain("govuk-section-break--l");
  });
});
