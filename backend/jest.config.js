module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./src/test-utils/jest.setup.ts"],
  testPathIgnorePatterns: ["./node_modules/", "./build/"],
}
