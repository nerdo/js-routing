import { getExpandedRoutes } from './getExpandedRoutes'
import { RoutingError } from './RoutingError'

export const makeRouter = ({ history, makeNavigationTarget, getSelectedRoute, getParamsFromRoute, getParentId, baseId } = {}) => {
  if (typeof history === 'undefined') {
    throw new Error('history property is required')
  } else if (typeof makeNavigationTarget !== 'function') {
    throw new Error('makeNavigationTarget(input) property is required')
  } else if (typeof getSelectedRoute !== 'function') {
    throw new Error('getSelectedRoute(routes, history, parentId) property is required')
  } else if (typeof getParamsFromRoute !== 'function') {
    throw new Error('getParamsFromRoute(route, history) property is required')
  } else if (typeof getParentId !== 'function') {
    throw new Error('getParentId(route, history) property is required')
  }

  const parentIds = [baseId]

  return {
    history,
    makeNavigationTarget,
    getSelectedRoute,
    getParamsFromRoute,
    getParentId,

    getCurrentBaseId() {
      return parentIds[parentIds.length - 1]
    },

    applyRouting(routes) {
      const selected = getSelectedRoute(getExpandedRoutes(routes || []), history, parentIds[parentIds.length - 1])
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
          ? selected.getParentId(selected, history)
          : getParentId(selected, history)
        parentIds.push(parentId)
      }

      if ((isFunction || isRegExp) && selected && typeof selected.getParameters !== 'function') {
        throw new RoutingError('Routes identified by a function or regular expression must define a getParameters function.')
      }

      const params = getParamsFromRoute(selected, history)
      return selected ? selected.action(params, history.current.params) : null
    },

    async navigate(input) {
      history.push(makeNavigationTarget(input))
    },

    addInterceptor() {
    }
  }
}
