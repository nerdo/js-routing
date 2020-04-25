import { configuredUrlRouting } from '.'

describe('configuredUrlRouting()', () => {
  it('should be defined as a function', () => {
    expect(configuredUrlRouting).toBeDefined()
    expect(typeof configuredUrlRouting).toBe('function')
  })
})
