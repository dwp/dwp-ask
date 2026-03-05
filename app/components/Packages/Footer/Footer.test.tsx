import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("Footer renders correctly", () => {
  it("Footer has the GDS-defined grey background", () => {
    render(<Footer isModalOpen={false} pathname="/" />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveStyle({ background: "rgb(243, 242, 241);" });
  });

  it("Tab index is correct when a modal is open", () => {
    render(<Footer isModalOpen pathname="/" />);
    const footerLink = screen.getAllByTestId("ai-notice-footer-link")[0];
    expect(footerLink).toHaveAttribute("tabindex", "-1");
  });
  it("Tab index is correct when a modal is not open", () => {
    render(<Footer isModalOpen={false} pathname="/" />);
    const footerLink = screen.getAllByTestId("ai-notice-footer-link")[0];
    expect(footerLink).toHaveAttribute("tabindex", "0");
  });

  describe("Footer has the correct classes based on pathname", () => {
    it("Correct classname when pathname === /chat", () => {
      render(<Footer isModalOpen={false} pathname="/chat" />);
      const footer = screen.getByTestId("footer-container");
      expect(footer).toHaveClass("footerModifiedPadding");
    });
    it("Correct classname when pathname !== /chat", () => {
      render(<Footer isModalOpen={false} pathname="/" />);
      const footer = screen.getByTestId("footer-container");
      expect(footer).not.toHaveClass("footerModifiedPadding");
    });
  });
});
