import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Main from "./Main";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("Main renders correctly", () => {
  it("Main component is in the document", () => {
    render(<Main data-testid="main-data-testid">Main wrapper</Main>);
    const main = screen.getByTestId("main-data-testid");
    expect(main).toBeInTheDocument();
  });
});
