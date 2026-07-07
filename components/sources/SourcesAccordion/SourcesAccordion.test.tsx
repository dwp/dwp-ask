import { fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/utils", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return { ...actual, sendQuery: vi.fn().mockResolvedValue([]) };
});

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

describe("MarkDownLink rendering", () => {
  it("renders a markdown link with aria-label when chunks contain a link", () => {
    render(
      <SourcesAccordion
        source={{
          title: "Title",
          url: "URL",
          chunks: "See [example link](https://example.com) for details",
        }}
        index={2}
        isModalOpen={false}
      />,
    );

    const accordionButton = screen.getByRole("button", {
      name: /view source extracts/i,
    });
    fireEvent.click(accordionButton);

    const link = screen.getByRole("link", { name: /link\. example link/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("target", "_blank");
  });
});
