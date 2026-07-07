import type { ComponentProps } from "react";

export type MarkdownProps = ComponentProps<
  typeof import("markdown-to-jsx").default
>;

export type MarkdownOptions = MarkdownProps["options"];

export type SanitisedMarkdownProps = {
  children: string;
  options?: MarkdownOptions;
  className?: string;
  "data-testid"?: string;
};
