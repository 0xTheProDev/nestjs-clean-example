/**
 * Extends Expect behaviour from traditional one provided by Jest.
 */
export function extendExpect() {
  expect.arrayContainingIfExists = (items) => {
    if (items.length > 0) {
      return expect.arrayContaining(items);
    }

    return {
      pass: true,
    };
  };
}
