import { navigate } from './navigate'

describe('url navigate', () => {
  it('should be defined as a function', () => {
    expect(navigate).toBeDefined()
    expect(typeof navigate).toBe('function')
  })
})
