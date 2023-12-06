import React from "react";
import { render, fireEvent, screen} from "@testing-library/react";
import SwapButton from "../../src/components/ExchangeCourses/MyCourses/SwapButton";
import { useApi } from "../../src/contexts/ApiProvider";

jest.mock("../../src/contexts/ApiProvider", () => ({
  useApi: jest.fn(),
}));

jest.mock("../../src/Hooks/ApiClient", () => {
  return {
    BASE_API_URL: "http://127.0.0.1:7000",
    // other exports
  };
});

beforeEach(() => {
  // Clear mock calls before each test
  jest.clearAllMocks();
});

describe("SwapButton Component", () => {
  // Rendering Tests
  test("renders SwapButton with initial UI elements", () => {
    render(<SwapButton />);
    expect(
      screen.getByRole("button", { name: /swap with/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm swap/i })
    ).toBeDisabled();
  });

  // Interaction and Asynchronous Operation Tests
  test("opens menu and fetches available swaps on button click", async () => {
    // Mock useApi hook
    const mockGet = jest.fn(() => Promise.resolve({ status: 200 }));
    useApi.mockReturnValue({ get: mockGet });

    render(<SwapButton />);
    fireEvent.click(screen.getByRole("button", { name: /swap with/i }));


    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith("/availableswaps");
  });
});

// State Management Tests
// Note: Testing internal state changes might require additional techniques or tools
