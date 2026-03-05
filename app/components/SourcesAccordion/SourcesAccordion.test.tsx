import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("@/app/utils/api", () => ({
  sendQuery: jest.fn().mockResolvedValue([]),
}));

import SourcesAccordion from "./SourcesAccordion";

const TestAccordion = () => (
  <SourcesAccordion
    source={{ title: "Title", url: "URL", chunks: "Chunks" }}
    index={1}
    isModalOpen={false}
  />
);

describe("SourcesAccordion renders", () => {
  it("Sources accordion is present in document body", () => {
    render(<TestAccordion />);
    const sourcesAccordion = screen.getByTestId("sources-accordion");
    expect(sourcesAccordion).toBeInTheDocument();
  });
});

describe("Swhen the accordion is expanded", () => {
  it("should focus on the accordion content", () => {
    render(<TestAccordion />);
    const accordionButton = screen.getByRole("button", {
      name: /view source extracts/i,
    });
    expect(accordionButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(accordionButton);

    const accordionContent = screen.getByTestId("accordion-extract-text");
    expect(accordionContent).toBeVisible();

    expect(accordionContent).toHaveFocus();
  });
});
