import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserFormPage from "./UserFormPage"; // Replace with the actual path to your component

// Mocking the console.log function to prevent output during tests
console.log = jest.fn();

test("renders the UserFormPage component", () => {
  render(<UserFormPage />);

  // Check if the component's title is rendered
  expect(
    screen.getByText("Fill out the form below to create your profile")
  ).toBeInTheDocument();

  // Check if the "First Name" and "Last Name" fields are rendered
  expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();

  expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument();

  // Check if the "Class" and "Minerva Student ID" fields are rendered
  expect(screen.getByLabelText(/Class/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Minerva Student ID/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Major/)).toBeInTheDocument();

  // Simulate user input in the "First Name" field
  fireEvent.change(screen.getByLabelText(/First Name/), {
    target: { value: "John" },
  });

  // Simulate user input in the "Last Name" field
  fireEvent.change(screen.getByLabelText(/Last Name/), {
    target: { value: "Doe" },
  });

  // Simulate user input in the "Class" field
  fireEvent.select(screen.getByLabelText(/Class/), "M24");

  // Simulate user input in the "Minerva Student ID" field
  fireEvent.change(screen.getByLabelText(/Minerva Student ID/), {
    target: { value: "123456" },
  });

  // Simulate selecting an option in the "Major" dropdown
  fireEvent.change(screen.getByLabelText(/Major/), {
    target: { value: "Computer Science" },
  });

  // Simulate form submission
  fireEvent.click(screen.getByText("Submit"));
});
