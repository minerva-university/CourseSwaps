import React from "react";
import { render, screen } from "@testing-library/react";
import SwapForm from "../../src/components/ExchangeCourses/MyCourses/SwapForm";

// If SwapButton is complex, consider mocking it:
jest.mock("../../src/components/ExchangeCourses/MyCourses/SwapButton", () => ({
  __esModule: true,
  default: ({ onSwapSubmit }) => (
    <button onClick={() => onSwapSubmit("Course 1", "Course A")}>
      Mock Swap Button
    </button>
  ),
}));

describe("SwapForm Component", () => {
  // Mock data for userCourses and availableCourses
  const userCourses = ["Course 1", "Course 2"];
  const availableCourses = ["Course A", "Course B"];

  // Rendering Tests
  test("renders SwapForm with SwapButton", () => {
    render(
      <SwapForm
        userCourses={userCourses}
        availableCourses={availableCourses}
      />,
    );
    expect(
      screen.getByRole("button", { name: /mock swap button/i }),
    ).toBeInTheDocument();
  });

  // Prop Usage Tests
  test("passes correct props to SwapButton", () => {
    render(
      <SwapForm
        userCourses={userCourses}
        availableCourses={availableCourses}
      />,
    );
    // Check if the Mock Swap Button is rendered, indicating that the SwapButton component received the props
    expect(
      screen.getByRole("button", { name: /mock swap button/i }),
    ).toBeInTheDocument();
  });
});
