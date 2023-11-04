import React from "react";
import { render } from "@testing-library/react";
import ApiProvider, {useApi} from "../../src/contexts/ApiProvider";

jest.mock("../../src/Hooks/ApiClient", () => {
  // Mock the constructor
  const MockSwapsApiClient = jest.fn().mockImplementation(() => {
    return {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
  });

  // Return the mock as the default export
  return {
    __esModule: true, // This property is needed for mocks of ES modules
    default: MockSwapsApiClient,
  };
});



describe("ApiProvider", () => {
  it("should render children", () => {
    const { getByText } = render(
      <ApiProvider>
        <div>Test</div>
      </ApiProvider>
    );

    expect(getByText("Test")).toBeInTheDocument();
  });

  it("should provide an instance of SwapsApiClient through useApi", () => {
    const TestComponent = () => {
      const api = useApi();
      // Check that the mock functions are defined
      expect(api.get).toBeDefined();
      expect(api.post).toBeDefined();
      expect(api.put).toBeDefined();
      expect(api.delete).toBeDefined();
      return null;
    };

    render(
      <ApiProvider>
        <TestComponent />
      </ApiProvider>
    );
  });
});
