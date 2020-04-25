import { urlRouting } from '.'

describe('urlRouting', () => {
  it('should be defined as an object', () => {
    expect(urlRouting).toBeDefined()
    expect(typeof urlRouting).toBe('object')
  })

  describe('properties', () => {
    it('has an applyRouting function', () => {
      expect(urlRouting.applyRouting).toBeDefined()
      expect(typeof urlRouting.applyRouting).toBe('function')
    })

    it('has an addInterceptor function', () => {
      expect(urlRouting.addInterceptor).toBeDefined()
      expect(typeof urlRouting.addInterceptor).toBe('function')
    })
  })
})
