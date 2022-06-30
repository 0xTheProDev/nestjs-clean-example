/**
 * Configuration for Jest for End-to-End test Suite.
 */
import { pathsToModuleNameMapper } from "ts-jest";
import { Config } from "@jest/types";
import tsconfig = require("./tsconfig.json");

const configuration: Config.InitialOptions = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage-e2e",
  moduleFileExtensions: ["js", "json", "ts"],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  rootDir: ".",
  testEnvironment: "node",
  testRegex: ".e2e-spec.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};

export default configuration;
