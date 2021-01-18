import { makeRouter } from './makeRouter'
import { getSelectedUrlRoute } from './getSelectedUrlRoute'
import { NavigationHistory } from './NavigationHistory'
import { makeUrlNavigationFunction } from './makeUrlNavigationFunction'
import { makeUrlNavigationTarget } from './makeUrlNavigationTarget'
import { getUrlParamsFromRoute } from './getUrlParamsFromRoute'
import { getParentPath } from './getParentPath'
import { MakeUrlRouterFunction } from './interfaces'
import { makeUrlPopStateHandler } from './makeUrlPopStateHandler'

const typical = {
  history: () => {
    const target = makeUrlNavigationTarget(window ? `${window.location.pathname}${window.location.search}` : '/')
    const historyApi = window ? window.history : void 0
    return new NavigationHistory(target, historyApi)
  },
  baseId: '/',
  makePopStateHandler: makeUrlPopStateHandler
}

export const makeUrlRouter: MakeUrlRouterFunction = ({
  history = typical.history,
  baseId = typical.baseId,
  makePopStateHandler = typical.makePopStateHandler
} = typical) => {
  const resolvedHistory = typeof history === 'function' ? history() : history

  const router = makeRouter({
    history: resolvedHistory,
    makeRouterNavigationFunction: makeUrlNavigationFunction,
    makeNavigationTarget: makeUrlNavigationTarget,
    getSelectedRoute: getSelectedUrlRoute,
    getParamsFromRoute: getUrlParamsFromRoute,
    getParentId: getParentPath,
    baseId
  })

  router.popStateHandler = makePopStateHandler(router)
  if (window && router.popStateHandler) {
    window.addEventListener('popstate', router.popStateHandler)
    const defaultRouterDestruct = router.destruct
    router.destruct = () => {
      window.removeEventListener('popstate', router.popStateHandler)
      return defaultRouterDestruct()
    }
  }

  return router
}
