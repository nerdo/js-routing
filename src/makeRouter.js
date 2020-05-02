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

  return {
    history,
    makeNavigationTarget,
    getSelectedRoute,

    applyRouting(routes) {
      const selected = getSelectedRoute(getExpandedRoutes(routes || []), history)
      const getParamsFromRoute = route => {
        if (!route) {
          return
        }

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
        const isFunction = typeof route.id === 'function'
        const isRegExp = typeof route.id === 'object' && route.id.constructor === RegExp
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
