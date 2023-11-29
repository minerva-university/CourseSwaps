import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import SwapButton from "../../src/components/ExchangeCourses/MyCourses/SwapButton";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("SwapButton Component", () => {
  // Rendering Tests
  test("renders SwapButton with initial UI elements", () => {
    render(<SwapButton />);
    expect(
      screen.getByRole("button", { name: /swap with/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm swap/i }),
    ).toBeDisabled();
  });

  // Interaction and Asynchronous Operation Tests
  test("opens menu and fetches available swaps on button click", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ availableswaps: [{ id: 1, name: "Course A" }] }),
    );
    render(<SwapButton />);
    fireEvent.click(screen.getByRole("button", { name: /swap with/i }));
    await waitFor(() =>
      expect(screen.getByText("Course A")).toBeInTheDocument(),
    );
    expect(fetch).toHaveBeenCalledWith("/availableswaps", { method: "GET" });
  });

  // State Management Tests
  // Note: Testing internal state changes might require additional techniques or tools
});
