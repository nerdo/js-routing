export const arrayExclusivelyContaining = (expected, actual) => {
  try {
    expect(expected).toEqual(expect.arrayContaining(actual))
  } catch (e) {
    return e.matcherResult
  }

  const pass = expected.length === actual.length
  const message = pass
    ? `expected [${expected}] not to exclusively contain [${actual}]`
    : `expected [${expected}] to exclusively contain [${actual}]`
  return {
    pass,
    message: () => message
  }
}
