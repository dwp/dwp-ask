import { fireEvent, render, screen } from "@testing-library/react";
import { LOCATIONS } from "@/constants/Locations";
import Providers from "@/providers/Providers";
import CountryCards from "../CountryCards";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/chat"),
}));

import { usePathname } from "next/navigation";

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

describe("CountryCards", () => {
  it("renders a card for each location and calls handler on click", () => {
    vi.mocked(usePathname).mockReturnValue("/chat");
    const onClickHandler = vi.fn();

    render(
      <Providers>
        <CountryCards onClickHandler={onClickHandler} />
      </Providers>,
    );

    // All locations should render
    LOCATIONS.forEach((loc) => {
      expect(screen.getByText(loc)).toBeInTheDocument();
    });

    // Click the first location and expect handler called with the location
    const first = LOCATIONS[0];
    const node = screen.getByText(first);
    fireEvent.click(node);
    expect(onClickHandler).toHaveBeenCalledTimes(1);
    expect(onClickHandler).toHaveBeenCalledWith(first);
  });

  it("returns null on /chat/view-details path", () => {
    vi.mocked(usePathname).mockReturnValue("/chat/view-details");

    render(
      <Providers>
        <CountryCards onClickHandler={vi.fn()} />
      </Providers>,
    );

    expect(screen.queryByTestId("country-cards")).not.toBeInTheDocument();
  });

  it("returns null on /admin/view-details path", () => {
    vi.mocked(usePathname).mockReturnValue("/admin/view-details");

    render(
      <Providers>
        <CountryCards onClickHandler={vi.fn()} />
      </Providers>,
    );

    expect(screen.queryByTestId("country-cards")).not.toBeInTheDocument();
  });
});
