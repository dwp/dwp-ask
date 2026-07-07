import "@testing-library/jest-dom";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockInstance,
  vi,
} from "vitest";
import downloadMessagesCsv from "../downloadMessagesCsv";

describe("downloadMessagesCsv", () => {
  let mockAppendChild: MockInstance;
  let mockRemoveChild: MockInstance;
  let mockClick: MockInstance;

  beforeEach(() => {
    mockAppendChild = vi
      .spyOn(document.body, "appendChild")
      .mockImplementation(vi.fn());
    mockRemoveChild = vi
      .spyOn(document.body, "removeChild")
      .mockImplementation(vi.fn());
    mockClick = vi.fn();

    vi.spyOn(document, "createElement").mockReturnValue({
      href: "",
      download: "",
      click: mockClick,
    } as unknown as HTMLElement);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create anchor element with correct attributes and trigger download", async () => {
    await downloadMessagesCsv();

    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();

    const createdElement = vi.mocked(document.createElement).mock.results[0]
      .value as unknown as HTMLAnchorElement;
    expect(createdElement.href).toBe("/api/download-messages-csv");
    expect(createdElement.download).toBe("messages.csv");
  });
});
