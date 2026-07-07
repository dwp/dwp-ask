import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import Providers from "@/providers/Providers";
import Card from "./Card";

const onClick = vi.fn();
const TEST_QUESTION =
  "What support is available for someone out of work to get help with a CV or work experience?";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

beforeEach(() => {
  onClick.mockClear();
});

const renderCard = (props: Partial<ComponentProps<typeof Card>> = {}) =>
  render(
    <Providers>
      <Card onClick={onClick} text={TEST_QUESTION} {...props} />
    </Providers>,
  );

describe("Card renders correctly", () => {
  it("Card renders text correctly", () => {
    renderCard();
    const card = screen.getByText(TEST_QUESTION);
    expect(card.innerHTML).toEqual(TEST_QUESTION);
  });
});

describe("onclick handler runs", () => {
  it("onclick runs", () => {
    renderCard();
    const card = screen.getByText(TEST_QUESTION);
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalled();
  });

  it("applies custom data-testid value", () => {
    renderCard({ dataTestId: "custom-card" });
    expect(screen.getByTestId("custom-card")).toBeInTheDocument();
  });

  it("disables the card when disabled is true", () => {
    renderCard({ disabled: true });
    const button = screen.getByRole("button", { name: TEST_QUESTION });
    expect(button).toBeDisabled();
  });

  it("sets tabIndex to -1 when window width is small", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 500,
      configurable: true,
    });
    renderCard();
    const button = screen.getByRole("button", { name: TEST_QUESTION });
    expect(button).toHaveAttribute("tabindex", "-1");
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      configurable: true,
    });
  });
});
