import { render, screen } from "@testing-library/react";
import { mockComponents, mockHelpers } from "@/utils/test";
import SourceLink from "./SourceLink";

vi.mock("@/components", () => mockComponents);
vi.mock("@/utils", () => mockHelpers);

describe("SourceLink", () => {
  it("renders a link with formatted title and sanitized markdown extract", () => {
    const source = {
      title: "My Source",
      url: "https://example.com",
      chunks: "chunk text",
      highlights_url: "https://example.com#:~:text=chunk%20text",
      highlights_text: "chunk text",
    };

    render(<SourceLink source={source} index={2} />);

    const link = screen.getByTestId("source-link-title");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", source.highlights_url);
    // formatTitle returns TITLE:index:title
    expect(link).toHaveTextContent("TITLE:2:My Source");
  });

  it("uses index 0 formatting when index is zero", () => {
    const source = {
      title: "My Source",
      url: "https://example.com",
      chunks: "chunk text",
      highlights_url: "https://example.com#:~:text=chunk%20text",
      highlights_text: "chunk text",
    };
    render(<SourceLink source={source} index={0} />);

    const link = screen.getByTestId("source-link-title");
    expect(link).toHaveTextContent("TITLE:0:My Source");
  });

  it("falls back to source.url when highlights_url is undefined", () => {
    const source = {
      title: "Fallback",
      url: "https://example.com/fallback",
      chunks: "text",
      highlights_url: undefined as unknown as string,
      highlights_text: "",
    };
    render(<SourceLink source={source} index={0} />);

    const link = screen.getByTestId("source-link-title");
    expect(link).toHaveAttribute("href", "https://example.com/fallback");
  });

  it("renders extract when showExtract is true", () => {
    const source = {
      title: "Extract Source",
      url: "https://example.com",
      chunks: "extract content",
      highlights_url: "https://example.com#h",
      highlights_text: "highlight",
    };
    render(<SourceLink source={source} index={1} showExtract={true} />);

    expect(screen.getByTestId("source-link-extract-text")).toBeInTheDocument();
  });

  it("does not render extract when showExtract is false", () => {
    const source = {
      title: "No Extract",
      url: "https://example.com",
      chunks: "content",
      highlights_url: "https://example.com#h",
      highlights_text: "highlight",
    };
    render(<SourceLink source={source} index={0} showExtract={false} />);

    expect(
      screen.queryByTestId("source-link-extract-text"),
    ).not.toBeInTheDocument();
  });
});
