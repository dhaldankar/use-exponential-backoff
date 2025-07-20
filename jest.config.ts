import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["<rootDir>/__tests__/**/*.(test|spec).(ts|tsx|js)"],
  collectCoverageFrom: ["src/**/*.(ts|tsx)", "!src/**/*.d.ts", "!src/index.ts"],
};

export default config;
