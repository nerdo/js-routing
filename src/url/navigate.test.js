import { navigate } from './navigate'

describe('URL: navigate()', () => {
  it('should be defined as a function', () => {
    expect(navigate).toBeDefined()
    expect(typeof navigate).toBe('function')
  })
})
