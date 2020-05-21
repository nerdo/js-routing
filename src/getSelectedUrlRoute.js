import { getPathParts } from './getPathParts'
import { makeUrlNavigationTarget } from './makeUrlNavigationTarget'
import { getPathRelativeTo } from './getPathRelativeTo'

export const getSelectedUrlRoute = (routes, history, parentId) => {
  const current = {
    pathParts: getPathParts(getPathRelativeTo(parentId || '', history.current.id)),
    params: history.current.params || {}
  }
  current.id = `/${current.pathParts.join('/')}`

  const toMetaData = original => {
    const isFunction = typeof original.id === 'function'
    const isRegExp = typeof original.id === 'object' && original.id.constructor === RegExp
    const target = !isFunction && !isRegExp ? makeUrlNavigationTarget(original.id) : void 0
    return {
      target,
      isFunction,
      isRegExp,
      pathParts: !isFunction && !isRegExp ? getPathParts(target.id) : null,
      original
    }
  }
  const eliminateIncompatibleNumPathParts = ({ isFunction, isRegExp, pathParts, original: { id, isNest } }) => {
    if (isFunction || isRegExp) {
      return true
    }
    return isNest ? pathParts.length <= current.pathParts.length : pathParts.length === current.pathParts.length
  }
  const doesMatch = ({ target, isFunction, isRegExp, pathParts, original: { id: originalId, isNest } }) => {
    if (isFunction) {
      return originalId(current.id)
    } else if (isRegExp) {
      return originalId.test(current.id)
    }

    const id = `/${pathParts.map((p, i) => p[0] === ':' ? current.pathParts[i] : p).join('/')}`
    const currentId = isNest ? `/${current.pathParts.slice(0, pathParts.length).join('/')}` : current.id
    if (id === currentId) {
      const requiredParams = Object.keys(target.params || {})
      const hasRequiredParams = requiredParams
        .reduce(
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
