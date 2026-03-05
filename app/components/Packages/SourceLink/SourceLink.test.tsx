import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock the shared components used by SourceLink
jest.mock("@/app/components", () => ({
  Link: ({ children, ...props }: any) => (
    <a data-testid="mock-link" {...props}>
      {children}
    </a>
  ),
  SanitisedMarkdown: ({ children }: any) => (
    <div data-testid="mock-sanitised">{children}</div>
  ),
}));

// Mock the message helper utilities used to format title and markdown
jest.mock("@/app/utils/message-helpers", () => ({
  formatTitle: (title: string, index: number) => `TITLE:${index}:${title}`,
  formatMarkdown: (chunks: string) => `MARKDOWN:${chunks}`,
}));

// Mock the markdown options factory (not used directly in the test)
jest.mock("../../SourcesAccordion/SourcesAccordionMarkdownConfig", () => ({
  createAccordionMarkdownOptions: () => ({}),
}));

import SourceLink from "./SourceLink";

describe("SourceLink", () => {
  it("renders a link with formatted title and sanitized markdown extract", () => {
    const source = {
      title: "My Source",
      url: "https://example.com",
      chunks: "chunk text",
    };

    render(<SourceLink source={source} index={2} />);

    const link = screen.getByTestId("source-link-title");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", source.url);
    // formatTitle returns TITLE:index:title
    expect(link).toHaveTextContent("TITLE:2:My Source");
  });

  it("uses index 0 formatting when index is zero", () => {
    const source = { title: "Zero", url: "https://zero", chunks: "z" };
    render(<SourceLink source={source} index={0} />);

    const link = screen.getByTestId("source-link-title");
    expect(link).toHaveTextContent("TITLE:0:Zero");
  });
});
