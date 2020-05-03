export const objectExclusivelyContaining = (expected, actual) => {
  try {
    expect(expected).toEqual(expect.objectContaining(actual))
  } catch (e) {
    return e.matcherResult
  }

  const pass = Object.keys(expected).length === Object.keys(actual).length
  const message = pass
    ? `expected {${expected}} not to exclusively contain {${actual}}`
    : `expected {${expected}} to exclusively contain {${actual}}`
  return {
    pass,
    message: () => message
  }
}
