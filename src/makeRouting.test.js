import { makeRouting } from '.'

describe('makeRouting', () => {
  it('should be defined as a function', () => {
    expect(makeRouting).toBeDefined()
    expect(typeof makeRouting).toBe('function')
  })

  describe('properties of return value', () => {
    const returnValue = makeRouting()

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
