import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock shared components used by LandingItem
jest.mock("@/app/components", () => ({
  Paragraph: ({ children, ...props }: any) => (
    <p
      data-testid={props["data-testid"] ?? "landing-item"}
      className={props.className}
    >
      {children}
    </p>
  ),
  SectionBreak: ({ visible, level }: any) => (
    <div data-testid={`section-break-${level}`}>
      {visible ? "visible" : "hidden"}
    </div>
  ),
}));

import LandingItem from "./LandingItem";

describe("LandingItem", () => {
  it("renders paragraph text and section break", () => {
    render(<LandingItem text="Hello world" />);

    const para = screen.getByTestId("landing-item");
    expect(para).toBeInTheDocument();
    expect(para).toHaveTextContent("Hello world");

    const sb = screen.getByTestId("section-break-m");
    expect(sb).toBeInTheDocument();
    expect(sb).toHaveTextContent("hidden");
  });

  it("uses provided data-testid and className", () => {
    render(
      (
        <LandingItem text="More" className="my-class" data-testid="my-item" />
      ) as any,
    );

    const para = screen.getByTestId("my-item");
    expect(para).toBeInTheDocument();
    expect(para).toHaveClass("my-class");
    expect(para).toHaveTextContent("More");
  });
});
