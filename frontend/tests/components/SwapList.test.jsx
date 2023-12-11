import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SwapList from "../../src/components/ExchangeCourses/Swap/SwapList.jsx"; // Adjust the import path as necessary
import { useApi } from "../../src/contexts/ApiProvider";

// Mock the useApi hook
jest.mock("../../src/contexts/ApiProvider", () => ({
  useApi: jest.fn(),
}));

const mockSwaps = [
  {
    swap_id: 1,
    user_id: "123",
    giving_course_code: "MATH101",
    giving_course_name: "Mathematics",
    wanted_course_code: "PHY102",
    wanted_course_name: "Physics",
  },
  // Add more mock swap data as needed
];

describe("SwapList", () => {
  beforeEach(() => {
    useApi.mockReturnValue({
      get: jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        body: { available_swaps: mockSwaps },
      }),
    });
  });

  it("renders the component", async () => {
    render(<SwapList />);
    await waitFor(() =>
      expect(screen.getByText("Swap Courses")).toBeInTheDocument()
    );
  });

  it("displays loading indicator while fetching swaps", () => {
    useApi.mockReturnValue({
      get: jest.fn(() => new Promise(() => {})), // Never resolving promise to simulate loading
    });
    render(<SwapList />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("opens confirmation dialog on swap button click", async () => {
    render(<SwapList />);
    await waitFor(() => {
      fireEvent.click(screen.getAllByText("Make Swap")[0]);
    });
    expect(screen.getByText("Confirm Swap")).toBeInTheDocument();
  });

  it("handles swap action when confirm button is clicked", async () => {
    render(<SwapList />);
    await waitFor(() => {
      fireEvent.click(screen.getAllByText("Make Swap")[0]);
    });
    fireEvent.click(screen.getByText("Confirm"));
    // TODO: Add assertions to check if we get a successful response from the API
  });

  // Add more tests as needed
});
