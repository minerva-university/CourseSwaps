import React from "react";
import { render, screen } from "@testing-library/react";
import { useAuth } from "../../src/contexts/AuthProvider";
import AuthPage from "../../src/views/AuthPage";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("../../src/contexts/AuthProvider", () => ({
  useAuth: jest.fn(),
}));

describe("AuthPage", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      promptGoogleSignIn: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the SignUp and Login components when not authenticated", () => {
    render(
      <Router>
        <AuthPage />
      </Router>,
    );
    const signUpComponent = screen.getByTestId("signup-component");
    const loginComponent = screen.getByTestId("login-component");

    expect(signUpComponent).toBeInTheDocument();
    expect(loginComponent).toBeInTheDocument();
  });
});
