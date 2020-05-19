import { getPathParts } from './getPathParts'
import { makeUrlNavigationTarget } from './makeUrlNavigationTarget'

export const getUrlParamsFromRoute = (route, history) => {
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
      const target = !isFunction && !isRegExp ? makeUrlNavigationTarget(route.id) : {}
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
