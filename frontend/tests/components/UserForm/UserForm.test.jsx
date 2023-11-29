import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserFormPage from "../../../src/components/UserForm/UserForm";

// Mocking the console.log function to prevent output during tests
console.log = jest.fn();

describe("UserFormPage", () => {
  it("renders a form with the correct fields", () => {
    render(<UserFormPage />);

    // Check that the form contains the correct fields
    expect(screen.getByLabelText(/Class/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Minerva Student ID/)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Currently Assigned Courses by MU Registrar/)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Previous Courses \(optional\)/)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Major/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Concentration/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Minor/)).toBeInTheDocument();
  });

  it("allows selecting options and submitting form data", async () => {
    render(<UserFormPage />);
    // Simulate filling in the Minerva Student ID
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

    // Simulate selecting a major
    fireEvent.mouseDown(screen.getByLabelText(/Major/));
    const majorOption = await screen.findByText("Computational Sciences"); // Replace with an actual major ID
    fireEvent.click(majorOption);

    // Simulate selecting a concentration (assuming it's dependent on the major)
    fireEvent.mouseDown(screen.getByLabelText(/Concentration/));
    const concentrationOption = await screen.findByText(
      "Applied Problem Solving"
    );
    fireEvent.click(concentrationOption);

    // Simulate selecting a minor
    fireEvent.mouseDown(screen.getByLabelText(/Minor/));
    const minorOption = await screen.findByText(
      "Arts & Humanities - Philosophy, Ethics, and the Law"
    );
    fireEvent.click(minorOption);

    // Simulate selecting previous courses
    const previousCoursesSelect = screen.getByLabelText(
      /Previous Courses \(optional\)/
    );
    fireEvent.mouseDown(previousCoursesSelect);
    const allMatchingOptions = screen.getAllByText(
      "CS113 - Theory and Applications of Linear Algebra"
    );
    const previousCourseOption = allMatchingOptions[1];
    fireEvent.click(previousCourseOption);

    // Simulate form submission
    const submitButton = screen.getByText(/Submit/);
    fireEvent.click(submitButton);

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
    expect(console.log).toHaveBeenCalledWith(expectedFormData);
  });
});