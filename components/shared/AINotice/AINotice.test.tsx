import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AI_NOTICE_LIST } from "@/constants/AINotice";
import AINotice from "./AINotice";

describe("AINotice", () => {
  it("renders all notice list items", () => {
    render(<AINotice />);

    for (let i = 0; i < AI_NOTICE_LIST.length; i++) {
      expect(
        screen.getByTestId(`ai-notice-list-item-${i + 1}`),
      ).toHaveTextContent(AI_NOTICE_LIST[i]);
    }
  });

  it("renders the PII warning", () => {
    render(<AINotice />);

    expect(screen.getByTestId("ai-notice-pii-warning")).toHaveTextContent(
      "Do not enter information that can identify your claimant",
    );
  });
});
