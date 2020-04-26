import { makeRouter } from '.'

const defaultArgs = { history:1, getSelectedRoute: 1 }

describe('makeRouter()', () => {
  it('should be defined as a function', () => {
    expect(makeRouter).toBeDefined()
    expect(typeof makeRouter).toBe('function')
  })

  it('should throw an error if it does not receive required parameters', () => {
    expect(() => makeRouter()).toThrow()
    expect(() => makeRouter({ history: 1 })).toThrow()
    expect(() => makeRouter({ getSelectedRoute: 1 })).toThrow()
    expect(() => makeRouter(defaultArgs)).not.toThrow()
  })

  describe('properties of return value', () => {
    const returnValue = makeRouter(defaultArgs)

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
