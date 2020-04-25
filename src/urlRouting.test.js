import { urlRouting } from '.'

describe('urlRouting', () => {
  it('should be defined as an object', () => {
    expect(urlRouting).toBeDefined()
    expect(typeof urlRouting).toBe('object')
  })

  describe('applyRouting()', () => {
    const { applyRouting } = urlRouting

    it('should return null when no routes are provided', () => {
      const returnValue = applyRouting()
      expect(returnValue).toBeNull()
    })

    it('should return null when no routes match', () => {
      const returnValue = applyRouting([])
      expect(returnValue).toBeNull()
    })
  })
})
