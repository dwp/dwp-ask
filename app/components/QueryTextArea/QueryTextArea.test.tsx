import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import QueryTextArea from "./QueryTextArea";
import Providers from "@/app/providers/Providers";

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

jest.mock("@/app/utils/api", () => ({
  sendQuery: jest.fn().mockResolvedValue([]),
}));

import { QueryTextAreaProps } from "@/app/types";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

const TestQueryTextAreaProps: QueryTextAreaProps = {
  onChange: jest.fn(),
  error: { invalidchar: true, blank: false, charcount: false, location: false },
  setError: jest.fn(),
  value: "Testing",
  isModalOpen: false,
  onKeyDown: jest.fn(),
  sendQueryAndClear: jest.fn(),
};

const InvalidValueProps: QueryTextAreaProps = {
  ...TestQueryTextAreaProps,
  value: "乱数假文",
};

const TestQueryTextArea = () => {
  return (
    <Providers>
      <QueryTextArea {...TestQueryTextAreaProps} />
    </Providers>
  );
};

describe("Query text area renders correctly", () => {
  it("Test 1", () => {
    render(<TestQueryTextArea />);
    const container = screen.getByTestId("query-text-area-container");
    expect(container).toBeInTheDocument();
  });
});

describe("Error handling", () => {
  it("Invalid characters triggers error", () => {
    render(
      <Providers>
        <QueryTextArea {...InvalidValueProps} />
      </Providers>,
    );
    expect(InvalidValueProps.setError).toHaveBeenCalled();
    expect(InvalidValueProps.error).toBeTruthy();
  });
});
