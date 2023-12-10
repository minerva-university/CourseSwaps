import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "../../src/components/Navbar/Navbar";
import { useAuth } from "../../src/contexts/AuthProvider";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("../../src/contexts/AuthProvider", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../src/contexts/ApiProvider", () => ({
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

describe("Navbar", () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: {
        given_name: "John",
        picture: "https://example.com/user.jpg",
      },
      isAuthenticated: true,
      logout: mockLogout,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the logo and app name", async () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );
    const logo = screen.getByAltText("Logo");
    const appName = screen.getByText("CourseSwap");

    expect(logo).toBeInTheDocument();
    expect(appName).toBeInTheDocument();
  });

  it("should open and interact with user menu", async () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Click on user avatar to open menu
    fireEvent.click(screen.getByAltText("User's Picture"));

    // Check if menu is opened
    const viewProfileOption = screen.getByText("View Profile");
    const logoutOption = screen.getByText("Logout");

    expect(viewProfileOption).toBeInTheDocument();
    expect(logoutOption).toBeInTheDocument();

    // Click 'View Profile' option
    fireEvent.click(viewProfileOption);

    await waitFor(() => {
      // Check if ViewUserProfile component is rendered
      const viewProfileComponent = screen.getByTestId("view-user-profile");
      expect(viewProfileComponent).toBeInTheDocument();
    });

    // Click 'Logout' option
    fireEvent.click(logoutOption);

    // Check if the logout function was called
    expect(mockLogout).toHaveBeenCalled();
  });

  it("should not display user menu when not authenticated", async () => {
    useAuth.mockReturnValueOnce({
      isAuthenticated: false,
    });

    render(
      <Router>
        <Navbar />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByAltText("User's Picture")).not.toBeInTheDocument();
    });
  });
});
