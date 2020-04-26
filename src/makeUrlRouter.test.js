import { makeUrlRouter } from '.'
import { RouteHistory } from './RouteHistory'

describe('makeUrlRouter()', () => {
  it('should be defined as a function', () => {
    expect(makeUrlRouter).toBeDefined()
    expect(typeof makeUrlRouter).toBe('function')
  })

  it('should return a router object', () => {
    const router = makeUrlRouter()
    expect(typeof router).toBe('object')
  })

  describe('router', () => {
    let history, router

    beforeEach(() => {
      history = new RouteHistory(null, '', null)
      router = makeUrlRouter({ history })
    })

    describe('navigate()', () => {
      it('should update history', () => {
        expect(history.current.id).not.toBe('/')
        router.navigate('/')
        expect(history.current.id).toBe('/')
      })
    })

    describe('applyRouting()', () => {
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
})
