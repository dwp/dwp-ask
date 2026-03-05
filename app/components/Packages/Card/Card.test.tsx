import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Card from "./Card";
import Providers from "@/app/providers/Providers";

const onClick = jest.fn();
const TEST_QUESTION =
  "What support is available for someone out of work to get help with a CV or work experience?";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

const TestCard = () => (
  <Providers>
    <Card onClick={onClick} text={TEST_QUESTION} />
  </Providers>
);

describe("Card renders correctly", () => {
  it("Card renders text correctly", () => {
    render(<TestCard />);
    const card = screen.getByText(TEST_QUESTION);
    expect(card.innerHTML).toEqual(TEST_QUESTION);
  });
});

describe("onclick handler runs", () => {
  it("onclick runs", () => {
    render(<TestCard />);
    const card = screen.getByText(TEST_QUESTION);
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalled();
  });
});
