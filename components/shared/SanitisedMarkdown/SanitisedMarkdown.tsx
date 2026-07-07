"use client";

import createDOMPurify, { type WindowLike } from "dompurify";
import Markdown from "markdown-to-jsx";
import type { SanitisedMarkdownProps } from "@/types";

export type { SanitisedMarkdownProps };

/**
 * Renders markdown content after sanitising it with DOMPurify to prevent XSS.
 * Falls back to a no-op sanitiser during server-side rendering.
 */
export default function SanitisedMarkdown({
  children,
  options,
  className,
  ...props
}: SanitisedMarkdownProps) {
  const dataTestId = props["data-testid"] ?? "sanitised-markdown";

  const purify =
    typeof window !== "undefined"
      ? createDOMPurify(window as WindowLike)
      : { sanitize: (s: string) => s };

  const sanitised = purify.sanitize(children);

  return (
    <Markdown
      data-testid={dataTestId}
      options={options}
      className={className ?? ""}
    >
      {sanitised}
    </Markdown>
  );
}
