declare global {
  namespace jest {
    interface Expect {
      /** Checks if given item(s) exists only if the array has non-zero length */
      arrayContainingIfExists<E>(items: E[]): any;
    }
  }
}

/**
 * This file has no import/export statements (i.e. is a script).
 * Hence convert it into a module by adding an empty export statement.
 */
export {};
