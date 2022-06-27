/**
 * Linting Configuration for Staged Files in the Workspace
 */

module.exports = {
  "package.json": ["sort-package-json", "check-yarn-lock"],
  "yarn.lock": ["check-yarn-lock"],
  "*.{js,ts}": ["prettier --write", "eslint --fix"],
  "*.{json,md,yml}": ["prettier --write"],
};
