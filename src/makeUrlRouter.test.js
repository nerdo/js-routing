jest.mock('./makeRouter', () => {
  const { makeRouter } = jest.requireActual('./makeRouter')
  return { makeRouter: jest.fn(makeRouter) }
})

jest.mock('./makeUrlNavigationTarget', () => {
  const { makeUrlNavigationTarget } = jest.requireActual('./makeUrlNavigationTarget')
  return { makeUrlNavigationTarget: jest.fn(makeUrlNavigationTarget) }
})

import { makeUrlRouter } from '.'
import { NavigationHistory } from './NavigationHistory'
import { getSelectedUrlRoute } from './getSelectedUrlRoute'
import { makeRouter } from './makeRouter'
import { makeUrlNavigationTarget } from './makeUrlNavigationTarget'

beforeEach(() => {
  makeRouter.mockClear()
  makeUrlNavigationTarget.mockClear()
})

describe('makeUrlRouter()', () => {
  it('should be defined as a function', () => {
    expect(makeUrlRouter).toBeDefined()
    expect(typeof makeUrlRouter).toBe('function')
  })

  describe('calling it', () => {
    it('should return a router object', () => {
      const router = makeUrlRouter()
      expect(typeof router).toBe('object')
    })

    it('should call makeRouter', () => {
      const router = makeUrlRouter()
      expect(makeRouter).toHaveBeenCalledTimes(1)
    })

    it('should not store the getSelectedRoute argument (it should always be getSelectedUrlRoute())', () => {
      const getSelectedRoute = () => {}
      const router = makeUrlRouter({ getSelectedRoute })
      expect(router.getSelectedRoute).not.toBe(getSelectedRoute)
      expect(router.getSelectedRoute).toBe(getSelectedUrlRoute)
    })

    it('should not store the makeNavigationTarget argument (it should always be makeUrlNavigationTarget())', () => {
      const makeNavigationTarget = () => {}
      const router = makeUrlRouter({ makeNavigationTarget })
      expect(router.makeNavigationTarget).not.toBe(makeNavigationTarget)
      expect(router.makeNavigationTarget).toBe(makeUrlNavigationTarget)
    })
  })

  describe('router', () => {
    let router

    beforeEach(() => {
      router = makeUrlRouter()
    })

    describe('navigate()', () => {
      it('should update history', () => {
        expect(router.history.current.id).not.toBe('/foo/bar')

        router.navigate('/foo/bar')
        expect(makeUrlNavigationTarget).toHaveBeenCalledTimes(1)
        expect(router.history.current.id).toBe('/foo/bar')
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

          router.navigate('/about')
          expect(router.applyRouting(routes)).toBe('about')

          router.navigate('/about#anchor')
          expect(router.applyRouting(routes)).toBe('about')

          router.navigate('/about?query')
          expect(router.applyRouting(routes)).toBe('about')

          router.navigate('/about#anchor?and=1&query=present')
          expect(router.applyRouting(routes)).toBe('about')

          router.navigate('/')
          expect(router.applyRouting(routes)).toBe('home')

          router.navigate('/foo/bar')
          expect(router.applyRouting(routes)).toBe('foo bar')

          router.navigate('/not-found')
          expect(router.applyRouting(routes)).toBeNull()

          router.navigate('/not/found')
          expect(router.applyRouting(routes)).toBeNull()
        })
      })
    })
  })
})
