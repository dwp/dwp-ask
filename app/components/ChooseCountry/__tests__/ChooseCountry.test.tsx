import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mocks
jest.mock("@/app/utils", () => ({
  addHistory: jest.fn(),
  loadHistory: jest.fn(),
}));

jest.mock("@/app/providers/LocationProvider", () => ({
  useLocation: jest.fn(),
}));

jest.mock("../../Answer/Answer", () => ({
  __esModule: true,
  default: () =>
    React.createElement("div", { "data-testid": "answer-stub" }, "AnswerStub"),
}));

import { addHistory, loadHistory } from "@/app/utils";
import { useLocation } from "@/app/providers/LocationProvider";

import ChooseCountry from "../ChooseCountry";

describe("ChooseCountry", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders Answer and adds initial message when location is not set and history is empty", () => {
    (useLocation as jest.Mock).mockReturnValue({ location: null });
    (loadHistory as jest.Mock).mockReturnValue([]);

    const setLoadedChatHistory = jest.fn();
    const setTyping = jest.fn();

    render(
      <ChooseCountry
        setLoadedChatHistory={setLoadedChatHistory}
        setTyping={setTyping}
      />,
    );

    // Answer stub should be rendered
    expect(screen.getByTestId("answer-stub")).toBeInTheDocument();

    // setLoadedChatHistory should have been called with an updater function
    expect(setLoadedChatHistory).toHaveBeenCalled();
    const firstArg = (setLoadedChatHistory as jest.Mock).mock.calls[0][0];
    expect(typeof firstArg).toBe("function");

    // When React executes the updater it should call addHistory and return the new array
    const returned = firstArg([]);
    expect(addHistory).toHaveBeenCalled();
    expect(Array.isArray(returned)).toBe(true);
  });

  it("renders nothing when a location is already set", () => {
    (useLocation as jest.Mock).mockReturnValue({ location: "GB" });
    (loadHistory as jest.Mock).mockReturnValue([]);

    const setLoadedChatHistory = jest.fn();
    const setTyping = jest.fn();

    const { container } = render(
      <ChooseCountry
        setLoadedChatHistory={setLoadedChatHistory}
        setTyping={setTyping}
      />,
    );

    // When a location exists, ChooseCountry returns an empty fragment
    expect(container).toBeTruthy();
    expect(screen.queryByTestId("answer-stub")).toBeNull();
  });
});
