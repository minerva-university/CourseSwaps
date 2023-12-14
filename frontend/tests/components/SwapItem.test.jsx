import React from 'react';
import SwapItem from '../../src/components/ExchangeCourses/MyPreferredSwaps/SwapItem';
import { render, fireEvent, waitFor } from "@testing-library/react";
import ApiProvider from "../../src/contexts/ApiProvider"; 


jest.mock("../../src/contexts/ApiProvider", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
  useApi: jest.fn().mockReturnValue({
    post: jest.fn((url) => {
      if (url === "/cancel_swap/1") {
        // Mock response for cancel_swap endpoint
        return Promise.resolve({ ok: true });
      }
      return Promise.resolve({ ok: false });
    }),
  }),
}));

describe("SwapItem Component", () => {
  it("should handle swap deletion", async () => {
    const mockOnSwapDeleted = jest.fn();
    const { getByText } = render(
      <ApiProvider>
        <SwapItem
          swapId="1"
          givingCourse="Course A"
          wantedCourse="Course B"
          setOpenSnackbar={() => {}}
          setSnackbarMessage={() => {}}
          setSnackbarSeverity={() => {}}
          onSwapDeleted={mockOnSwapDeleted}
        />
      </ApiProvider>
    );

    fireEvent.click(getByText("Cancel"));

    await waitFor(() => getByText("Confirm Deletion"));

    fireEvent.click(getByText("Confirm"));

    await waitFor(() => {
      expect(mockOnSwapDeleted).toHaveBeenCalledWith("1");
    });
  });

});
