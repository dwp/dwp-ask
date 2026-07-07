import { describe, expect, it, vi } from "vitest";
import { trimWhitespace } from "./message-helpers";

// Mock window.getSelection
const mockGetSelection = vi.fn();
Object.defineProperty(window, "getSelection", {
  value: mockGetSelection,
  writable: true,
});

describe("trimWhitespace", () => {
  it("trims whitespace from copied text", () => {
    const mockClipboardData = {
      setData: vi.fn(),
    };

    const mockEvent = {
      preventDefault: vi.fn(),
      clipboardData: mockClipboardData,
    } as unknown as React.ClipboardEvent<HTMLElement>;

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
      setData: vi.fn(),
    };

    const mockEvent = {
      preventDefault: vi.fn(),
      clipboardData: mockClipboardData,
    } as unknown as React.ClipboardEvent<HTMLElement>;

    mockGetSelection.mockReturnValue({
      toString: () => "",
    });

    trimWhitespace(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockClipboardData.setData).toHaveBeenCalledWith("text/plain", "");
  });

  it("handles null selection", () => {
    const mockClipboardData = {
      setData: vi.fn(),
    };

    const mockEvent = {
      preventDefault: vi.fn(),
      clipboardData: mockClipboardData,
    } as unknown as React.ClipboardEvent<HTMLElement>;

    mockGetSelection.mockReturnValue(null);

    trimWhitespace(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockClipboardData.setData).toHaveBeenCalledWith(
      "text/plain",
      undefined,
    );
  });
});
