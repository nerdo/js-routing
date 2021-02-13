import { getPathParts } from './getPathParts'
import { makeUrlNavigationTarget } from './makeUrlNavigationTarget'
import { getPathRelativeTo } from './getPathRelativeTo'
import { Route, ExpandedRoutes, RouteId, Params } from './interfaces'
import { NavigationHistory } from './NavigationHistory'

export const getSelectedUrlRoute = (
  routes: ExpandedRoutes,
  relativeToId: RouteId,
  currentParams: Params,
  parentId: RouteId = void 0
): Route | undefined => {
  const current = {
    id: '',
    pathParts: getPathParts(getPathRelativeTo(parentId || '', relativeToId)),
    params: currentParams || {}
  }
  current.id = `/${current.pathParts.join('/')}`

  const toMetaData = (original: Route) => {
    const isFunction = typeof original.id === 'function'
    const isRegExp = typeof original.id === 'object' && (original.id as object).constructor === RegExp
    const target = !isFunction && !isRegExp ? makeUrlNavigationTarget(original.id as string) : void 0
    return {
      target,
      isFunction,
      isRegExp,
      pathParts: !isFunction && !isRegExp ? getPathParts(target.id) : null,
      original
    }
  }
  const eliminateIncompatibleNumPathParts = ({ isFunction, isRegExp, pathParts, original: { id, isNest = false } }) => {
    if (isFunction || isRegExp) {
      return true
    }
    return isNest ? pathParts.length <= current.pathParts.length : pathParts.length === current.pathParts.length
  }
  const doesMatch = ({ target, isFunction, isRegExp, pathParts, original: { id: originalId, isNest = false } }) => {
    if (isFunction) {
      return originalId(current.id)
    } else if (isRegExp) {
      return originalId.test(current.id)
    }

    const id = `/${pathParts.map((p, i) => (p[0] === ':' ? current.pathParts[i] : p)).join('/')}`
    const currentId = isNest ? `/${current.pathParts.slice(0, pathParts.length).join('/')}` : current.id
    if (id === currentId) {
      const requiredParams = Object.keys(target.params || {})
      const hasRequiredParams = requiredParams.reduce(
        (paramsArePresent, paramName) => paramsArePresent && typeof current.params[paramName] !== 'undefined',
        true
      )
      return hasRequiredParams
    }

    return false
  }

  const match = routes
    .map(toMetaData)
    .filter(eliminateIncompatibleNumPathParts)
    .reduce((match, current) => match || (doesMatch(current) ? current : void 0), void 0)

  return match ? match.original : void 0
}
