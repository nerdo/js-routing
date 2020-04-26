export const getSelectedUrlRoute = (routes, history) => {
  return routes.filter(r => r.id === history.current.id)[0]
}
