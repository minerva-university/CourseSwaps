import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SwapForm from "../../src/components/ExchangeCourses/MyCourses/SwapForm";
import { useApi } from "../../src/contexts/ApiProvider";

// Mock the useApi hook
jest.mock("../../src/contexts/ApiProvider", () => ({
  useApi: jest.fn(),
}));

const mockCourses = [
  { course_code: "COURSE1", name: "Course 1" },
  { course_code: "COURSE2", name: "Course 2" },
];

describe("SwapForm", () => {
  beforeEach(() => {
    useApi.mockReturnValue({
      get: jest.fn().mockResolvedValue({
        ok: true,
        body: { all_courses: mockCourses },
      }),
      post: jest.fn().mockResolvedValue({
        ok: true,
      }),
    });
  });

  it("renders the component", async () => {
    render(
      <SwapForm
        open={true}
        onClose={() => {}}
        selectedCourse={{ code: "COURSE1", name: "Course 1" }}
      />
    );
    await waitFor(() =>
      expect(screen.getByText("Choose Courses to Swap")).toBeInTheDocument()
    );
  });

  it("loads and displays available courses", async () => {
    render(
      <SwapForm
        open={true}
        onClose={() => {}}
        selectedCourse={{ code: "CS110", name: "CS110" }}
      />
    );

    // Trigger the Autocomplete dropdown
    fireEvent.mouseDown(screen.getByLabelText("Search Courses"));

    // Wait for the options to be loaded and visible
    await waitFor(() =>
      expect(screen.getByText("COURSE1")).toBeInTheDocument()
    );
  });

  it("completes a course swap", async () => {
    render(
      <SwapForm
        open={true}
        onClose={() => {}}
        selectedCourse={{ code: "COURSE1", name: "Course 1" }}
      />
    );

    // Trigger the Autocomplete dropdown
    fireEvent.mouseDown(screen.getByLabelText("Search Courses"));

    // Wait for the options to be loaded and visible
    await waitFor(() =>
      expect(screen.getByText("COURSE1")).toBeInTheDocument()
    );

    // Select an option
    fireEvent.click(screen.getByText("COURSE1"));

    // Click the 'Confirm Swap' button
    fireEvent.click(screen.getByText("Confirm Swap"));

    // Wait for and click the 'Confirm' button in the confirmation dialog
    await waitFor(() =>
      expect(screen.getByText("Confirm Course Swap")).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText("Confirm"));

    // Check for the success message
    await waitFor(() =>
      expect(
        screen.getByText("Swap confirmed successfully")
      ).toBeInTheDocument()
    );

    // Check that the dialog is closed
    expect(screen.queryByText("Confirm Course Swap")).not.toBeInTheDocument();
  });
});
