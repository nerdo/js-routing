
const getPathParts = path => path.split('/').filter(part => part !== '')

export const getSelectedUrlRoute = (routes, history) => {
  const numPathParts = getPathParts(history.current.id).length

  const toMetaData = original => ({
    original
  })
  const eliminateRoutesWithIncompatibleNumberOfPathParts = ({ original }) => original
  const eliminateNonMatches = ({ original }) => {
    return original.id === history.current.id
  }

  const match = routes
    .map(toMetaData)
    .filter(eliminateRoutesWithIncompatibleNumberOfPathParts)
    .filter(eliminateNonMatches)
    [0]

  return match ? match.original : void 0
}
