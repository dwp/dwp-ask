import "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import React from "react";
import { expect, vi } from "vitest";

expect.extend(matchers);

// Mock markdown-to-jsx to avoid ESM issues while preserving basic link behavior
vi.mock("markdown-to-jsx", () => {
  const renderLink = (
    href: string,
    label: string,
    options: any,
    key: number,
  ) => {
    const override = options?.overrides?.a;
    const baseProps = { href };

    if (override?.component) {
      const Component = override.component;
      return React.createElement(
        Component,
        {
          key: `mock-markdown-link-${key}`,
          ...(override?.props ?? {}),
          ...baseProps,
        },
        label,
      );
    }

    return React.createElement(
      "a",
      {
        key: `mock-markdown-link-${key}`,
        ...(override?.props ?? {}),
        ...baseProps,
      },
      label,
    );
  };

  const renderMarkdown = (content: string, options: any) => {
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let linkIndex = 0;

    while (lastIndex < content.length) {
      const openBracket = content.indexOf("[", lastIndex);
      if (openBracket === -1) {
        break;
      }

      const closeBracket = content.indexOf("]", openBracket + 1);
      if (closeBracket === -1) {
        break;
      }

      const openParen = content.indexOf("(", closeBracket + 1);
      if (openParen === -1) {
        break;
      }

      const closeParen = content.indexOf(")", openParen + 1);
      if (closeParen === -1) {
        break;
      }

      const preceding = content.slice(lastIndex, openBracket);
      if (preceding) {
        nodes.push(preceding);
      }

      const label = content.slice(openBracket + 1, closeBracket);
      const href = content.slice(openParen + 1, closeParen);
      nodes.push(renderLink(href, label, options, linkIndex));
      linkIndex += 1;

      lastIndex = closeParen + 1;
    }

    const trailing = content.slice(lastIndex);
    if (trailing) {
      nodes.push(trailing);
    }

    return nodes;
  };

  const MockMarkdown = ({
    children,
    options,
    className,
    "data-testid": dataTestId,
  }: {
    children?: React.ReactNode;
    options?: any;
    className?: string;
    "data-testid"?: string;
  }) => {
    const content =
      typeof children === "string"
        ? renderMarkdown(children, options)
        : children;

    return React.createElement(
      "div",
      { className, "data-testid": dataTestId },
      content,
    );
  };

  return { default: MockMarkdown };
});

// Suppress console errors and logs in tests
global.console = {
  ...console,
  error: vi.fn(),
  log: vi.fn(),
  warn: vi.fn(),
};
