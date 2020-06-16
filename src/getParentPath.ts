import { NavigationHistory } from './NavigationHistory'
import { getPathParts } from './getPathParts'
import { Route, RouteId } from './interfaces'

export const getParentPath = (route: Route, history: NavigationHistory, baseId: RouteId) => {
  const prepend = baseId === '/' ? '' : (baseId || '')
  const routePathParts = getPathParts(`${prepend}/${route.id}`)
  const currentPathParts = getPathParts(history.current.id)

  const parentStub = routePathParts
    .map((part, index) => part[0] === ':' ? currentPathParts[index] : part)
    .join('/')

  return `/${parentStub}`
}
