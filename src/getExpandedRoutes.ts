import { AbbreviatedRoutes, ExpandedRoutes } from './interfaces'

export const getExpandedRoutes = (routes: AbbreviatedRoutes | ExpandedRoutes): ExpandedRoutes => {
  if (Array.isArray(routes)) {
    return routes
  }

  return Object
    .keys(routes)
    .map(key => ({
      id: key,
      action: routes[key]
    }))
}
