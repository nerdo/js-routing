import { makeUrlNavigationTarget } from './makeUrlNavigationTarget'

describe('makeUrlNavigationTarget()', () => {
  it('should be defined as a function', () => {
    expect(makeUrlNavigationTarget).toBeDefined()
    expect(typeof makeUrlNavigationTarget).toBe('function')
  })

  describe('return value properties', () => {
    describe('input', () => {
      it('should be the input to the function', () => {
        const a = makeUrlNavigationTarget('/a/b/c')
        expect(a.input).toBe('/a/b/c')

        const b = makeUrlNavigationTarget('/a/b/c#anchor?query&string')
        expect(b.input).toBe('/a/b/c#anchor?query&string')

        const c = makeUrlNavigationTarget('/a/b/c?query&string')
        expect(c.input).toBe('/a/b/c?query&string')

        const d = makeUrlNavigationTarget('relative/input')
        expect(d.input).toBe('relative/input')
      })
    })

    describe('id', () => {
      it('should be the resolved path minus the anchor and query string', () => {
        const a = makeUrlNavigationTarget('/a/b/c')
        expect(a.id).toBe('/a/b/c')

        const b = makeUrlNavigationTarget('/a/b/c#anchor?query&string')
        expect(b.id).toBe('/a/b/c')

        const c = makeUrlNavigationTarget('/a/b/c?query&string')
        expect(c.id).toBe('/a/b/c')

        const d = makeUrlNavigationTarget('relative/input/without/base/id')
        expect(d.id).toBe('relative/input/without/base/id')

        const e = makeUrlNavigationTarget('relative/input/with/base/id', '/some/where')
        expect(e.id).toBe('/some/where/relative/input/with/base/id')
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
        expect(params).toEqual(expect.objectContaining({
          a: '',
          b: '1',
          c: 'hello',
          d: 'd=#decode this&please?'
        }))
      })
    })
  })
})
