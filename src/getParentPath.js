import { getPathParts } from './getPathParts'

export const getParentPath = (route, history, baseId) => {
  const routePathParts = getPathParts(route.id)
  const currentPathParts = getPathParts(history.current.id)

  const parentStub = routePathParts
    .map((part, index) => part[0] === ':' ? currentPathParts[index] : part)
    .join('/')

  const prepend = baseId === '/' ? '' : baseId

  return `${prepend}/${parentStub}`
}
