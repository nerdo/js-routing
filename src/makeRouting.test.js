import { makeRouting } from '.'

const defaultArgs = { history:1, getSelectedRoute: 1 }

describe('makeRouting()', () => {
  it('should be defined as a function', () => {
    expect(makeRouting).toBeDefined()
    expect(typeof makeRouting).toBe('function')
  })

  it('should throw an error if it does not receive required parameters', () => {
    expect(() => makeRouting()).toThrow()
    expect(() => makeRouting({ history: 1 })).toThrow()
    expect(() => makeRouting({ getSelectedRoute: 1 })).toThrow()
    expect(() => makeRouting(defaultArgs)).not.toThrow()
  })

  describe('properties of return value', () => {
    const returnValue = makeRouting(defaultArgs)

    it('has an applyRouting function', () => {
      expect(returnValue.applyRouting).toBeDefined()
      expect(typeof returnValue.applyRouting).toBe('function')
    })

    it('has an addInterceptor function', () => {
      expect(returnValue.addInterceptor).toBeDefined()
      expect(typeof returnValue.addInterceptor).toBe('function')
    })

    it('has a navigate function', () => {
      expect(returnValue.navigate).toBeDefined()
      expect(typeof returnValue.navigate).toBe('function')
    })
  })
})
