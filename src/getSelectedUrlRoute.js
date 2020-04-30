const getPathParts = path => path.split('/').filter(part => part !== '')

export const getSelectedUrlRoute = (routes, history) => {
  const target = {
    pathParts: getPathParts(history.current.id),
  }
  target.id = `/${target.pathParts.join('/')}`

  const toMetaData = original => {
    const isFunction = typeof original.id === 'function'
    const isRegExp = typeof original.id === 'object' && original.id.constructor === RegExp
    return {
      isFunction,
      isRegExp,
      pathParts: !isFunction && !isRegExp ? getPathParts(original.id) : null,
      original
    }
  }
  const eliminateIncompatibleNumPathParts = ({ isFunction, isRegExp, pathParts, original: { id, isNest } }) => {
    if (isFunction || isRegExp) {
      return true
    }
    return isNest ? pathParts.length <= target.pathParts.length : pathParts.length === target.pathParts.length
  }
  const doesMatch = ({ isFunction, isRegExp, pathParts, original: { id: originalId, isNest } }) => {
    if (isFunction) {
      return originalId(target.id)
    } else if (isRegExp) {
      return originalId.test(target.id)
    }

    const id = `/${pathParts.map((p, i) => p[0] === ':' ? target.pathParts[i] : p).join('/')}`
    const targetId = isNest ? `/${target.pathParts.slice(0, pathParts.length).join('/')}` : target.id
    return id === targetId
  }

  const match = routes
    .map(toMetaData)
    .filter(eliminateIncompatibleNumPathParts)
    .reduce((match, current) => match || (doesMatch(current) ? current : void 0), void 0)

  return match ? match.original : void 0
}
