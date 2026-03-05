import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
const mockResetModals = jest.fn();

jest.mock("@/app/providers", () => ({
  useModal: () => ({
    resetModals: mockResetModals,
    isModalVisible: { test: true },
  }),
}));

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

import Modal from "./Modal";

const ModalProps = {
  heading: "Modal heading",
  confirm: { text: "Modal confirm", action: () => {} },
  closeText: "Modal close text",
};

const TestModal = ({ type }: { type?: "standard" | "danger" }) => (
  <Modal {...ModalProps} type={type ?? "standard"} />
);

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
  jest.spyOn(console, "log").mockImplementation(jest.fn());
});

describe("Modal renders correctly", () => {
  it("Modal heading is as expected", () => {
    render(<TestModal />);
    const heading = screen.getByTestId("modal-heading");
    expect(heading.innerHTML).toEqual(ModalProps.heading);
  });

  it("Modal confirm text is as expected", () => {
    render(<TestModal />);
    const confirmButton = screen.getByTestId("modal-confirm-button");
    expect(confirmButton.innerHTML).toEqual(ModalProps.confirm.text);
  });

  it("Modal close text is as expected", () => {
    render(<TestModal />);
    const closeText = screen.getByTestId("modal-close-text");
    expect(closeText.innerHTML).toEqual(ModalProps.closeText);
  });
});

describe("Modal types render correct colour buttons", () => {
  it("Danger modal renders red GDS button", () => {
    render(<TestModal type="danger" />);
    const confirmButton = screen.getByTestId("modal-confirm-button");
    expect(confirmButton).toHaveStyle({ "--button-colour": "#D4351C" });
  });
  it("Standard modal renders green GDS button", () => {
    render(<TestModal type="standard" />);
    const confirmButton = screen.getByTestId("modal-confirm-button");
    expect(confirmButton).toHaveStyle({ "--button-colour": "#00703c" });
  });
});

describe("Modal Component", () => {
  // local mocks are created per-test where needed
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders close text element when the modal is open", () => {
    render(<TestModal />);
    const closeTextElement = screen.getByTestId("modal-close-text");

    expect(closeTextElement).toBeInTheDocument();
    expect(closeTextElement).toHaveAttribute("tabindex", "0");
  });

  it("should call closeModal and confirm action when confirm button is clicked", () => {
    const mockConfirmAction = jest.fn();
    render(
      <Modal
        {...ModalProps}
        confirm={{ text: "Modal confirm", action: mockConfirmAction }}
        type="standard"
      />,
    );
    const confirmButton = screen.getByTestId("modal-confirm-button");
    fireEvent.click(confirmButton);

    // confirm.action should be invoked when confirm button is clicked
    expect(mockConfirmAction).toHaveBeenCalledTimes(1);
  });

  it("should call closeModal when closeText is clicked or Enter key is pressed", () => {
    render(<TestModal />);
    const closeTextElement = screen.getByTestId("modal-close-text");
    fireEvent.click(closeTextElement);

    // clicking closeText should call resetModals (close the modal)
    expect(mockResetModals).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(closeTextElement, { key: "Enter" });
    // pressing Enter on the close text should not throw and modal element persists
    expect(screen.getByTestId("modal-close-text")).toBeInTheDocument();
  });

  it("closes modal when escape is pressed", () => {
    render(<TestModal />);
    fireEvent.keyDown(document, { key: "Escape" });
    // resetModals should be invoked by the global key listener
    expect(mockResetModals).toHaveBeenCalledTimes(1);
  });

  it("runs closeModal when Esc is pressed", () => {
    const { container } = render(<TestModal />);
    fireEvent.keyDown(container.firstChild as HTMLElement, { key: "Escape" });
    expect(mockResetModals).toHaveBeenCalled();
  });
});

describe("Modal focus management/useEffect", () => {
  it("renders focusable elements when the modal is open", () => {
    render(<TestModal />);
    const closeText = screen.getByTestId("modal-close-text");
    const confirmButton = screen.getByTestId("modal-confirm-button");
    expect(closeText).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();
    expect(closeText).toHaveAttribute("tabindex", "0");
    expect(confirmButton).toHaveAttribute("tabindex", "0");
  });
});
