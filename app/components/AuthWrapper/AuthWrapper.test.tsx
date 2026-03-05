import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthWrapper from "./AuthWrapper";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

// Mock next/navigation redirect
const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  redirect: (...args: any[]) => mockRedirect(...args),
}));

// Helper to mock fetch
const mockFetch = (userGroups: string[]) => {
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue({ user_groups: userGroups }),
  }) as any;
};

describe("AuthWrapper", () => {
  const children = <div data-testid="protected-content">Protected</div>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing if user is not in required group and redirect is false", async () => {
    mockFetch(["user"]);
    const result = await AuthWrapper({
      children,
      redirectConfig: { redirect: false },
    });
    // Render the result to test output
    const { container } = render(result);
    expect(container).toBeEmptyDOMElement();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("calls redirect if user is not in required group and redirect is true", async () => {
    mockFetch(["user"]);
    await AuthWrapper({
      children,
      redirectConfig: { redirect: true, redirectPage: "/login" },
    });
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });
});
