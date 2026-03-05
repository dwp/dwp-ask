import getFeedback from "../getFeedback";

global.fetch = jest.fn();

describe("getFeedback", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns data on successful response", async () => {
    const mockData = { data: [] };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await getFeedback();

    expect(fetch).toHaveBeenCalledWith("/api/get-feedback", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    expect(result).toEqual(mockData);
  });

  it("throws error on failed response", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getFeedback()).rejects.toThrow("HTTP error! status: 500");
  });
});
