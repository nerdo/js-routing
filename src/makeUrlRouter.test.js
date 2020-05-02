import { makeUrlRouter } from '.'
import { NavigationHistory } from './NavigationHistory'
import { getSelectedUrlRoute } from './getSelectedUrlRoute'
import * as makeRouterImport from './makeRouter'
import * as makeUrlNavigationTargetImport from './makeUrlNavigationTarget'

const makeUrlNavigationTarget = jest.spyOn(makeUrlNavigationTargetImport, 'makeUrlNavigationTarget')
const makeRouter = jest.spyOn(makeRouterImport, 'makeRouter')
let windowSpy

beforeEach(() => {
  makeRouter.mockClear()
  makeUrlNavigationTarget.mockClear()
  windowSpy = jest.spyOn(global, 'window', 'get')
})

afterEach(() => {
  windowSpy.mockRestore()
})

describe('makeUrlRouter()', () => {
  it('should be defined as a function', () => {
    expect(makeUrlRouter).toBeDefined()
    expect(typeof makeUrlRouter).toBe('function')
  })

  describe('calling it', () => {
    describe('when window does not exist', () => {
      it('should still return a router object', () => {
        windowSpy.mockImplementation(() => undefined)
        const router = makeUrlRouter()
        expect(typeof router).toBe('object')
      })
    })

    it('should return a router object', () => {
      const router = makeUrlRouter()
      expect(typeof router).toBe('object')
    })

    it('should call makeRouter', () => {
      const router = makeUrlRouter()
      expect(makeRouter).toHaveBeenCalledTimes(1)
    })

    it('should accept a history object', () => {
      const history = new NavigationHistory({ id: '/custom' })
      const router = makeUrlRouter({ history })
      expect(typeof router).toBe('object')
      expect(router.history).toBe(history)
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

      describe('parameters', () => {
        describe('query string', () => {
          it('should provide all URL parameters as the second argument of the action function', () => {
            const about = {
              id: '/about',
              action: (p, q) => q
            }
            const routes = [about]

            router.navigate('/about')
            expect(router.applyRouting(routes)).toBeUndefined()

            router.navigate('/about?')
            const justQueryStringCharacter = router.applyRouting(routes)
            expect(Object.keys(justQueryStringCharacter)).toHaveLength(0)

            router.navigate('/about?a')
            const varWithoutEquals = router.applyRouting(routes)
            expect(Object.keys(varWithoutEquals)).toHaveLength(1)
            expect(varWithoutEquals).toEqual(expect.objectContaining({
              a: ''
            }))

            router.navigate('/about?a=')
            const explicitEmptyValue = router.applyRouting(routes)
            expect(Object.keys(explicitEmptyValue)).toHaveLength(1)
            expect(explicitEmptyValue).toEqual(expect.objectContaining({
              a: ''
            }))

            router.navigate('/about?a=123&b&&c=xyz&')
            const mixedValues = router.applyRouting(routes)
            expect(Object.keys(mixedValues)).toHaveLength(3)
            expect(mixedValues).toEqual(expect.objectContaining({
              a: '123',
              b: '',
              c: 'xyz'
            }))
          })

          it('should provide required URL parameters in both parameters to the action function', () => {
            const about = {
              id: '/about?who&what',
              action: (required, query) => ({ required, query })
            }
            const routes = [about]

            router.navigate('/about')
            expect(router.applyRouting(routes)).toBeNull()

            router.navigate('/about?who')
            expect(router.applyRouting(routes)).toBeNull()

            router.navigate('/about?what')
            expect(router.applyRouting(routes)).toBeNull()

            router.navigate('/about?who&what')
            const empty = router.applyRouting(routes)
            expect(empty).not.toBeNull()
            expect(Object.keys(empty.required)).toHaveLength(2)
            expect(Object.keys(empty.query)).toHaveLength(2)
            expect(empty.query).toEqual(expect.objectContaining({
              who: '',
              what: ''
            }))

            router.navigate('/about?who=bill&what=pilot&sanford=son')
            const typical = router.applyRouting(routes)
            expect(typical).not.toBeNull()
            expect(Object.keys(typical.required)).toHaveLength(2)
            expect(Object.keys(typical.query)).toHaveLength(3)
            expect(typical.required).toEqual(expect.objectContaining({
              who: 'bill',
              what: 'pilot'
            }))
            expect(typical.query).toEqual(expect.objectContaining({
              who: 'bill',
              what: 'pilot',
              sanford: 'son'
            }))
          })
        })

        describe('in the URL', () => {
          it('should provide the parameters to the action function', () => {
            const userProfile = {
              id: '/user/:username',
              action: p => p
            }
            const userPhoto = {
              id: '/user/:username/photos/:photoId',
              action: p => p
            }
            const routes = [
              userProfile,
              userPhoto
            ]

            router.navigate('/user/joey')
            const userProfileParams = router.applyRouting(routes)
            expect(Object.keys(userProfileParams)).toHaveLength(1)
            expect(userProfileParams).toEqual(expect.objectContaining({
              username: 'joey'
            }))

            router.navigate('/user/joey/photos/29386')
            const userPhotoParams = router.applyRouting(routes)
            expect(Object.keys(userPhotoParams)).toHaveLength(2)
            expect(userPhotoParams).toEqual(expect.objectContaining({
              username: 'joey',
              photoId: '29386'
            }))
          })
        })
      })
    })
  })
})
