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

const getNewNavigationHistory = () => new NavigationHistory({ id: '/' })

describe('makeUrlRouter({ history: getNewNavigationHistory() })', () => {
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
      expect(router.history.historyApi).toBe(window.history)
    })

    it('should call makeRouter', () => {
      const router = makeUrlRouter({ history: getNewNavigationHistory() })
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
    describe('navigate()', () => {
      it('should update history', async () => {
        const router = makeUrlRouter({ history: getNewNavigationHistory() })

        expect(router.history.current.id).not.toBe('/foo/bar')

        await router.navigate('/foo/bar')
        expect(makeUrlNavigationTarget).toHaveBeenCalledTimes(1)
        expect(router.history.current.id).toBe('/foo/bar')
      })
    })

    describe('applyRouting()', () => {
      it('should return null when no routes are provided', () => {
        const router = makeUrlRouter({ history: getNewNavigationHistory() })
        const returnValue = router.applyRouting()
        expect(returnValue).toBeNull()
      })

      it('should return null when no routes match', () => {
        const router = makeUrlRouter({ history: getNewNavigationHistory() })
        const returnValue = router.applyRouting([])
        expect(returnValue).toBeNull()
      })

      describe('commitRouting()', () => {
        it('should not allow the baseId to be removed', () => {
          const router = makeUrlRouter({ history: getNewNavigationHistory() })
          expect(router.parentIds).toHaveLength(1)
          router.applyRouting([])
          expect(router.parentIds).toHaveLength(1)
          router.commitRouting()
          expect(router.parentIds).toHaveLength(1)
        })
      })

      describe('simple routes', () => {
        it('should resolve the correct route', async () => {
          const router = makeUrlRouter({ history: getNewNavigationHistory() })
          const routes = {
            '/': () => 'home',
            '/about': () => 'about',
            '/foo/bar': () => 'foo bar'
          }

          await router.navigate('/about')
          expect(router.applyRouting(routes)).toBe('about')

          await router.navigate('/about#anchor')
          expect(router.applyRouting(routes)).toBe('about')

          await router.navigate('/about?query')
          expect(router.applyRouting(routes)).toBe('about')

          await router.navigate('/about#anchor?and=1&query=present')
          expect(router.applyRouting(routes)).toBe('about')

          await router.navigate('/')
          expect(router.applyRouting(routes)).toBe('home')

          await router.navigate('/foo/bar')
          expect(router.applyRouting(routes)).toBe('foo bar')

          await router.navigate('/not-found')
          expect(router.applyRouting(routes)).toBeNull()

          await router.navigate('/not/found')
          expect(router.applyRouting(routes)).toBeNull()
        })
      })

      describe('parameters', () => {
        describe('query string', () => {
          it('should provide all URL parameters as the second argument of the action function', async () => {
            const router = makeUrlRouter({ history: getNewNavigationHistory() })
            const about = {
              id: '/about',
              action: (p, q) => q
            }
            const routes = [about]

            await router.navigate('/about')
            expect(router.applyRouting(routes)).toBeUndefined()

            await router.navigate('/about?')
            const justQueryStringCharacter = router.applyRouting(routes)
            expect(Object.keys(justQueryStringCharacter)).toHaveLength(0)

            await router.navigate('/about?a')
            const varWithoutEquals = router.applyRouting(routes)
            expect(Object.keys(varWithoutEquals)).toHaveLength(1)
            expect(varWithoutEquals).toEqual(expect.objectContaining({
              a: ''
            }))

            await router.navigate('/about?a=')
            const explicitEmptyValue = router.applyRouting(routes)
            expect(Object.keys(explicitEmptyValue)).toHaveLength(1)
            expect(explicitEmptyValue).toEqual(expect.objectContaining({
              a: ''
            }))

            await router.navigate('/about?a=123&b&&c=xyz&')
            const mixedValues = router.applyRouting(routes)
            expect(Object.keys(mixedValues)).toHaveLength(3)
            expect(mixedValues).toEqual(expect.objectContaining({
              a: '123',
              b: '',
              c: 'xyz'
            }))
          })

          it('should provide required URL parameters in both parameters to the action function', async () => {
            const router = makeUrlRouter({ history: getNewNavigationHistory() })
            const about = {
              id: '/about?who&what',
              action: (required, query) => ({ required, query })
            }
            const routes = [about]

            await router.navigate('/about')
            expect(router.applyRouting(routes)).toBeNull()

            await router.navigate('/about?who')
            expect(router.applyRouting(routes)).toBeNull()

            await router.navigate('/about?what')
            expect(router.applyRouting(routes)).toBeNull()

            await router.navigate('/about?who&what')
            const empty = router.applyRouting(routes)
            expect(empty).not.toBeNull()
            expect(Object.keys(empty.required)).toHaveLength(2)
            expect(Object.keys(empty.query)).toHaveLength(2)
            expect(empty.query).toEqual(expect.objectContaining({
              who: '',
              what: ''
            }))

            await router.navigate('/about?who=bill&what=pilot&sanford=son')
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
          it('should provide the parameters to the action function', async () => {
            const router = makeUrlRouter({ history: getNewNavigationHistory() })
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

            await router.navigate('/user/joey')
            const userProfileParams = router.applyRouting(routes)
            expect(Object.keys(userProfileParams)).toHaveLength(1)
            expect(userProfileParams).toEqual(expect.objectContaining({
              username: 'joey'
            }))

            await router.navigate('/user/joey/photos/29386')
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
              getParameters: jest.fn((history, baseId, captureGroups) => ({ subPath: captureGroups[0] })),
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

          it('should throw a RoutingError if the id is a regular expression or function and getParameters is not a function', async () => {
            const router = makeUrlRouter({ history: getNewNavigationHistory() })
            clearMocks()

            home.getParameters = void 0
            await router.navigate('/')
            expect(() => router.applyRouting(routes)).toThrowError(RoutingError)

            info.getParameters = void 0
            await router.navigate('/info')
            expect(() => router.applyRouting(routes)).toThrowError(RoutingError)
          })

          it('should get called with the correct arguments and pass the params to the action function', async () => {
            const router = makeUrlRouter({ history: getNewNavigationHistory() })
            clearMocks()
            await router.navigate('/')
            router.applyRouting(routes)
            routes
              .filter(route => route !== home)
              .forEach(otherRoute => {
                expect(otherRoute.getParameters).not.toHaveBeenCalled()
                expect(otherRoute.action).not.toHaveBeenCalled()
              })
            expect(home.getParameters).toHaveBeenCalledTimes(1)
            expect(home.getParameters).toHaveBeenLastCalledWith(
              router.history,
              '/',
              expect.arrayExclusivelyContaining([])
            )
            expect(home.action).toHaveBeenCalledTimes(1)
            expect(home.action).toHaveBeenLastCalledWith(
              expect.objectExclusivelyContaining({ actualPath: '/' }),
              void 0
            )

            clearMocks()
            await router.navigate('/home')
            router.applyRouting(routes)
            routes
              .filter(route => route !== home)
              .forEach(otherRoute => {
                expect(otherRoute.getParameters).not.toHaveBeenCalled()
                expect(otherRoute.action).not.toHaveBeenCalled()
              })
            expect(home.getParameters).toHaveBeenCalledTimes(1)
            expect(home.getParameters).toHaveBeenLastCalledWith(
              router.history,
              '/',
              expect.arrayExclusivelyContaining([])
            )
            expect(home.action).toHaveBeenCalledTimes(1)
            expect(home.action).toHaveBeenLastCalledWith(
              expect.objectExclusivelyContaining({ actualPath: '/home' }),
              void 0
            )

            clearMocks()
            await router.navigate('/about')
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
              '/',
              expect.arrayExclusivelyContaining([''])
            )
            expect(info.action).toHaveBeenLastCalledWith(
              expect.objectExclusivelyContaining({ subPath: '' }),
              void 0
            )

            clearMocks()
            await router.navigate('/info/toosie/slide')
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
              '/',
              expect.arrayExclusivelyContaining(['/toosie/slide'])
            )
            expect(info.action).toHaveBeenLastCalledWith(
              expect.objectExclusivelyContaining({ subPath: '/toosie/slide' }),
              void 0
            )

            clearMocks()
            await router.navigate('/override/get/parameters')
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
              '/',
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
          it('should resolve correctly', async () => {
            const router = makeUrlRouter({ history: getNewNavigationHistory() })
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
                action: jest.fn(({ slug }) => slug)
              }
            }
            parent.routes = [
              parent.actors,
              parent.musicians
            ]

            await router.navigate('/actors/bernie-mac')
            const nestResult = router.applyRouting(parent.routes)

            expect(parent.actors.action).toHaveBeenCalledTimes(1)
            expect(parent.musicians.action).not.toHaveBeenCalled()
            expect(nestResult).toBeNull()

            await router.navigate('/actors/bernie-mac/tagline')
            const childResult = router.applyRouting(parent.routes)

            expect(parent.actors.action).toHaveBeenCalledTimes(2)
            expect(parent.musicians.action).not.toHaveBeenCalled()

            expect(child.tagline.action).toHaveBeenCalledTimes(1)
            expect(child.filmography.action).not.toHaveBeenCalled()

            expect(childResult).toBe('bernie-mac tagline')

            // ensure that routing outside of the nest still works
            await router.navigate('/musicians/childish-gambino')
            const parentResult = router.applyRouting(parent.routes)

            expect(parentResult).toBe('childish-gambino')
          })

          it('should resolve correctly with a baseId', async () => {
            const router = makeUrlRouter({ history: getNewNavigationHistory(), baseId: '/celebrities' })
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
                  const result = renderComponent(slug)
                  router.commitRouting()
                  return result
                })
              },
              musicians: {
                id: '/musicians/:slug',
                action: jest.fn(({ slug }) => slug)
              }
            }
            parent.routes = [
              parent.actors,
              parent.musicians
            ]

            await router.navigate('/celebrities/actors/bernie-mac/tagline')
            const result = router.applyRouting(parent.routes, false)
            router.commitRouting()

            expect(parent.actors.action).toHaveBeenCalledTimes(1)
            expect(parent.musicians.action).not.toHaveBeenCalled()

            expect(child.tagline.action).toHaveBeenCalledTimes(1)
            expect(child.filmography.action).not.toHaveBeenCalled()

            expect(result).toBe('bernie-mac tagline')

            // ensure that routing outside of the nest still works
            await router.navigate('/celebrities/musicians/childish-gambino')
            const parentResult = router.applyRouting(parent.routes, false)
            router.commitRouting()

            expect(parentResult).toBe('childish-gambino')
          })

          it('should resolve correctly with a deferred action', async () => {
            // a "deferred action" is an action function that returns
            // a function that gets executed  after applyRouting returns.
            const router = makeUrlRouter({ history: getNewNavigationHistory(), baseId: '/celebrities' })
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
                action: jest.fn(({ slug }) => () => {
                  const renderComponent = router.applyRouting(child.routes) || (() => null)
                  const result = renderComponent(slug)
                  router.commitRouting()
                  return result
                })
              },
              musicians: {
                id: '/musicians/:slug',
                action: jest.fn(({ slug }) => slug)
              }
            }
            parent.routes = [
              parent.actors,
              parent.musicians
            ]

            await router.navigate('/celebrities/actors/bernie-mac/tagline')
            const deferred = router.applyRouting(parent.routes, false)
            const result = deferred()
            router.commitRouting()

            expect(parent.actors.action).toHaveBeenCalledTimes(1)
            expect(parent.musicians.action).not.toHaveBeenCalled()

            expect(child.tagline.action).toHaveBeenCalledTimes(1)
            expect(child.filmography.action).not.toHaveBeenCalled()

            expect(result).toBe('bernie-mac tagline')

            // ensure that routing outside of the nest still works
            await router.navigate('/celebrities/musicians/childish-gambino')
            const parentResult = router.applyRouting(parent.routes, false)
            router.commitRouting()

            expect(parentResult).toBe('childish-gambino')
          })

          it('should resolve correctly with a deferred action in a transaction', async () => {
            // a "deferred action" is an action function that returns
            // a function that gets executed  after applyRouting returns.
            const router = makeUrlRouter({ history: getNewNavigationHistory(), baseId: '/celebrities' })
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
                action: jest.fn(({ slug }) => () => {
                  const renderComponent = router.applyRouting(child.routes) || (() => null)
                  const result = renderComponent(slug)
                  router.commitRouting()
                  return result
                })
              },
              musicians: {
                id: '/musicians/:slug',
                action: jest.fn(({ slug }) => slug)
              }
            }
            parent.routes = [
              parent.actors,
              parent.musicians
            ]

            await router.navigate('/celebrities/actors/bernie-mac/tagline')
            const result = router.applyRouting(parent.routes, deferred => deferred())

            expect(parent.actors.action).toHaveBeenCalledTimes(1)
            expect(parent.musicians.action).not.toHaveBeenCalled()

            expect(child.tagline.action).toHaveBeenCalledTimes(1)
            expect(child.filmography.action).not.toHaveBeenCalled()

            expect(result).toBe('bernie-mac tagline')

            // ensure that routing outside of the nest still works
            await router.navigate('/celebrities/musicians/childish-gambino')
            const parentResult = router.applyRouting(parent.routes, false)
            router.commitRouting()

            expect(parentResult).toBe('childish-gambino')
          })

          it('should throw a RoutingError when a nest with a non-string id does not have a getParentId function', async () => {
            const router = makeUrlRouter({ history: getNewNavigationHistory() })
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

            await router.navigate('/info')
            expect(() => router.applyRouting(routes)).toThrowError(RoutingError)

            await router.navigate('/hello')
            expect(() => router.applyRouting(routes)).toThrowError(RoutingError)
          })

          it('should call the getParentId function provided on nests', async () => {
            const router = makeUrlRouter({ history: getNewNavigationHistory() })
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

            await router.navigate('/info')
            expect(router.applyRouting(routes)).toBe('regex')
            expect(regex.getParentId).toHaveBeenCalledTimes(1)

            await router.navigate('/hello')
            expect(router.applyRouting(routes)).toBe('fn')
            expect(fn.getParentId).toHaveBeenCalledTimes(1)

            await router.navigate('/ice-cream/ben-and-jerrys')
            expect(router.applyRouting(routes)).toBe('regularNest')
            expect(regularNest.getParentId).toHaveBeenCalledTimes(1)
          })
        })
      })

      describe('with a baseId set', () => {
        it('should resolve the correct route', async () => {
          const router = makeUrlRouter({ baseId: '/some/base/path' })
          const routes = {
            '/': () => 'home',
            '/about': () => 'about',
            '/foo/bar': () => 'foo bar'
          }

          expect(router.getCurrentBaseId()).toBe('/some/base/path')

          await router.navigate('/some/base/path/about')
          expect(router.applyRouting(routes)).toBe('about')

          await router.navigate('/some/base/path/about#anchor')
          expect(router.applyRouting(routes)).toBe('about')

          await router.navigate('/some/base/path/about?query')
          expect(router.applyRouting(routes)).toBe('about')

          await router.navigate('/some/base/path/about#anchor?and=1&query=present')
          expect(router.applyRouting(routes)).toBe('about')

          await router.navigate('/some/base/path')
          expect(router.applyRouting(routes)).toBe('home')

          await router.navigate('/some/base/path/foo/bar')
          expect(router.applyRouting(routes)).toBe('foo bar')

          await router.navigate('/some/base/path/not-found')
          expect(router.applyRouting(routes)).toBeNull()

          await router.navigate('/some/base/path/not/found')
          expect(router.applyRouting(routes)).toBeNull()
        })
      })
    })
  })
})
