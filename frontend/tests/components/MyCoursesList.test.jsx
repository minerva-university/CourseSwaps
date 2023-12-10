import React from "react";
import { render, screen } from "@testing-library/react";
import ApiProvider from "../../src/contexts/ApiProvider"; // Corrected import
import MyCoursesList from "../../src/components/ExchangeCourses/MyCourses/MyCoursesList";

jest.mock("../../src/contexts/ApiProvider", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>, // Mock implementation of ApiProvider
  useApi: jest.fn().mockReturnValue({
    get: jest.fn((url) => {
      if (url === "/swap_courses") {
        // Mock response for swap_courses endpoint
        return Promise.resolve({
          ok: true,
          body: {
            all_courses: [
              { course_code: "COURSE1", name: "Course 1" },
              { course_code: "COURSE2", name: "Course 2" },
            ],
          },
        });
      }
      // Mock response for any other endpoint in this test
      return Promise.resolve({
        ok: true,
        body: {
          current_courses: [
            { code: "COURSE1", name: "Course 1", id: 1 },
            { code: "COURSE2", name: "Course 2", id: 2 },
          ],
        },
      });
    }),
  }),
}));


describe("MyCoursesList Component", () => {
  it("should render the My Courses component", async () => {
    render(
      <ApiProvider>
        <MyCoursesList />
      </ApiProvider>
    );

    await screen.findByText("My Courses");

    expect(screen.getByText("My Courses")).toBeInTheDocument();
    expect(screen.getByText("COURSE1: Course 1")).toBeInTheDocument();
    expect(screen.getByText("COURSE2: Course 2")).toBeInTheDocument();
  });

  // ... Other test cases ...
});
