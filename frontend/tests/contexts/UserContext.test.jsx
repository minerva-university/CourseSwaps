import React from "react";
import { render } from "@testing-library/react";
import { AuthProvider, useAuth } from "../../src/contexts/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

jest.mock("../../src/contexts/ApiProvider", () => {
  return {
    __esModule: true,
    default: ({ children }) => <div>{children}</div>, // Mock implementation of ApiProvider
    useApi: jest.fn().mockReturnValue({
      // Mocked values or functions
    }),
  };
});

describe("UserContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render children", () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId="your-client-id">
        <AuthProvider>
          <div>Test</div>
        </AuthProvider>
      </GoogleOAuthProvider>
    );

    expect(getByText("Test")).toBeInTheDocument();
  });

  it("should provide user context", () => {
    const TestComponent = () => {
      const { user } = useAuth();
      expect(user).toBeNull();
      return null;
    };

    render(
      <GoogleOAuthProvider clientId="your-client-id">
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </GoogleOAuthProvider>
    );
  });
});
