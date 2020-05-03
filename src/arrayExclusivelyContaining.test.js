import { arrayExclusivelyContaining } from './arrayExclusivelyContaining'

describe('arrayExclusivelyContaining()', () => {
  describe('return value', () => {
    it('should be an object', () => {
      expect(typeof arrayExclusivelyContaining([], [])).toBe('object')
    })

    describe('pass', () => {
      it('should be false when the actual array does not have some of the expected values', () => {
        expect(arrayExclusivelyContaining([1, 2, 3], []).pass).toBe(false)
        expect(arrayExclusivelyContaining([1, 2, 3], [5]).pass).toBe(false)
        expect(arrayExclusivelyContaining([1, 2, 3], [1, 5]).pass).toBe(false)
        expect(arrayExclusivelyContaining([1, 2, 3], [1, 2, 5]).pass).toBe(false)
      })

      it('should be false when the actual array has the size of the arrays does not match', () => {
        expect(arrayExclusivelyContaining([1, 2, 3], [1, 2, 3, 4]).pass).toBe(false)
        expect(arrayExclusivelyContaining([1, 2, 3], [1, 2, 3, 3]).pass).toBe(false)
        expect(arrayExclusivelyContaining([], [1]).pass).toBe(false)
      })

      it('should be true when the actual array has the expected values and the size of the arrays matches', () => {
        expect(arrayExclusivelyContaining([1, 2, 3], [1, 2, 3]).pass).toBe(true)
        expect(arrayExclusivelyContaining([1, 2, 3], [3, 2, 1]).pass).toBe(true)
        expect(arrayExclusivelyContaining([1, 2, 3], [2, 1, 3]).pass).toBe(true)
      })
    })

    describe('message()', () => {
      it('should be a function', () => {
        expect(typeof arrayExclusivelyContaining([], []).message).toBe('function')
      })

      it('should return the negative message when pass = true', () => {
        const { pass, message } = arrayExclusivelyContaining([], [])
        expect(pass).toBe(true)
        expect(message()).toEqual(expect.stringContaining(' not '))
      })

      it('should return the positive message when pass = false', () => {
        const { pass, message } = arrayExclusivelyContaining([], [1])
        expect(pass).toBe(false)
        expect(message()).not.toEqual(expect.stringContaining(' not '))
      })
    })
  })
})
