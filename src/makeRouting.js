export const makeRouting = () => ({
  applyRouting(routes) {
    return getExpandedRoutes(routes).filter(r => r.id === history.current.id)[0] || null
  },

  addInterceptor() {
  },

  navigate() {
  }
})
