import { makeRouter } from '.'

const defaultArgs = { history: {}, makeNavigationTarget: () => {}, getSelectedRoute: () => {} }

describe('makeRouter()', () => {
  it('should be defined as a function', () => {
    expect(makeRouter).toBeDefined()
    expect(typeof makeRouter).toBe('function')
  })

  it('should throw an error if it does not receive required parameters', () => {
    expect(() => makeRouter()).toThrow()
    expect(() => makeRouter({ ...defaultArgs, history: void 0 })).toThrow()
    expect(() => makeRouter({ ...defaultArgs, makeNavigationTarget: void 0 })).toThrow()
    expect(() => makeRouter({ ...defaultArgs, getSelectedRoute: void 0 })).toThrow()
    expect(() => makeRouter(defaultArgs)).not.toThrow()
  })

  describe('properties of return value', () => {
    const returnValue = makeRouter(defaultArgs)

    describe('stored inputs', () => {
      it('should have the history property', () => {
        expect(returnValue.history).toBe(defaultArgs.history)
      })

      it('should have the makeNavigationTarget property', () => {
        expect(returnValue.makeNavigationTarget).toBe(defaultArgs.makeNavigationTarget)
      })

      it('should have the getSelectedRoute property', () => {
        expect(returnValue.getSelectedRoute).toBe(defaultArgs.getSelectedRoute)
      })
    })

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
