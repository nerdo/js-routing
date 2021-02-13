import { makeRouter } from './makeRouter'
import { makeUrlPopStateHandler } from './makeUrlPopStateHandler'
import { makeUrlRouter } from './makeUrlRouter'
import { NavigationHistory } from './NavigationHistory'
import { waitFor } from '@testing-library/dom'

describe('makeUrlPopStateHandler', () => {
  const makeTestRouter = (...args) =>
    makeRouter({
      baseId: '',
      history: new NavigationHistory({ id: '' }, window.history),
      makeRouterNavigationFunction: () => async () => {},
      makeNavigationTarget: () => ({ id: '' }),
      getSelectedRoute: () => null,
      getParamsFromRoute: () => null,
      getParentId: () => '',
      ...args
    })

  it('should be defined', () => {
    expect(makeUrlPopStateHandler).toBeDefined()
  })

  it('should return a function', () => {
    const router = makeTestRouter()
    const urlPopStateHandler = makeUrlPopStateHandler(router)
    expect(typeof urlPopStateHandler).toBe('function')
  })

  describe('when triggered', () => {
    it('should call navigate on the router', async () => {
      // const router = makeUrlRouter({ history: new NavigationHistory({ id: '' }, window.history) })
      const router = makeUrlRouter()
      const foo = { id: '/foo' }
      const bar = { id: '/bar' }
      const about = { id: '/about' }
      window.history.pushState(foo, '')
      router.history.push(foo)
      router.history.push(bar)
      router.history.push(about)

      const navigationSpy = jest.spyOn(router.history, 'navigate')
      expect(navigationSpy).not.toHaveBeenCalled()

      window.history.back()

      await waitFor(() => expect(navigationSpy).toHaveBeenCalledTimes(1))
      await waitFor(() => expect(navigationSpy).toHaveBeenCalledWith(expect.objectContaining(bar)))
    })
  })
})
