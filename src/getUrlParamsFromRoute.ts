import { getPathParts } from './getPathParts'
import { makeUrlNavigationTarget } from './makeUrlNavigationTarget'
import { Route, RouteId } from './interfaces'
import { NavigationHistory } from './NavigationHistory'

export const getUrlParamsFromRoute = (route: Route, history: NavigationHistory, baseId: RouteId) => {
  if (!route) {
    return
  }

  const isFunction = typeof route.id === 'function'
  const isRegExp = typeof route.id === 'object' && route.id.constructor === RegExp

  const getParameters = typeof route.getParameters === 'function'
    ? history => {
      const matches = !isRegExp ? [] : (route.id as RegExp).exec(history.current.id).splice(1)
      return route.getParameters(history, baseId, matches)
    }
    : history => {
      const prepend = baseId === '/' ? '' : (baseId || '')
      const targetPathParts = getPathParts(history.current.id)
      const params = getPathParts(`${prepend}/${route.id}`)
        .map((part, i) => ({ name: part, value: targetPathParts[i] }))
        .filter(current => current.name[0] === ':')
        .reduce(
          (obj, current) => {
            obj[current.name.substr(1)] = current.value
            return obj
          },
          {}
        )
      const target = makeUrlNavigationTarget(route.id as RouteId)
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
