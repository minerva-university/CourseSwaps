import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserFormPage from "../../../src/components/UserForm/UserForm";
import { useApi } from "../../../src/contexts/ApiProvider";
import { BrowserRouter } from "react-router-dom";
// Mocking the console.log function to prevent output during tests
console.log = jest.fn();

// Mocking the useApi hook to prevent errors during tests
jest.mock("../../../src/contexts/ApiProvider", () => ({
  useApi: jest.fn(),
}));

describe("UserFormPage", () => {
  it("renders a form with the correct fields", () => {
    render(
      <BrowserRouter>
        <UserFormPage />
      </BrowserRouter>
    );

    // Check that the form contains the correct fields
    expect(screen.getByLabelText(/Class/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Minerva Student ID/)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Currently Assigned Courses by MU Registrar/)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Previous Courses/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Major/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Concentration/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Minor/)).toBeInTheDocument();
  });

  it("allows selecting options and submitting form data", async () => {
    render(
      <BrowserRouter>
        <UserFormPage />
      </BrowserRouter>
    );
    // Simulate filling in the Minerva Student ID

    const mockPost = jest.fn(() => Promise.resolve({ status: 200 }));
    useApi.mockReturnValue({ post: mockPost });

    fireEvent.change(screen.getByLabelText(/Minerva Student ID/), {
      target: { value: "123456" },
    });

    // Simulate selecting a class
    fireEvent.mouseDown(screen.getByLabelText(/Class/));
    fireEvent.click(screen.getByText("M24")); // Replace 'M24' with an actual option from your app

    // Simulate selecting current classes
    const currentClassesSelect = screen.getByLabelText(
      /Currently Assigned Courses by MU Registrar/
    );
    fireEvent.mouseDown(currentClassesSelect);
    const currentClassOption = await screen.findByText(
      "CS110 - Problem Solving with Data Structures and Algorithms"
    );
    fireEvent.click(currentClassOption);

    // Simulate selecting a major which will dynamically set concentration options
    fireEvent.mouseDown(screen.getByLabelText(/Major/));
    fireEvent.click(screen.getByText("Computational Sciences"));

    // Simulate selecting a concentration
    // Wait for the concentration options to be populated based on the selected major
    await waitFor(() => {
      fireEvent.mouseDown(screen.getByLabelText(/Concentration/));
      fireEvent.click(screen.getByText("Applied Problem Solving"));
    });

    // Simulate selecting a minor
    fireEvent.mouseDown(screen.getByLabelText(/Minor/));
    const minorOption = await screen.findByText(
      "Arts & Humanities - Philosophy, Ethics, and the Law"
    );
    fireEvent.click(minorOption);

    // Simulate selecting previous courses
    const previousCoursesSelect = screen.getByLabelText(/Previous Courses/);
    fireEvent.mouseDown(previousCoursesSelect);
    const allMatchingOptions = screen.getAllByText(
      "CS113 - Theory and Applications of Linear Algebra"
    );
    const previousCourseOption = allMatchingOptions[1];
    fireEvent.click(previousCourseOption);

    fireEvent.click(screen.getByText(/Submit/));

    // Check that the form data was logged to the console
    const expectedFormData = {
      minervaID: "123456",
      class: "M24",
      currentClasses: ["CS110"],
      major: "Computational Sciences",
      concentration: ["Applied Problem Solving"],
      minor: "Arts & Humanities - Philosophy, Ethics, and the Law",
      previousCourses: ["CS113"],
    };

    await waitFor(() => {
      const submittedData = mockPost.mock.calls[0][1];

      expect(submittedData.minervaID).toBe("123456");
      expect(submittedData.class).toBe("M24");
      expect(submittedData.currentClasses).toEqual(["CS110"]);
      expect(submittedData.major).toBe("Computational Sciences");
      // Check if the selected concentration is one of the expected values
      // expect(submittedData.concentration).toBeDefined();

      expect(submittedData.minor).toBe(
        "Arts & Humanities - Philosophy, Ethics, and the Law"
      );
      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveReturnedWith(Promise.resolve({ status: 200 }));
    });
  });
});
