import { getPathParts } from './getPathParts'

export const getParentPath = (route, history, baseId) => {
  const prepend = baseId === '/' ? '' : (baseId || '')
  const routePathParts = getPathParts(`${prepend}/${route.id}`)
  const currentPathParts = getPathParts(history.current.id)

  const parentStub = routePathParts
    .map((part, index) => part[0] === ':' ? currentPathParts[index] : part)
    .join('/')

  return `/${parentStub}`
}
