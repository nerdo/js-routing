import { makeUrlRouter } from '.'
import { FakeHistory } from './FakeHistory'

describe('makeUrlRouter()', () => {
  it('should be defined as a function', () => {
    expect(makeUrlRouter).toBeDefined()
    expect(typeof makeUrlRouter).toBe('function')
  })

  it('should return an object', () => {
    const router = makeUrlRouter()
    expect(typeof router).toBe('object')
  })

  describe('applyRouting()', () => {
    let router

    beforeEach(() => {
      router = makeUrlRouter({ history: new FakeHistory(null, '', null) })
    })

    it('should return null when no routes are provided', () => {
      const returnValue = router.applyRouting()
      expect(returnValue).toBeNull()
    })

    it('should return null when no routes match', () => {
      const returnValue = router.applyRouting([])
      expect(returnValue).toBeNull()
    })

    describe('simple routes', () => {
      it('should return the correct route', () => {
        const routes = {
          '/': () => 'home',
          '/about': () => 'about',
          '/foo/bar': () => 'foo bar'
        }

        router.navigate('/')

        const route = router.applyRouting(routes)

        expect(route).toBe('home')
      })
    })
  })
})
