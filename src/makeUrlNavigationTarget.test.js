import { makeUrlNavigationTarget } from './makeUrlNavigationTarget'

describe('makeUrlNavigationTarget()', () => {
  it('should be defined as a function', () => {
    expect(makeUrlNavigationTarget).toBeDefined()
    expect(typeof makeUrlNavigationTarget).toBe('function')
  })
})
