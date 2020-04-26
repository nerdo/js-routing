import { makeNavigate } from './makeNavigate'

describe('makeNavigate()', () => {
  it('should be defined as a function', () => {
    expect(makeNavigate).toBeDefined()
    expect(typeof makeNavigate).toBe('function')
  })

  it('should return a function', () => {
    const navigate = makeNavigate(null)
    expect(navigate).toBeDefined()
    expect(typeof navigate).toBe('function')
  })
})
