import React from "react";
import { render } from "@testing-library/react";
import { UserProvider, useUser } from "../../src/contexts/UserContext";
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
        <UserProvider>
          <div>Test</div>
        </UserProvider>
      </GoogleOAuthProvider>
    );

    expect(getByText("Test")).toBeInTheDocument();
  });

  it("should provide user context", () => {
    const TestComponent = () => {
      const { user } = useUser();
      expect(user).toBeNull();
      return null;
    };

    render(
      <GoogleOAuthProvider clientId="your-client-id">
        <UserProvider>
          <TestComponent />
        </UserProvider>
      </GoogleOAuthProvider>
    );
  });
});
