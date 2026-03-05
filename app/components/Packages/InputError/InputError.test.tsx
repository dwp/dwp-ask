import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import InputError from "./InputError";

describe("InputError Component", () => {
  describe("when type is invalidchar", () => {
    it("displays an error message for invalid characters", () => {
      const type = "invalidchar";
      const query = "invalidQuery@";
      const charLimit = 50;

      render(<InputError type={type} query={query} charLimit={charLimit} />);

      const errorMessage = screen.getByText(
        /Query contains invalid characters/i,
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe("when type is charcount", () => {
    it("displays an message if query is within character limit", () => {
      const type = "charcount";
      const query = "Valid query";
      const charLimit = 50;

      render(<InputError type={type} query={query} charLimit={charLimit} />);

      const errorMessage = screen.getByText(
        /Your question must be 50 characters or less./i,
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
