const getPathParts = path => path.split('/').filter(part => part !== '')

export const getSelectedUrlRoute = (routes, history) => {
  const target = {
    pathParts: getPathParts(history.current.id),
  }
  target.id = `/${target.pathParts.join('/')}`

  const toMetaData = original => ({
    pathParts: getPathParts(original.id),
    original
  })
  const eliminateIncompatibleNumPathParts = ({ pathParts, original: { isNest } }) => {
    return isNest ? pathParts.length <= target.pathParts.length : pathParts.length === target.pathParts.length
  }
  const eliminateNonMatches = ({ pathParts, original: { isNest } }) => {
    const id = `/${pathParts.map((p, i) => p[0] === ':' ? target.pathParts[i] : p).join('/')}`
    const targetId = isNest ? `/${target.pathParts.slice(0, pathParts.length).join('/')}` : target.id
    return id === targetId
  }

  const match = routes
    .map(toMetaData)
    .filter(eliminateIncompatibleNumPathParts)
    .filter(eliminateNonMatches)
    [0]

  return match ? match.original : void 0
}
