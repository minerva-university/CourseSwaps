import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MySwaps from "../../src/components/ExchangeCourses/MyPreferredSwaps/MyPreferredSwapsList.jsx";
import { useApi } from "../../src/contexts/ApiProvider";

jest.mock("../../src/contexts/ApiProvider", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
  useApi: jest.fn().mockReturnValue({
    get: jest.fn(() => Promise.resolve({
      ok: true,
      status: 200,
      body: { my_swaps: [{ swap_id: '1', giving_course: 'Course A', wanted_course: 'Course B' }] }
    }))
  }),
}));

jest.mock("../../src/contexts/useRefresh", () => ({
  useRefresh: jest.fn().mockReturnValue({ refreshKey: 0 }),
}));

jest.mock("../../src/contexts/usePeriodicRefresh", () => ({
  usePeriodicRefresh: jest.fn().mockReturnValue({
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  }),
}));

describe("MySwaps Component", () => {
  it("renders correctly and fetches swaps", async () => {
    render(<MySwaps />);

    await waitFor(() => {
      expect(screen.getByText("My preferred swaps")).toBeInTheDocument();
      expect(screen.getByText("Course A")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    useApi.mockReturnValue({
      get: jest.fn(() => Promise.resolve({
        ok: false,
        status: 400,
        body: {}
      }))
    });

    render(<MySwaps />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch swaps")).toBeInTheDocument();
    });
  });
});
