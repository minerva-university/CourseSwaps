// jest.config.js
export default {
  testEnvironment: "jsdom",
  transform: {
    // Use babel-jest to transpile tests with the next Babel config
    "^.+\\.jsx?$": "babel-jest",
  },
  // Setup files after the environment is set up
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/fileMock.js",
  },
};
