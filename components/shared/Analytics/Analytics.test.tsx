import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MockNextScriptProps } from "@/types";
import Analytics from "./Analytics";

vi.mock("next/script", () => ({
  __esModule: true,
  default: ({ children, id }: MockNextScriptProps) => (
    <script id={id}>{children}</script>
  ),
}));

describe("Analytics", () => {
  it("renders GTM scripts", () => {
    const { container } = render(<Analytics />);
    const scripts = container.querySelectorAll("script");
    expect(scripts.length).toBe(2);
  });
});
