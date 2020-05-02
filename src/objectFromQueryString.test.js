import { objectFromQueryString } from './objectFromQueryString'

describe('objectFromQueryString()', () => {
  it('should be defined as a function', () => {
    expect(objectFromQueryString).toBeDefined()
    expect(typeof objectFromQueryString).toBe('function')
  })

  describe('return value', () => {
    it('should be undefined with no query string', () => {
      const params = objectFromQueryString()
      expect(params).not.toBeDefined()
    })

    it('should be defined with an empty string', () => {
      const params = objectFromQueryString('')
      expect(params).toBeDefined()
    })

    it('should parse the query string into a plain object', () => {
      const params = objectFromQueryString('a&b=1&&c=hello&d=d%3D%23decode%20this%26please%3F')

      expect(Object.keys(params).length).toBe(4)
        expect(params).toEqual(expect.objectContaining({
          a: '',
          b: '1',
          c: 'hello',
          d: 'd=#decode this&please?'
        }))
    })
  })
})
