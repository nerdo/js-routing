import { objectExclusivelyContaining } from './objectExclusivelyContaining'

describe('objectExclusivelyContaining()', () => {
  describe('return value', () => {
    it('should be an object', () => {
      expect(typeof objectExclusivelyContaining({}, {  })).toBe('object')
    })

    describe('pass', () => {
      it('should be false when the actual object does not have some of the expected values', () => {
        expect(objectExclusivelyContaining({ a: 1, b: 2, c: 3 }, {  }).pass).toBe(false)
        expect(objectExclusivelyContaining({ a: 1, b: 2, c: 3 }, { bar: 5 }).pass).toBe(false)
        expect(objectExclusivelyContaining({ a: 1, b: 2, c: 3 }, { a: 1, bar: 5 }).pass).toBe(false)
        expect(objectExclusivelyContaining({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, bar: 5 }).pass).toBe(false)
      })

      it('should be false when the actual object has a different number of properties than the expected object', () => {
        expect(objectExclusivelyContaining({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3, foo: 4 }).pass).toBe(false)
        expect(objectExclusivelyContaining({  }, { a: 1 }).pass).toBe(false)
      })

      it('should be true when the actual object has the same number of properties than the expected object', () => {
        expect(objectExclusivelyContaining({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 }).pass).toBe(true)
        expect(objectExclusivelyContaining({ a: 1, b: 2, c: 3 }, { c: 3, b: 2, a: 1 }).pass).toBe(true)
        expect(objectExclusivelyContaining({ a: 1, b: 2, c: 3 }, { b: 2, a: 1, c: 3 }).pass).toBe(true)

        // Even though we declare the property c twice, it only gets defined once, and should be equivalent.
        // @ts-ignore
        expect(objectExclusivelyContaining({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3, c: 3 }).pass).toBe(true)
      })
    })

    describe('message()', () => {
      it('should be a function', () => {
        expect(typeof objectExclusivelyContaining({  }, {  }).message).toBe('function')
      })

      it('should return the negative message when pass = true', () => {
        const { pass, message } = objectExclusivelyContaining({  }, {  })
        expect(pass).toBe(true)
        expect(message()).toEqual(expect.stringContaining(' not '))
      })

      it('should return the positive message when pass = false', () => {
        const { pass, message } = objectExclusivelyContaining({  }, { a: 1 })
        expect(pass).toBe(false)
        expect(message()).not.toEqual(expect.stringContaining(' not '))
      })
    })
  })
})
