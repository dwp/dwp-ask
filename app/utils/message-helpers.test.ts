import "@testing-library/jest-dom";
import { trimWhitespace } from "./message-helpers";

// Mock window.getSelection
const mockGetSelection = jest.fn();
Object.defineProperty(window, "getSelection", {
  value: mockGetSelection,
  writable: true,
});

describe("trimWhitespace", () => {
  it("trims whitespace from copied text", () => {
    const mockClipboardData = {
      setData: jest.fn(),
    };

    const mockEvent = {
      preventDefault: jest.fn(),
      clipboardData: mockClipboardData,
    } as any;

    mockGetSelection.mockReturnValue({
      toString: () => "  test text with spaces  ",
    });

    trimWhitespace(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockClipboardData.setData).toHaveBeenCalledWith(
      "text/plain",
      "test text with spaces",
    );
  });

  it("handles empty selection", () => {
    const mockClipboardData = {
      setData: jest.fn(),
    };

    const mockEvent = {
      preventDefault: jest.fn(),
      clipboardData: mockClipboardData,
    } as any;

    mockGetSelection.mockReturnValue({
      toString: () => "",
    });

    trimWhitespace(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockClipboardData.setData).toHaveBeenCalledWith("text/plain", "");
  });

  it("handles null selection", () => {
    const mockClipboardData = {
      setData: jest.fn(),
    };

    const mockEvent = {
      preventDefault: jest.fn(),
      clipboardData: mockClipboardData,
    } as any;

    mockGetSelection.mockReturnValue(null);

    trimWhitespace(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockClipboardData.setData).toHaveBeenCalledWith(
      "text/plain",
      undefined,
    );
  });
});
