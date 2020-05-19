import { makeUrlRouter } from '.'
import { NavigationHistory } from './NavigationHistory'
import { getSelectedUrlRoute } from './getSelectedUrlRoute'
import * as makeRouterImport from './makeRouter'
import * as makeUrlNavigationTargetImport from './makeUrlNavigationTarget'
import { RoutingError } from './RoutingError'

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
      const getSelectedRoute = () => { }
      const router = makeUrlRouter({ getSelectedRoute })
      expect(router.getSelectedRoute).not.toBe(getSelectedRoute)
      expect(router.getSelectedRoute).toBe(getSelectedUrlRoute)
    })

    it('should not store the makeNavigationTarget argument (it should always be makeUrlNavigationTarget())', () => {
      const makeNavigationTarget = () => { }
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
        it('should resolve the correct route', () => {
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

        describe('getParameters()', () => {
          let home, info, overrideGetParameters, routes
          beforeEach(() => {
            home = {
              id: (id) => id === '/' || id === '/home',
              getParameters: jest.fn(history => ({ actualPath: history.current.id })),
              action: jest.fn(params => params)
            }
            info = {
              id: /^\/(?:info|about)(\/?.*)$/,
              getParameters: jest.fn((history, captureGroups) => ({ subPath: captureGroups[0] })),
              action: jest.fn(params => params)
            }
            overrideGetParameters = {
              id: '/override/get/parameters',
              getParameters: jest.fn(() => ({ contrived: true })),
              action: jest.fn(params => params)
            }
            routes = [
              home,
              info,
              overrideGetParameters
            ]
          })

          const clearMocks = () => {
            routes.forEach(route => {
              route.getParameters.mockClear()
              route.action.mockClear()
            })
          }

          it('should throw a RoutingError if the id is a regular expression or function and getParameters is not a function', () => {
            clearMocks()

            home.getParameters = void 0
            router.navigate('/')
            expect(() => router.applyRouting(routes)).toThrowError(RoutingError)

            info.getParameters = void 0
            router.navigate('/info')
            expect(() => router.applyRouting(routes)).toThrowError(RoutingError)
          })

          it('should get called with the correct arguments and pass the params to the action function', () => {
            clearMocks()
            router.navigate('/')
            router.applyRouting(routes)
            routes
              .filter(route => route !== home)
              .forEach(otherRoute => {
                expect(otherRoute.getParameters).not.toHaveBeenCalled()
                expect(otherRoute.action).not.toHaveBeenCalled()
              })
            expect(home.getParameters).toHaveBeenCalledTimes(1)
            expect(home.getParameters).toHaveBeenLastCalledWith(router.history, expect.arrayExclusivelyContaining([]))
            expect(home.action).toHaveBeenCalledTimes(1)
            expect(home.action).toHaveBeenLastCalledWith(
              expect.objectExclusivelyContaining({ actualPath: '/' }),
              void 0
            )

            clearMocks()
            router.navigate('/home')
            router.applyRouting(routes)
            routes
              .filter(route => route !== home)
              .forEach(otherRoute => {
                expect(otherRoute.getParameters).not.toHaveBeenCalled()
                expect(otherRoute.action).not.toHaveBeenCalled()
              })
            expect(home.getParameters).toHaveBeenCalledTimes(1)
            expect(home.getParameters).toHaveBeenLastCalledWith(router.history, expect.arrayExclusivelyContaining([]))
            expect(home.action).toHaveBeenCalledTimes(1)
            expect(home.action).toHaveBeenLastCalledWith(
              expect.objectExclusivelyContaining({ actualPath: '/home' }),
              void 0
            )

            clearMocks()
            router.navigate('/about')
            router.applyRouting(routes)
            routes
              .filter(route => route !== info)
              .forEach(otherRoute => {
                expect(otherRoute.getParameters).not.toHaveBeenCalled()
                expect(otherRoute.action).not.toHaveBeenCalled()
              })
            expect(info.getParameters).toHaveBeenCalledTimes(1)
            expect(info.getParameters).toHaveBeenLastCalledWith(router.history, expect.arrayExclusivelyContaining(['']))
            expect(info.action).toHaveBeenLastCalledWith(expect.objectExclusivelyContaining({ subPath: '' }), void 0)

            clearMocks()
            router.navigate('/info/toosie/slide')
            router.applyRouting(routes)
            routes
              .filter(route => route !== info)
              .forEach(otherRoute => {
                expect(otherRoute.getParameters).not.toHaveBeenCalled()
                expect(otherRoute.action).not.toHaveBeenCalled()
              })
            expect(info.getParameters).toHaveBeenCalledTimes(1)
            expect(info.getParameters).toHaveBeenLastCalledWith(
              router.history,
              expect.arrayExclusivelyContaining(['/toosie/slide'])
            )
            expect(info.action).toHaveBeenLastCalledWith(
              expect.objectExclusivelyContaining({ subPath: '/toosie/slide' }),
              void 0
            )

            clearMocks()
            router.navigate('/override/get/parameters')
            router.applyRouting(routes)
            routes
              .filter(route => route !== overrideGetParameters)
              .forEach(otherRoute => {
                expect(otherRoute.getParameters).not.toHaveBeenCalled()
                expect(otherRoute.action).not.toHaveBeenCalled()
              })
            expect(overrideGetParameters.getParameters).toHaveBeenCalledTimes(1)
            expect(overrideGetParameters.getParameters).toHaveBeenLastCalledWith(
              router.history,
              expect.arrayExclusivelyContaining([])
            )
            expect(overrideGetParameters.action).toHaveBeenCalledTimes(1)
            expect(overrideGetParameters.action).toHaveBeenLastCalledWith(
              expect.objectExclusivelyContaining({ contrived: true }),
              void 0
            )
          })
        })
      })

      describe('nesting', () => {
        describe('child routes', () => {
          it('should resolve relative to the parent route', () => {
            const child = {
              tagline: {
                id: '/tagline',
                action: jest.fn(() => slug => `${slug} tagline`)
              },
              filmography: {
                id: '/filmography',
                action: jest.fn(() => slug => `${slug} filmography`)
              }
            }
            child.routes = [
              child.tagline,
              child.filmography
            ]

            const parent = {
              actors: {
                id: '/actors/:slug',
                isNest: true,
                action: jest.fn(({ slug }) => {
                  const renderComponent = router.applyRouting(child.routes) || (() => null)
                  return renderComponent(slug)
                })
              },
              musicians: {
                id: '/musicians/:slug',
                action: jest.fn()
              }
            }
            parent.routes = [
              parent.actors,
              parent.musicians
            ]

            router.navigate('/actors/bernie-mac/tagline')
            const result = router.applyRouting(parent.routes)

            expect(parent.actors.action).toHaveBeenCalledTimes(1)
            expect(parent.musicians.action).not.toHaveBeenCalled()

            expect(child.tagline.action).toHaveBeenCalledTimes(1)
            expect(child.filmography.action).not.toHaveBeenCalled()

            expect(result).toBe('bernie-mac tagline')
          })

          it('should throw a RoutingError when a nest with a non-string id does not have a getParentId function', () => {
            const regex = {
              id: /\/(info|about)/,
              isNest: true,
              getParameters: () => {},
              action: () => {}
            }
            const fn = {
              id: id => id === '/hello',
              isNest: true,
              getParameters: () => {},
              action: () => {}
            }
            const routes = [
              regex,
              fn
            ]

            router.navigate('/info')
            expect(() => router.applyRouting(routes)).toThrowError(RoutingError)

            router.navigate('/hello')
            expect(() => router.applyRouting(routes)).toThrowError(RoutingError)
          })

          it('should call the getParentId function provided on nests', () => {
            const regex = {
              id: /\/(info|about)/,
              isNest: true,
              getParameters: () => {},
              getParentId: jest.fn(),
              action: () => 'regex'
            }
            const fn = {
              id: id => id === '/hello',
              isNest: true,
              getParameters: () => {},
              getParentId: jest.fn(),
              action: () => 'fn'
            }
            const regularNest = {
              id: '/ice-cream/:brandSlug',
              isNest: true,
              getParentId: jest.fn(),
              action: () => 'regularNest'
            }
            const routes = [
              regex,
              fn,
              regularNest
            ]

            router.navigate('/info')
            expect(router.applyRouting(routes)).toBe('regex')
            expect(regex.getParentId).toHaveBeenCalledTimes(1)

            router.navigate('/hello')
            expect(router.applyRouting(routes)).toBe('fn')
            expect(fn.getParentId).toHaveBeenCalledTimes(1)

            router.navigate('/ice-cream/ben-and-jerrys')
            expect(router.applyRouting(routes)).toBe('regularNest')
            expect(regularNest.getParentId).toHaveBeenCalledTimes(1)
          })
        })
      })

      describe('with a baseId set', () => {
        it('should resolve the correct route', () => {
          const routes = {
            '/': () => 'home',
            '/about': () => 'about',
            '/foo/bar': () => 'foo bar'
          }

          router = makeUrlRouter({ baseId: '/some/base/path' })
          expect(router.getCurrentBaseId()).toBe('/some/base/path')

          router.navigate('/some/base/path/about')
          expect(router.applyRouting(routes)).toBe('about')

          router.navigate('/some/base/path/about#anchor')
          expect(router.applyRouting(routes)).toBe('about')

          router.navigate('/some/base/path/about?query')
          expect(router.applyRouting(routes)).toBe('about')

          router.navigate('/some/base/path/about#anchor?and=1&query=present')
          expect(router.applyRouting(routes)).toBe('about')

          router.navigate('/some/base/path')
          expect(router.applyRouting(routes)).toBe('home')

          router.navigate('/some/base/path/foo/bar')
          expect(router.applyRouting(routes)).toBe('foo bar')

          router.navigate('/some/base/path/not-found')
          expect(router.applyRouting(routes)).toBeNull()

          router.navigate('/some/base/path/not/found')
          expect(router.applyRouting(routes)).toBeNull()
        })
      })
    })
  })
})
