import { makeRouter } from '.'
import { NavigationHistory } from './NavigationHistory'

const defaultArgs = {
  baseId: '',
  history: new NavigationHistory({ id: '' }),
  makeRouterNavigationFunction: () => async () => {},
  makeNavigationTarget: () => ({ id: '' }),
  getSelectedRoute: () => null,
  getParamsFromRoute: () => null,
  getParentId: () => ''
}

describe('makeRouter()', () => {
  it('should be defined as a function', () => {
    expect(makeRouter).toBeDefined()
    expect(typeof makeRouter).toBe('function')
  })

  it('should throw an error if it does not receive required parameters', () => {
    // @ts-ignore
    expect(() => makeRouter()).toThrow()
    expect(() => makeRouter({ ...defaultArgs, history: void 0 })).toThrow()
    expect(() => makeRouter({ ...defaultArgs, makeRouterNavigationFunction: void 0 })).toThrow()
    expect(() => makeRouter({ ...defaultArgs, makeNavigationTarget: void 0 })).toThrow()
    expect(() => makeRouter({ ...defaultArgs, getSelectedRoute: void 0 })).toThrow()
    expect(() => makeRouter({ ...defaultArgs, getParamsFromRoute: void 0 })).toThrow()
    expect(() => makeRouter({ ...defaultArgs, getParentId: void 0 })).toThrow()
    expect(() => makeRouter(defaultArgs)).not.toThrow()
  })

  describe('properties of return value', () => {
    const returnValue = makeRouter(defaultArgs)

    describe('stored inputs', () => {
      it('should have the history property', () => {
        expect(returnValue.history).toBe(defaultArgs.history)
      })

      it('should have the makeRouterNavigationFunction property', () => {
        expect(returnValue.makeRouterNavigationFunction).toBe(defaultArgs.makeRouterNavigationFunction)
      })

      it('should have the makeNavigationTarget property', () => {
        expect(returnValue.makeNavigationTarget).toBe(defaultArgs.makeNavigationTarget)
      })

      it('should have the getSelectedRoute property', () => {
        expect(returnValue.getSelectedRoute).toBe(defaultArgs.getSelectedRoute)
      })

      it('should have the getParamsFromRoute property', () => {
        expect(returnValue.getParamsFromRoute).toBe(defaultArgs.getParamsFromRoute)
      })

      it('should have the getParentId property', () => {
        expect(returnValue.getParentId).toBe(defaultArgs.getParentId)
      })
    })
    it('should have a getInitialBaseId function', () => {
      expect(typeof returnValue.getInitialBaseId).toBe('function')
    })

    it('should have a getCurrentBaseId function', () => {
      expect(typeof returnValue.getCurrentBaseId).toBe('function')
    })

    it('should have a getNestedBaseId function', () => {
      expect(typeof returnValue.getNestedBaseId).toBe('function')
    })

    it('has an applyRouting function', () => {
      expect(returnValue.applyRouting).toBeDefined()
      expect(typeof returnValue.applyRouting).toBe('function')
    })

    it('has an addNavigationInterceptor function', () => {
      expect(returnValue.addNavigationInterceptor).toBeDefined()
      expect(typeof returnValue.addNavigationInterceptor).toBe('function')
    })

    it('has a navigate function', () => {
      expect(returnValue.navigate).toBeDefined()
      expect(typeof returnValue.navigate).toBe('function')
    })
  })
})
