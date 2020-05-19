import { makeRouter } from './makeRouter'
import { getSelectedUrlRoute } from './getSelectedUrlRoute'
import { NavigationHistory } from './NavigationHistory'
import { makeUrlNavigationTarget } from './makeUrlNavigationTarget'
import { getUrlParamsFromRoute } from './getUrlParamsFromRoute'
import { getParentPath } from './getParentPath'

const typical = {
  // TODO pass the browser history object as the last parameter
  history: () => new NavigationHistory({ id: window ? window.location.pathname : '/' })
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
