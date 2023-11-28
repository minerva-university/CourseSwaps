import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "../../src/components/Navbar/Navbar";
import { useAuth } from "../../src/contexts/AuthProvider";

jest.mock("../../src/contexts/AuthProvider", () => ({
  useAuth: jest.fn(),
}));

describe("Navbar", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: {
        given_name: "John",
        picture: "https://example.com/user.jpg",
      },
      isAuthenticated: true,
      logout: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the logo and app name", () => {
    render(<Navbar />);
    const logo = screen.getByAltText("Logo");
    const appName = screen.getByText("CourseSwap");

    expect(logo).toBeInTheDocument();
    expect(appName).toBeInTheDocument();
  });

  it("should render user information and logout button when authenticated", () => {
    render(<Navbar />);
    const username = screen.getByText("John");
    const userPicture = screen.getByAltText("User's Picture");
    const logoutButton = screen.getByText("Logout");

    expect(username).toBeInTheDocument();
    expect(userPicture).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });

  it("should not render user information and logout button when not authenticated", () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
    });

    render(<Navbar />);
    const username = screen.queryByText("John");
    const userPicture = screen.queryByAltText("User's Picture");
    const logoutButton = screen.queryByText("Logout");

    expect(username).toBeNull();
    expect(userPicture).toBeNull();
    expect(logoutButton).toBeNull();
  });
});