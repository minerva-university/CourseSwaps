import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import DropButton from "../../src/components/ExchangeCourses/MyCourses/DropButton";

describe("DropButton Component", () => {
  // Rendering Tests
  test("renders DropButton with initial UI elements", () => {
    render(<DropButton courseName="Test Course" />);
    expect(screen.getByRole("button", { name: /drop/i })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).toBeNull(); // Dialog should not be open initially
  });

  // Interaction Tests
  test("opens dialog on Drop button click", () => {
    render(<DropButton courseName="Test Course" />);
    fireEvent.click(screen.getByRole("button", { name: /drop/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to drop/i),
    ).toBeInTheDocument();
  });

  // Prop Usage Tests
  test("displays correct course name in dialog", () => {
    const courseName = "Test Course";
    render(<DropButton courseName={courseName} />);
    fireEvent.click(screen.getByRole("button", { name: /drop/i }));
    expect(
      screen.getByText(new RegExp(`drop ${courseName}`, "i")),
    ).toBeInTheDocument();
  });

  // State Management Tests
  // Note: Testing internal state changes might require additional techniques or tools
});
