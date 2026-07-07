import { fireEvent, render, screen } from "@testing-library/react";
import { mockComponents } from "@/utils/test";
import ChangeClaimantLocation from "./ChangeClaimantLocation";

const mockSetModalVisible = vi.fn();
vi.mock("@/providers", () => ({
  useModal: () => ({ setModalVisible: mockSetModalVisible }),
}));
vi.mock("@/components", () => mockComponents);
vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/chat"),
}));

import { usePathname } from "next/navigation";

describe("ChangeClaimantLocation", () => {
  beforeEach(() => {
    mockSetModalVisible.mockClear();
    vi.mocked(usePathname).mockReturnValue("/chat");
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

  it("calls setModalVisible with newChat when clicked", () => {
    render(<ChangeClaimantLocation />);

    const link = screen.getByTestId("change-claimant-location-link");
    fireEvent.click(link);

    expect(mockSetModalVisible).toHaveBeenCalledWith("newChat");
  });

  it("returns null when pathname is not /chat", () => {
    vi.mocked(usePathname).mockReturnValue("/admin");
    const { container } = render(<ChangeClaimantLocation />);
    expect(container.innerHTML).toBe("");
  });
});
