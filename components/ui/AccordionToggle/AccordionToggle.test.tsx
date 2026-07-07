import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AccordionToggle from "./AccordionToggle";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("../Chevrons/Chevrons", () => ({
  ChevronUp: ({ className }: { className?: string }) => (
    <svg data-testid="chevron-up" className={className} />
  ),
  ChevronDown: ({ className }: { className?: string }) => (
    <svg data-testid="chevron-down" className={className} />
  ),
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const toggleText = { hidden: "Show", visible: "Hide" };

function renderAccordionToggle(
  overrides: Partial<React.ComponentProps<typeof AccordionToggle>> = {},
) {
  const setIsOpen = vi.fn();
  const utils = render(
    <AccordionToggle
      toggleText={toggleText}
      isOpen={false}
      setIsOpen={setIsOpen}
      labelledBy="my-label"
      {...overrides}
    >
      <span>Toggle content</span>
    </AccordionToggle>,
  );
  return { ...utils, setIsOpen };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AccordionToggle", () => {
  describe("rendering", () => {
    it("renders the accordion wrapper", () => {
      renderAccordionToggle();

      expect(screen.getByTestId("accordion-item")).toBeInTheDocument();
    });

    it("renders the toggle text paragraph", () => {
      renderAccordionToggle();

      expect(screen.getByText("Show")).toBeInTheDocument();
    });

    it("applies cursor-pointer and govuk-blue colour class to the text", () => {
      renderAccordionToggle();

      const button = screen.getByRole("button");
      expect(button).toHaveClass("cursor-pointer", "text-[var(--govuk-blue)]");
    });

    it("forwards dataTestId to the toggle text paragraph", () => {
      renderAccordionToggle({ dataTestId: "my-toggle" });

      expect(screen.getByTestId("my-toggle")).toBeInTheDocument();
    });

    it("does not set a data-testid on the text paragraph when dataTestId is omitted", () => {
      renderAccordionToggle();

      // paragraph is still accessible by text; no testid attribute
      const para = screen.getByText("Show");
      expect(para).not.toHaveAttribute("data-testid");
    });
  });

  describe("chevrons", () => {
    it("renders ChevronDown when closed", () => {
      renderAccordionToggle({ isOpen: false });

      expect(screen.getByTestId("chevron-down")).toBeInTheDocument();
      expect(screen.queryByTestId("chevron-up")).not.toBeInTheDocument();
    });

    it("renders ChevronUp when open", () => {
      renderAccordionToggle({ isOpen: true });

      expect(screen.getByTestId("chevron-up")).toBeInTheDocument();
      expect(screen.queryByTestId("chevron-down")).not.toBeInTheDocument();
    });

    it("applies the govuk-blue colour class to the chevron", () => {
      renderAccordionToggle({ isOpen: false });

      expect(screen.getByTestId("chevron-down")).toHaveClass(
        "text-[var(--govuk-blue)]",
      );
    });
  });

  describe("toggle text", () => {
    it("shows the hidden text when closed", () => {
      renderAccordionToggle({ isOpen: false });

      expect(screen.getByText("Show")).toBeInTheDocument();
    });

    it("shows the visible text when open", () => {
      renderAccordionToggle({ isOpen: true });

      expect(screen.getByText("Hide")).toBeInTheDocument();
    });

    it("reflects custom toggleText values", () => {
      renderAccordionToggle({
        toggleText: { hidden: "Expand", visible: "Collapse" },
        isOpen: false,
      });

      expect(screen.getByText("Expand")).toBeInTheDocument();
    });
  });

  describe("aria-expanded", () => {
    it("sets aria-expanded to false when closed", () => {
      renderAccordionToggle({ isOpen: false });

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("sets aria-expanded to true when open", () => {
      renderAccordionToggle({ isOpen: true });

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });
  });

  describe("content visibility", () => {
    it("does not render content when closed", () => {
      renderAccordionToggle({ isOpen: false });

      expect(
        screen.queryByTestId("accordion-filter-item-content"),
      ).not.toBeInTheDocument();
    });

    it("renders content when open", () => {
      renderAccordionToggle({ isOpen: true });

      expect(
        screen.getByTestId("accordion-filter-item-content"),
      ).toBeInTheDocument();
    });

    it("renders children inside the content area when open", () => {
      renderAccordionToggle({ isOpen: true });

      expect(
        screen.getByTestId("accordion-filter-item-content"),
      ).toHaveTextContent("Toggle content");
    });

    it("applies mt-5 class to the content area", () => {
      renderAccordionToggle({ isOpen: true });

      expect(screen.getByTestId("accordion-filter-item-content")).toHaveClass(
        "mt-5",
      );
    });
  });

  describe("interaction — text click", () => {
    it("calls setIsOpen with true when clicking the text while closed", async () => {
      const { setIsOpen } = renderAccordionToggle({ isOpen: false });

      await userEvent.click(screen.getByText("Show"));

      expect(setIsOpen).toHaveBeenCalledTimes(1);
      expect(setIsOpen).toHaveBeenCalledWith(true);
    });

    it("calls setIsOpen with false when clicking the text while open", async () => {
      const { setIsOpen } = renderAccordionToggle({ isOpen: true });

      await userEvent.click(screen.getByText("Hide"));

      expect(setIsOpen).toHaveBeenCalledTimes(1);
      expect(setIsOpen).toHaveBeenCalledWith(false);
    });
  });

  describe("interaction — chevron click", () => {
    it("calls setIsOpen with true when clicking the chevron while closed", async () => {
      const { setIsOpen } = renderAccordionToggle({ isOpen: false });

      await userEvent.click(screen.getByTestId("chevron-down").parentElement!);

      expect(setIsOpen).toHaveBeenCalledTimes(1);
      expect(setIsOpen).toHaveBeenCalledWith(true);
    });

    it("calls setIsOpen with false when clicking the chevron while open", async () => {
      const { setIsOpen } = renderAccordionToggle({ isOpen: true });

      await userEvent.click(screen.getByTestId("chevron-up").parentElement!);

      expect(setIsOpen).toHaveBeenCalledTimes(1);
      expect(setIsOpen).toHaveBeenCalledWith(false);
    });
  });
});
