import { getExpandedRoutes } from './getExpandedRoutes'
import { getPathParts } from './getPathParts'

export const makeRouter = ({ history, makeNavigationTarget, getSelectedRoute } = {}) => {
  if (typeof history === 'undefined') {
    throw new Error('history property is required')
  } else if (typeof getSelectedRoute === 'undefined') {
    throw new Error('getSelectedRoute property is required')
  } else if (typeof makeNavigationTarget === 'undefined') {
    throw new Error('makeNavigationTarget property is required')
  }

  const parentIds = [void 0]

  const getParentPath = (currentId, selectedRoute) => {
    const selectedPathParts = getPathParts(selectedRoute.id)
    const currentPathParts = getPathParts(currentId)

    const parentStub = selectedPathParts
      .map((part, index) => part[0] === ':' ? currentPathParts[index] : part)
      .join('/')

    return `/${parentStub}`
  }

  return {
    history,
    makeNavigationTarget,
    getSelectedRoute,

    applyRouting(routes) {
      const selected = getSelectedRoute(getExpandedRoutes(routes || []), history, parentIds[parentIds.length - 1])
      if (selected && selected.isNest) {
        const isFunction = typeof selected.id === 'function'
        const isRegExp = typeof selected.id === 'object' && selected.id.constructor === RegExp
        const parentId = isFunction || isRegExp
          // TODO if the id is a function or regular expression, the route needs to provide the getParentId function
          ? selected.getParentId(history.current.id, selected)
          // TODO getParentPath is URL specific. It should be supplied to makeRouter.
          : getParentPath(history.current.id, selected)
        parentIds.push(parentId)
      }

      // TODO getParamsFromRoute should be supplied to makeRouter. This implementation is URL specific.
      const getParamsFromRoute = route => {
        if (!route) {
          return
        }

        const isFunction = typeof route.id === 'function'
        const isRegExp = typeof route.id === 'object' && route.id.constructor === RegExp

        const getParameters = typeof route.getParameters === 'function'
          ? history => {
            const matches = !isRegExp ? [] : route.id.exec(history.current.id).splice(1)
            return route.getParameters(history, matches)
          }
          : history => {
            const targetPathParts = getPathParts(history.current.id)
            const params = getPathParts(route.id)
              .map((part, i) => ({ name: part, value: targetPathParts[i] }))
              .filter(current => current.name[0] === ':')
              .reduce(
                (obj, current) => {
                  obj[current.name.substr(1)] = current.value
                  return obj
                },
                {}
              )
            const target = !isFunction && !isRegExp ? makeNavigationTarget(route.id) : {}
            const currentParams = history.current.params || {}
            const requiredQueryParams = Object.keys(target.params || {})
                .reduce(
                  (obj, paramName) => {
                    obj[paramName] = currentParams[paramName]
                    return obj
                  },
                  {}
                )
            return {
              ...params,
              ...requiredQueryParams
            }
          }

        return getParameters(history)
      }
      const params = getParamsFromRoute(selected)
      return selected ? selected.action(params, history.current.params) : null
    },

    navigate(input) {
      history.push(makeNavigationTarget(input))
    },

    addInterceptor() {
    }
  }
}
