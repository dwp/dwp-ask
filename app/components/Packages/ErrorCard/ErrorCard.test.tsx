import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ErrorCard from "./ErrorCard";

const ErrorApiMesssage = () => <p>There is a technical issue.</p>;

describe("Card renders correctly", () => {
  it("Card renders text correctly", () => {
    render(
      <ErrorCard>
        <ErrorApiMesssage />
      </ErrorCard>,
    );
    const errorCard = screen.getByTestId("error-card-heading");
    expect(errorCard.innerHTML).toBe("There is a problem");
  });
});
