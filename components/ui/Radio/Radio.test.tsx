import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Radio from "./Radio";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const option = { value: "yes", label: "Yes" };

function renderRadio(
  overrides: Partial<React.ComponentProps<typeof Radio>> = {},
) {
  const onChange = vi.fn();
  const utils = render(
    <Radio
      option={option}
      name="confirm"
      checked={false}
      onChange={onChange}
      {...overrides}
    />,
  );
  return { ...utils, onChange };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Radio", () => {
  describe("rendering", () => {
    it("renders a radio input and its label", () => {
      renderRadio();

      expect(screen.getByTestId("radio-item-input")).toBeInTheDocument();
      expect(screen.getByTestId("radio-item-input-label")).toBeInTheDocument();
    });

    it("applies the govuk class to the wrapper div", () => {
      const { container } = renderRadio();

      expect(container.firstChild).toHaveClass("govuk-radios__item");
    });

    it("applies the govuk class to the input", () => {
      renderRadio();

      expect(screen.getByTestId("radio-item-input")).toHaveClass(
        "govuk-radios__input",
      );
    });

    it("applies the govuk classes to the label", () => {
      renderRadio();

      const label = screen.getByTestId("radio-item-input-label");
      expect(label).toHaveClass("govuk-label", "govuk-radios__label");
    });

    it("sets the input type to radio", () => {
      renderRadio();

      expect(screen.getByTestId("radio-item-input")).toHaveAttribute(
        "type",
        "radio",
      );
    });

    it("sets the input value from option.value", () => {
      renderRadio();

      expect(screen.getByTestId("radio-item-input")).toHaveAttribute(
        "value",
        "yes",
      );
    });

    it("sets the input id derived from option.value", () => {
      renderRadio();

      expect(screen.getByTestId("radio-item-input")).toHaveAttribute(
        "id",
        "yes-radios-input",
      );
    });

    it("links the label to the input via htmlFor", () => {
      renderRadio();

      expect(screen.getByTestId("radio-item-input-label")).toHaveAttribute(
        "for",
        "yes-radios-input",
      );
    });

    it("renders the label text from option.label", () => {
      renderRadio();

      expect(screen.getByTestId("radio-item-input-label")).toHaveTextContent(
        "Yes",
      );
    });

    it("sets the name attribute on the input", () => {
      renderRadio();

      expect(screen.getByTestId("radio-item-input")).toHaveAttribute(
        "name",
        "confirm",
      );
    });

    it("sets tabIndex to 0", () => {
      renderRadio();

      expect(screen.getByTestId("radio-item-input")).toHaveAttribute(
        "tabindex",
        "0",
      );
    });
  });

  describe("checked state", () => {
    it("is unchecked when checked=false", () => {
      renderRadio({ checked: false });

      expect(screen.getByTestId("radio-item-input")).not.toBeChecked();
    });

    it("is checked when checked=true", () => {
      renderRadio({ checked: true });

      expect(screen.getByTestId("radio-item-input")).toBeChecked();
    });
  });

  describe("data-testid", () => {
    it("defaults to 'radio-item' when no data-testid is provided", () => {
      renderRadio();

      expect(screen.getByTestId("radio-item-input")).toBeInTheDocument();
      expect(screen.getByTestId("radio-item-input-label")).toBeInTheDocument();
    });

    it("uses a custom data-testid as the prefix when provided", () => {
      renderRadio({ "data-testid": "agree-radio" });

      expect(screen.getByTestId("agree-radio-input")).toBeInTheDocument();
      expect(screen.getByTestId("agree-radio-input-label")).toBeInTheDocument();
    });
  });

  describe("onChange", () => {
    it("calls onChange with the option when the input is clicked", async () => {
      const { onChange } = renderRadio();

      await userEvent.click(screen.getByTestId("radio-item-input"));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(option);
    });

    it("calls onChange with the option when the label is clicked", async () => {
      const { onChange } = renderRadio();

      await userEvent.click(screen.getByTestId("radio-item-input-label"));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(option);
    });

    it("does not call onChange when rendered but not interacted with", () => {
      const { onChange } = renderRadio();

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("option variations", () => {
    it("renders correctly with a numeric string value", () => {
      const numericOption = { value: "42", label: "Forty Two" };
      renderRadio({ option: numericOption });

      expect(screen.getByTestId("radio-item-input")).toHaveAttribute(
        "value",
        "42",
      );
      expect(screen.getByTestId("radio-item-input")).toHaveAttribute(
        "id",
        "42-radios-input",
      );
    });

    it("renders correctly with a multi-word label", () => {
      const multiWordOption = { value: "not-sure", label: "I am not sure" };
      renderRadio({ option: multiWordOption });

      expect(screen.getByTestId("radio-item-input-label")).toHaveTextContent(
        "I am not sure",
      );
    });
  });
});
