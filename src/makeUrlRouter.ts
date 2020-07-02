import { makeRouter } from './makeRouter'
import { getSelectedUrlRoute } from './getSelectedUrlRoute'
import { NavigationHistory } from './NavigationHistory'
import { makeUrlNavigationFunction } from './makeUrlNavigationFunction'
import { makeUrlNavigationTarget } from './makeUrlNavigationTarget'
import { getUrlParamsFromRoute } from './getUrlParamsFromRoute'
import { getParentPath } from './getParentPath'
import { MakeUrlRouterFunction } from './interfaces'

const typical = {
  history: () => {
    const target = makeUrlNavigationTarget(window ? `${window.location.pathname}${window.location.search}` : '/')
    const historyApi = window ? window.history : void 0
    return new NavigationHistory(target, historyApi)
  },
  baseId: '/'
}

export const makeUrlRouter: MakeUrlRouterFunction = ({ history = typical.history, baseId = '/' } = typical) => {
  const resolvedHistory = typeof history === 'function' ? history() : history
  return makeRouter({
    history: resolvedHistory,
    makeRouterNavigationFunction: makeUrlNavigationFunction,
    makeNavigationTarget: makeUrlNavigationTarget,
    getSelectedRoute: getSelectedUrlRoute,
    getParamsFromRoute: getUrlParamsFromRoute,
    getParentId: getParentPath,
    baseId
  })
}
