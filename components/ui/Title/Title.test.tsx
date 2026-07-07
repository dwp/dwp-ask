import { render, screen } from "@testing-library/react";
import Title from "./Title";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
});

describe("Title renders correctly", () => {
  it("renders h1 with correct class", () => {
    render(<Title level="h1">Test Heading</Title>);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.innerHTML).toEqual("Test Heading");
    expect(heading.className).toContain("govuk-heading-xl");
  });

  it("renders h2 with correct class", () => {
    render(<Title level="h2">Test Heading</Title>);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.className).toContain("govuk-heading-l");
  });

  it("renders h3 with correct class", () => {
    render(<Title level="h3">Test Heading</Title>);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading.className).toContain("govuk-heading-m");
  });

  it("renders h4 with correct class", () => {
    render(<Title level="h4">Test Heading</Title>);
    const heading = screen.getByRole("heading", { level: 4 });
    expect(heading.className).toContain("govuk-heading-s");
  });

  it("applies custom className", () => {
    render(
      <Title level="h1" className="custom-class">
        Test
      </Title>,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.className).toContain("custom-class");
  });

  it("applies data-testid", () => {
    render(
      <Title level="h1" data-testid="test-title">
        Test
      </Title>,
    );
    const heading = screen.getByTestId("test-title");
    expect(heading).toBeDefined();
  });

  it("applies aria-label", () => {
    render(
      <Title level="h1" aria-label="Test Label">
        Test
      </Title>,
    );
    const heading = screen.getByLabelText("Test Label");
    expect(heading).toBeDefined();
  });

  it("renders without custom className", () => {
    render(<Title level="h2">No Class</Title>);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.className).toContain("govuk-heading-l");
    expect(heading.className).not.toContain("undefined");
  });
});
