import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { ChevronUp, ChevronDown } from "./Chevrons";

const TestChevrons = () => (
  <>
    <ChevronUp />
    <ChevronDown />
  </>
);

describe("Chevrons both render", () => {
  it("Both chevrons are present in document body", () => {
    const { container } = render(<TestChevrons />);
    const chevrons = container.getElementsByClassName(
      "govuk-accordion-nav__chevron",
    );

    expect(chevrons[0]).toHaveClass("govuk-accordion-nav__chevron");
    expect(chevrons[1]).toHaveClass("govuk-accordion-nav__chevron");
  });
});
