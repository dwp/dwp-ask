import { render, screen } from "@testing-library/react";
import Markdown from "markdown-to-jsx";
import { beforeEach, describe, expect, it, MockedFunction, vi } from "vitest";
import { Title } from "@/components";
import SanitisedMarkdown from "./SanitisedMarkdown";

const sanitizeMock = vi.fn();
vi.mock("dompurify", () => ({
  __esModule: true,
  default: vi.fn(() => ({ sanitize: sanitizeMock })),
}));

vi.mock("markdown-to-jsx", () => {
  return {
    default: vi.fn(({ children, "data-testid": dataTestId }) => (
      <div data-testid={dataTestId}>{children}</div>
    )),
  };
});

const MockMarkdown = Markdown as MockedFunction<typeof Markdown>;

describe("SanitisedMarkdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default test id and sanitizes content", () => {
    sanitizeMock.mockReturnValue("sanitized content");

    render(<SanitisedMarkdown>test content</SanitisedMarkdown>);

    expect(sanitizeMock).toHaveBeenCalledWith("test content");
    expect(MockMarkdown).toHaveBeenCalledTimes(1);
    const [props] = MockMarkdown.mock.calls[0];
    expect(props).toEqual({
      children: "sanitized content",
      options: undefined,
      className: "",
      "data-testid": "sanitised-markdown",
    });
    expect(screen.getByTestId("sanitised-markdown")).toBeInTheDocument();
  });

  it("renders with custom test id", () => {
    sanitizeMock.mockReturnValue("content");

    render(<SanitisedMarkdown data-testid="custom">content</SanitisedMarkdown>);

    expect(MockMarkdown).toHaveBeenCalledTimes(1);
    const [props] = MockMarkdown.mock.calls[0];
    expect(props).toEqual({
      children: "content",
      options: undefined,
      className: "",
      "data-testid": "custom",
    });
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("passes options to Markdown component", () => {
    const options = {
      overrides: { h1: { component: Title, props: { level: "h1" } } },
    };

    sanitizeMock.mockReturnValue("content");

    render(<SanitisedMarkdown options={options}>content</SanitisedMarkdown>);

    expect(MockMarkdown).toHaveBeenCalledTimes(1);
    const [props] = MockMarkdown.mock.calls[0];
    expect(props).toEqual({
      children: "content",
      options,
      className: "",
      "data-testid": "sanitised-markdown",
    });
  });

  it("uses default test id when data-testid is undefined", () => {
    sanitizeMock.mockReturnValue("content");

    render(
      <SanitisedMarkdown data-testid={undefined}>content</SanitisedMarkdown>,
    );

    expect(MockMarkdown).toHaveBeenCalledTimes(1);
    const [props] = MockMarkdown.mock.calls[0];
    expect(props).toEqual({
      children: "content",
      options: undefined,
      className: "",
      "data-testid": "sanitised-markdown",
    });
  });
});
