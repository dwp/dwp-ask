/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import downloadMessagesCsv from "../downloadMessagesCsv";

describe("downloadMessagesCsv", () => {
  let mockAppendChild: jest.SpyInstance;
  let mockRemoveChild: jest.SpyInstance;
  let mockClick: jest.SpyInstance;

  beforeEach(() => {
    mockAppendChild = jest
      .spyOn(document.body, "appendChild")
      .mockImplementation();
    mockRemoveChild = jest
      .spyOn(document.body, "removeChild")
      .mockImplementation();
    mockClick = jest.fn();

    jest.spyOn(document, "createElement").mockReturnValue({
      href: "",
      download: "",
      click: mockClick,
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should create anchor element with correct attributes and trigger download", async () => {
    await downloadMessagesCsv();

    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();

    const createdElement = (document.createElement as jest.Mock).mock.results[0]
      .value;
    expect(createdElement.href).toBe("/api/download-messages-csv");
    expect(createdElement.download).toBe("messages.csv");
  });
});
