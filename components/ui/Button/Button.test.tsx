import { fireEvent, render, screen } from "@testing-library/react";
import Button from "./Button";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(vi.fn());
});

const onClick = vi.fn();

describe("Button renders correctly", () => {
  it("Button renders text correctly", () => {
    render(
      <Button
        data-testid="landing-start-chat-button"
        aria-label="Start chat"
        start
        onClick={onClick}
      >
        Start chat
      </Button>,
    );
    const button = screen.getByText("Start chat");
    expect(button.innerHTML).toEqual("Start chat");
  });
});

describe("onclick handler runs", () => {
  it("onclick runs", () => {
    render(
      <Button
        data-testid="landing-start-chat-button"
        aria-label="Start chat"
        start
        onClick={onClick}
      >
        Start chat
      </Button>,
    );
    const button = screen.getByText("Start chat");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it("renders with icon", () => {
    const icon = <span data-testid="test-icon">→</span>;
    render(
      <Button icon={icon} data-testid="icon-button">
        Button with icon
      </Button>,
    );

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("Button with icon")).toBeInTheDocument();
  });
});
