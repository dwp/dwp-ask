import { render } from "@testing-library/react";
import type { RedirectType } from "next/navigation";
import AuthWrapper from "./AuthWrapper";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
  vi.spyOn(console, "log").mockImplementation(vi.fn());
});

// Mock next/navigation redirect
const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (...args: [url: string, type?: typeof RedirectType]) =>
    mockRedirect(...args),
}));

// Helper to mock fetch
const mockFetch = (userGroups: string[]) => {
  vi.spyOn(global, "fetch").mockResolvedValue({
    json: vi.fn().mockResolvedValue({ user_groups: userGroups }),
  } as unknown as Response);
};

describe("AuthWrapper", () => {
  const children = <div data-testid="protected-content">Protected</div>;

  afterEach(() => {
    vi.clearAllMocks();
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
