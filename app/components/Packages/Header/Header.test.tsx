import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

jest.mock("../../Navbar/Navbar", () => {
  return function MockNavbar() {
    return <div data-testid="mock-navbar">Navbar</div>;
  };
});

jest.mock("next/headers", () => {
  return {
    headers: jest.fn().mockReturnValue({
      get: jest.fn().mockReturnValue({
        value: "en",
      }),
    }),
  };
});

import Header from "./Header";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("Header renders correctly", () => {
  it("Title renders correctly", async () => {
    const HeaderComponent = await Header();
    render(HeaderComponent);
    const dwpText = screen.getByTestId("header-dwp-text");
    expect(dwpText.innerHTML).toEqual("DWP");
  });
  it("Subtitle renders correctly", async () => {
    const HeaderComponent = await Header();
    render(HeaderComponent);
    const askText = screen.getByTestId("header-ask-text");
    expect(askText.innerHTML).toEqual("Ask");
  });
});
