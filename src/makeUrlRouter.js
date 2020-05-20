import { makeRouter } from './makeRouter'
import { getSelectedUrlRoute } from './getSelectedUrlRoute'
import { NavigationHistory } from './NavigationHistory'
import { makeUrlNavigationTarget } from './makeUrlNavigationTarget'
import { getUrlParamsFromRoute } from './getUrlParamsFromRoute'
import { getParentPath } from './getParentPath'

const typical = {
  history: () => {
    const id = window ? window.location.pathname : '/'
    const historyApi = window ? window.history : void 0
    return new NavigationHistory({ id }, historyApi)
  }
}

export const makeUrlRouter = ({ history = typical.history, baseId } = typical) => {
  const resolvedHistory = typeof history === 'function' ? history() : history
  return makeRouter({
    history: resolvedHistory,
    makeNavigationTarget: makeUrlNavigationTarget,
    getSelectedRoute: getSelectedUrlRoute,
    getParamsFromRoute: getUrlParamsFromRoute,
    getParentId: getParentPath,
    baseId: typeof baseId === 'undefined' ? resolvedHistory.current.id : baseId
  })
}
