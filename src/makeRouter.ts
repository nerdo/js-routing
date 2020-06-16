import { NavigationHistory } from './NavigationHistory';
import { getExpandedRoutes } from './getExpandedRoutes'
import { RoutingError } from './RoutingError'

export const makeRouter = (
  {
    history: NavigationHistory,
    makeRouterNavigationFunction,
    makeNavigationTarget,
    getSelectedRoute,
    getParamsFromRoute,
    getParentId,
    baseId: initialBaseId
  } = {}
) => {
  if (typeof history === 'undefined') {
    throw new Error('history property is required')
  } else if (typeof makeRouterNavigationFunction !== 'function') {
    throw new Error('makeRouterNavigationFunction(router) property is required')
  } else if (typeof makeNavigationTarget !== 'function') {
    throw new Error('makeNavigationTarget(input, baseId) property is required')
  } else if (typeof getSelectedRoute !== 'function') {
    throw new Error('getSelectedRoute(routes, history, parentId) property is required')
  } else if (typeof getParamsFromRoute !== 'function') {
    throw new Error('getParamsFromRoute(route, history) property is required')
  } else if (typeof getParentId !== 'function') {
    throw new Error('getParentId(route, history) property is required')
  }

  const router = {
    parentIds: [initialBaseId],
    currentBaseId: initialBaseId,
    commits: [],
    history,
    makeRouterNavigationFunction,
    makeNavigationTarget,
    getSelectedRoute,
    getParamsFromRoute,
    getParentId
  }

  router.getInitialBaseId = () => router.parentIds[0]

  router.getCurrentBaseId = () => router.currentBaseId

  router.getNestedBaseId = () => router.parentIds[router.parentIds.length - 1]

  router.applyRouting = (routes, transaction) => {
    router.currentBaseId = router.getNestedBaseId()
    const selected = getSelectedRoute(
      getExpandedRoutes(routes || []),
      history,
      router.parentIds[router.parentIds.length - 1]
    )
    router.lastSelectedRoute = selected
    const isFunction = selected && typeof selected.id === 'function'
    const isRegExp = selected && typeof selected.id === 'object' && selected.id.constructor === RegExp

    if (selected && selected.isNest) {
      const hasGetParentIdFunction = typeof selected.getParentId === 'function'
      if ((isFunction || isRegExp) && !hasGetParentIdFunction) {
        throw new RoutingError(
          'A getParentId() function must be defined on routes identified by regular expressions and functions.'
        )
      }
      const parentId = hasGetParentIdFunction
        ? selected.getParentId(selected, history, router.currentBaseId)
        : getParentId(selected, history, router.currentBaseId)
      router.parentIds.push(parentId)
      router.commits.push(router.popParentIds)
    } else {
      router.commits.push(void 0)
    }

    if ((isFunction || isRegExp) && selected && typeof selected.getParameters !== 'function') {
      throw new RoutingError(
        'Routes identified by a function or regular expression must define a getParameters function.'
      )
    }

    const params = getParamsFromRoute(selected, history, router.currentBaseId)
    const actionResult = selected ? selected.action(params, history.current.params) : null

    if (transaction === false) {
      return actionResult
    }

    const result = typeof transaction === 'function' ? transaction(actionResult) : actionResult
    router.commitRouting()
    return result
  }

  router.commitRouting = () => {
    const commit = router.commits.pop()
    if (commit) {
      commit()
    }
  }

  router.popParentIds = () => {
    if (router.parentIds.length > 1) {
      router.parentIds.pop()
      router.currentBaseId = router.getNestedBaseId()
    }
  }

  router.addNavigationInterceptor = () => { }

  router.navigate = router.makeRouterNavigationFunction(router)

  return router
}
