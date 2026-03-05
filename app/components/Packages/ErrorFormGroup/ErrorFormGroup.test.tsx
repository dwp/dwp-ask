import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorFormGroup from "./ErrorFormGroup";

describe("ErrorFormGroup", () => {
  it("renders children", () => {
    render(
      <ErrorFormGroup>
        <input data-testid="child-input" />
      </ErrorFormGroup>,
    );
    expect(screen.getByTestId("child-input")).toBeInTheDocument();
  });

  it("does not render error message when error is false", () => {
    render(
      <ErrorFormGroup error={false} errorMessage="This is an error">
        <input />
      </ErrorFormGroup>,
    );
    expect(screen.queryByText("This is an error")).not.toBeInTheDocument();
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("renders error message when error is true", () => {
    render(
      <ErrorFormGroup error={true} errorMessage="This is an error">
        <input />
      </ErrorFormGroup>,
    );
    expect(screen.getByText("This is an error")).toBeInTheDocument();
    expect(screen.getByText("Error:")).toBeInTheDocument();
  });

  it("applies govuk-form-group--error class when error is true", () => {
    const { container } = render(
      <ErrorFormGroup error={true} errorMessage="Error!">
        <input />
      </ErrorFormGroup>,
    );
    expect(container.firstChild).toHaveClass("govuk-form-group--error");
  });

  it("sets the error id on the error message", () => {
    render(
      <ErrorFormGroup
        error={true}
        errorMessage="Error!"
        errorId="custom-error-id"
      >
        <input />
      </ErrorFormGroup>,
    );
    expect(screen.getByText("Error!").closest("p")).toHaveAttribute(
      "id",
      "custom-error-id",
    );
  });
});
