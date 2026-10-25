module.exports = {
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/tests/unit/**/*.test.js",
    "<rootDir>/tests/integration/**/*.test.js",
  ],
  setupFiles: ["<rootDir>/jest.setup.js"],
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 30000,
};
