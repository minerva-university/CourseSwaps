import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import ViewUserProfile from "../../../src/components/ViewUserProfile/ViewUserProfile"; // Adjust the import path as needed
import { BrowserRouter } from "react-router-dom";

// Mocking useApi and useNavigate
jest.mock("../../../src/contexts/ApiProvider", () => ({
  useApi: () => ({
    get: jest.fn().mockResolvedValue({
      status: 200,
      body: {
        class: "M24",
        minervaID: "123456",
        currentClasses: ["CS110"],
        previousCourses: ["NS112", "NS113", "NS144", "NS154", "NS164"],
        major: "Computational Sciences",
        concentration: "Data Science",
        minor: "Mathematics",
      },
    }),
  }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("ViewUserProfile", () => {
  const mockCloseViewProfile = jest.fn();

  beforeEach(() => {
    render(
      <BrowserRouter>
        <ViewUserProfile closeViewProfile={mockCloseViewProfile} />
      </BrowserRouter>
    );
  });

  it("fetches and displays user data", async () => {
    await waitFor(() => {
      expect(screen.getByText("M24")).toBeInTheDocument();
      expect(screen.getByText("123456")).toBeInTheDocument();
      expect(screen.getByText("CS110")).toBeInTheDocument();
      // Ensure that the test is checking for existing data
      expect(screen.getByText("Computational Sciences")).toBeInTheDocument();
      expect(screen.getByText("Data Science")).toBeInTheDocument();
      expect(screen.getByText("Mathematics")).toBeInTheDocument();
    });
  });

  it("responds to 'Edit Profile' button click", () => {
    const editButton = screen.getByText("Edit Profile");
    fireEvent.click(editButton);
    expect(mockCloseViewProfile).toHaveBeenCalled();
  });

  it("responds to 'Close' button click", () => {
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);
    expect(mockCloseViewProfile).toHaveBeenCalled();
  });
});
