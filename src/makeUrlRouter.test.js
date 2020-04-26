import { makeUrlRouter } from '.'
import { NavigationHistory } from './NavigationHistory'
import { getSelectedUrlRoute } from './getSelectedUrlRoute'

describe('makeUrlRouter()', () => {
  it('should be defined as a function', () => {
    expect(makeUrlRouter).toBeDefined()
    expect(typeof makeUrlRouter).toBe('function')
  })

  it('should return a router object', () => {
    const router = makeUrlRouter()
    expect(typeof router).toBe('object')
  })

  it('should store the history argument', () => {
    const history = {}
    const router = makeUrlRouter({ history })
    expect(router.history).toBe(history)
  })

  it('should not store the getSelectedRoute argument (it should always be getSelectedUrlRoute())', () => {
    const getSelectedRoute = () => {}
    const router = makeUrlRouter({ getSelectedRoute })
    expect(router.getSelectedRoute).not.toBe(getSelectedRoute)
    expect(router.getSelectedRoute).toBe(getSelectedUrlRoute)
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

          const route = router.applyRouting(routes)

          expect(route).toBe('about')
        })
      })
    })
  })
})
