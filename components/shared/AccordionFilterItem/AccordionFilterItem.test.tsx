import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AccordionFilterItem from "./AccordionFilterItem";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/components", () => ({
  Title: ({
    children,
    "data-testid": testId,
  }: {
    children: React.ReactNode;
    "data-testid"?: string;
  }) => <p data-testid={testId}>{children}</p>,
  AccordionToggle: ({
    toggleText,
    isOpen,
    setIsOpen,
    children,
  }: {
    toggleText: { hidden: string; visible: string };
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    children: React.ReactNode;
  }) => (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? toggleText.visible : toggleText.hidden}
      </button>
      {isOpen && <div data-testid="accordion-content">{children}</div>}
    </div>
  ),
  SectionBreak: ({ visible, level }: { visible: boolean; level: string }) => (
    <hr data-testid="section-break" data-visible={visible} data-level={level} />
  ),
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

function renderAccordionFilterItem(
  overrides: Partial<React.ComponentProps<typeof AccordionFilterItem>> = {},
) {
  return render(
    <AccordionFilterItem title="Category" {...overrides}>
      <span>Filter content</span>
    </AccordionFilterItem>,
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AccordionFilterItem", () => {
  describe("rendering", () => {
    it("renders the title in a paragraph", () => {
      renderAccordionFilterItem({ title: "Category" });

      expect(
        screen.getByTestId("accordion-filter-item-title-category"),
      ).toBeInTheDocument();
    });

    it("lowercases the title in the data-testid", () => {
      renderAccordionFilterItem({ title: "My Filter" });

      expect(
        screen.getByTestId("accordion-filter-item-title-my filter"),
      ).toBeInTheDocument();
    });

    it("renders children inside the accordion", async () => {
      renderAccordionFilterItem();

      await userEvent.click(screen.getByRole("button", { name: "Show" }));

      expect(screen.getByTestId("accordion-content")).toHaveTextContent(
        "Filter content",
      );
    });
  });

  describe("default open state", () => {
    it("is closed by default when openByDefault is not provided", () => {
      renderAccordionFilterItem();

      expect(screen.getByRole("button")).toHaveTextContent("Show");
      expect(screen.queryByTestId("accordion-content")).not.toBeInTheDocument();
    });

    it("is closed when openByDefault is false", () => {
      renderAccordionFilterItem({ openByDefault: false });

      expect(screen.getByRole("button")).toHaveTextContent("Show");
      expect(screen.queryByTestId("accordion-content")).not.toBeInTheDocument();
    });

    it("is open when openByDefault is true", () => {
      renderAccordionFilterItem({ openByDefault: true });

      expect(screen.getByRole("button")).toHaveTextContent("Hide");
      expect(screen.getByTestId("accordion-content")).toBeInTheDocument();
    });
  });

  describe("toggle behaviour", () => {
    it("opens the accordion when the toggle button is clicked while closed", async () => {
      renderAccordionFilterItem();

      await userEvent.click(screen.getByRole("button", { name: "Show" }));

      expect(screen.getByRole("button")).toHaveTextContent("Hide");
      expect(screen.getByTestId("accordion-content")).toBeInTheDocument();
    });

    it("closes the accordion when the toggle button is clicked while open", async () => {
      renderAccordionFilterItem({ openByDefault: true });

      await userEvent.click(screen.getByRole("button", { name: "Hide" }));

      expect(screen.getByRole("button")).toHaveTextContent("Show");
      expect(screen.queryByTestId("accordion-content")).not.toBeInTheDocument();
    });

    it("toggles correctly across multiple clicks", async () => {
      renderAccordionFilterItem();
      const button = screen.getByRole("button");

      await userEvent.click(button); // open
      expect(button).toHaveTextContent("Hide");

      await userEvent.click(button); // close
      expect(button).toHaveTextContent("Show");

      await userEvent.click(button); // open again
      expect(button).toHaveTextContent("Hide");
    });
  });

  describe("SectionBreak", () => {
    it("renders SectionBreak when title is 'Filter your results' and accordion is closed", () => {
      renderAccordionFilterItem({ title: "Filter your results" });

      expect(screen.getByTestId("section-break")).toBeInTheDocument();
    });

    it("does not render SectionBreak when title is 'Filter your results' and accordion is open", async () => {
      renderAccordionFilterItem({ title: "Filter your results" });

      await userEvent.click(screen.getByRole("button", { name: "Show" }));

      expect(screen.queryByTestId("section-break")).not.toBeInTheDocument();
    });

    it("does not render SectionBreak when title is 'Filter your results' and openByDefault is true", () => {
      renderAccordionFilterItem({
        title: "Filter your results",
        openByDefault: true,
      });

      expect(screen.queryByTestId("section-break")).not.toBeInTheDocument();
    });

    it("does not render SectionBreak for any other title when closed", () => {
      renderAccordionFilterItem({ title: "Category" });

      expect(screen.queryByTestId("section-break")).not.toBeInTheDocument();
    });

    it("renders SectionBreak with visible=true and level='m'", () => {
      renderAccordionFilterItem({ title: "Filter your results" });

      const sectionBreak = screen.getByTestId("section-break");
      expect(sectionBreak).toHaveAttribute("data-visible", "true");
      expect(sectionBreak).toHaveAttribute("data-level", "m");
    });

    it("re-renders SectionBreak after closing the accordion again", async () => {
      renderAccordionFilterItem({ title: "Filter your results" });

      await userEvent.click(screen.getByRole("button", { name: "Show" })); // open
      expect(screen.queryByTestId("section-break")).not.toBeInTheDocument();

      await userEvent.click(screen.getByRole("button", { name: "Hide" })); // close
      expect(screen.getByTestId("section-break")).toBeInTheDocument();
    });
  });
});
