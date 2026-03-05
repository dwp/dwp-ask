import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChangeClaimantLocation from "./ChangeClaimantLocation";

const mockSetModalVisible = jest.fn();

jest.mock("@/app/providers", () => ({
  useModal: () => ({
    setModalVisible: mockSetModalVisible,
  }),
}));

jest.mock("@/app/components", () => ({
  // amazonq-ignore-next-line
  Link: ({ children, onClick, ...props }: any) => (
    <a onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/chat",
}));

describe("ChangeClaimantLocation", () => {
  beforeEach(() => {
    mockSetModalVisible.mockClear();
  });

  it("renders with correct text and attributes", () => {
    render(<ChangeClaimantLocation />);

    const link = screen.getByTestId("change-claimant-location-link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent("Change claimant country");
    expect(link).toHaveAttribute("role", "menuitem");
  });

  it("applies custom className", () => {
    render(<ChangeClaimantLocation className="custom-class" />);

    const link = screen.getByTestId("change-claimant-location-link");
    expect(link).toHaveClass("custom-class");
  });

  it("calls setModalVisible with clearChat when clicked", () => {
    render(<ChangeClaimantLocation />);

    const link = screen.getByTestId("change-claimant-location-link");
    fireEvent.click(link);

    expect(mockSetModalVisible).toHaveBeenCalledWith("clearChat");
  });
});
