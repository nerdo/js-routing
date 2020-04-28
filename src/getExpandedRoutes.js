export const getExpandedRoutes = routes => {
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
