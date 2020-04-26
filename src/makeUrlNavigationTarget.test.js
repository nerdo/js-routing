import { makeUrlNavigationTarget } from './makeUrlNavigationTarget'

describe('makeUrlNavigationTarget()', () => {
  it('should be defined as a function', () => {
    expect(makeUrlNavigationTarget).toBeDefined()
    expect(typeof makeUrlNavigationTarget).toBe('function')
  })

  describe('return value properties', () => {
    describe('to', () => {
      it('should be the path minus the anchor and query string', () => {
        const a = makeUrlNavigationTarget('/a/b/c')
        expect(a.to).toBe('/a/b/c')

        const b = makeUrlNavigationTarget('/a/b/c#anchor?query&string')
        expect(b.to).toBe('/a/b/c')

        const c = makeUrlNavigationTarget('/a/b/c?query&string')
        expect(c.to).toBe('/a/b/c')
      })
    })

    describe('params', () => {
      it('should be undefined with no query string', () => {
        const a = makeUrlNavigationTarget('/a/b/c')
        expect(a.params).not.toBeDefined()
      })

      it('should be defined with a query string delimeter', () => {
        const b = makeUrlNavigationTarget('/a/b/c?')
        expect(b.params).toBeDefined()

        const c = makeUrlNavigationTarget('?')
        expect(c.params).toBeDefined()
      })

      it('should parse the query string into a plain object', () => {
        const { params } = makeUrlNavigationTarget('/a/b/c?a&b=1&&c=hello&d=d%3D%23decode%20this%26please%3F')

        expect(Object.keys(params).length).toBe(4)
        expect(params.a).toBe('')
        expect(params.b).toBe('1')
        expect(params.c).toBe('hello')
        expect(params.d).toBe('d=#decode this&please?')
      })
    })
  })
})
