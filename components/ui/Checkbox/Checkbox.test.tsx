import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Checkbox from "./Checkbox";

const defaultProps = {
  id: "test-checkbox",
  value: "test-value",
  onChange: vi.fn(),
};

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
  vi.spyOn(console, "log").mockImplementation(vi.fn());
  vi.clearAllMocks();
});

describe("Checkbox", () => {
  describe("rendering", () => {
    it("renders the checkbox input", () => {
      render(<Checkbox {...defaultProps}>Option label</Checkbox>);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("renders the label text", () => {
      render(<Checkbox {...defaultProps}>Option label</Checkbox>);
      expect(screen.getByText("Option label")).toBeInTheDocument();
    });

    it("renders with the correct govuk class names", () => {
      const { container } = render(
        <Checkbox {...defaultProps}>Option label</Checkbox>,
      );
      expect(container.firstChild).toHaveClass("govuk-checkboxes__item");
      expect(screen.getByRole("checkbox")).toHaveClass(
        "govuk-checkboxes__input",
      );
      expect(screen.getByText("Option label")).toHaveClass(
        "govuk-label",
        "govuk-checkboxes__label",
      );
    });

    it("associates the label with the input via htmlFor and id", () => {
      render(<Checkbox {...defaultProps}>Option label</Checkbox>);
      const input = screen.getByRole("checkbox");
      const label = screen.getByText("Option label");
      expect(input).toHaveAttribute("id", "test-checkbox");
      expect(label).toHaveAttribute("for", "test-checkbox");
    });

    it("sets the name attribute to match the value", () => {
      render(<Checkbox {...defaultProps}>Option label</Checkbox>);
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "name",
        "test-value",
      );
    });

    it("sets the value attribute", () => {
      render(<Checkbox {...defaultProps}>Option label</Checkbox>);
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "value",
        "test-value",
      );
    });

    it("renders children as a React node", () => {
      render(
        <Checkbox {...defaultProps}>
          <span data-testid="child-node">Complex label</span>
        </Checkbox>,
      );
      expect(screen.getByTestId("child-node")).toBeInTheDocument();
    });
  });

  describe("disabled state", () => {
    it("is not disabled by default", () => {
      render(<Checkbox {...defaultProps}>Option label</Checkbox>);
      expect(screen.getByRole("checkbox")).not.toBeDisabled();
    });

    it("is disabled when the disabled prop is true", () => {
      render(
        <Checkbox {...defaultProps} disabled>
          Option label
        </Checkbox>,
      );
      expect(screen.getByRole("checkbox")).toBeDisabled();
    });
  });

  describe("aria attributes", () => {
    it("sets aria-checked to false", () => {
      render(
        <Checkbox {...defaultProps} aria-checked={false}>
          Option label
        </Checkbox>,
      );
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "aria-checked",
        "false",
      );
    });

    it("sets aria-checked to true", () => {
      render(
        <Checkbox {...defaultProps} aria-checked={true}>
          Option label
        </Checkbox>,
      );
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });
  });

  describe("data-testid", () => {
    it("applies the data-testid attribute to the input", () => {
      render(
        <Checkbox {...defaultProps} data-testid="my-checkbox">
          Option label
        </Checkbox>,
      );
      expect(screen.getByTestId("my-checkbox")).toBeInTheDocument();
    });
  });

  describe("tabIndex", () => {
    it("applies the tabIndex attribute to the input", () => {
      render(
        <Checkbox {...defaultProps} tabIndex={0}>
          Option label
        </Checkbox>,
      );
      expect(screen.getByRole("checkbox")).toHaveAttribute("tabindex", "0");
    });

    it("applies a negative tabIndex to remove the input from tab order", () => {
      render(
        <Checkbox {...defaultProps} tabIndex={-1}>
          Option label
        </Checkbox>,
      );
      expect(screen.getByRole("checkbox")).toHaveAttribute("tabindex", "-1");
    });
  });

  describe("interaction", () => {
    it("calls onChange when the checkbox is clicked", async () => {
      const onChange = vi.fn();
      render(
        <Checkbox {...defaultProps} onChange={onChange}>
          Option label
        </Checkbox>,
      );
      await userEvent.click(screen.getByRole("checkbox"));
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("calls onChange when the label is clicked", async () => {
      const onChange = vi.fn();
      render(
        <Checkbox {...defaultProps} onChange={onChange}>
          Option label
        </Checkbox>,
      );
      await userEvent.click(screen.getByText("Option label"));
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("does not call onChange when disabled", async () => {
      const onChange = vi.fn();
      render(
        <Checkbox {...defaultProps} onChange={onChange} disabled>
          Option label
        </Checkbox>,
      );
      await userEvent.click(screen.getByRole("checkbox"));
      expect(onChange).not.toHaveBeenCalled();
    });

    it("clicking a label only checks its own checkbox and not others", async () => {
      render(
        <>
          <Checkbox id="checkbox-one" value="one" onChange={vi.fn()}>
            Option one
          </Checkbox>
          <Checkbox id="checkbox-two" value="two" onChange={vi.fn()}>
            Option two
          </Checkbox>
          <Checkbox id="checkbox-three" value="three" onChange={vi.fn()}>
            Option three
          </Checkbox>
        </>,
      );

      const checkboxOne = screen.getByRole("checkbox", { name: "Option one" });
      const checkboxTwo = screen.getByRole("checkbox", { name: "Option two" });
      const checkboxThree = screen.getByRole("checkbox", {
        name: "Option three",
      });

      await userEvent.click(screen.getByText("Option two"));

      expect(checkboxTwo).toBeChecked();
      expect(checkboxOne).not.toBeChecked();
      expect(checkboxThree).not.toBeChecked();
    });
  });
});
