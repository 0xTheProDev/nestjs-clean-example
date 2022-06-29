/**
 * Configuration for Jest
 */
import { pathsToModuleNameMapper } from "ts-jest";
import { Config } from "@jest/types";
import tsconfig = require("./tsconfig.json");

const Configuration: Config.InitialOptions = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coveragePathIgnorePatterns: [
    "src/configs",
    "src/main",
    "src/modules",
    "src/app.module",
  ],
  coverageDirectory: "coverage",
  moduleFileExtensions: ["js", "json", "ts"],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  rootDir: ".",
  testEnvironment: "node",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
};

export default Configuration;
