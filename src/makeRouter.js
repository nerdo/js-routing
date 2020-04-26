import { getExpandedRoutes } from './getExpandedRoutes'

const nullRoute = { route: () => null }

export const makeRouter = ({ history, getSelectedRoute } = {}) => {
  if (typeof history === 'undefined') {
    throw new Error('history property is required')
  } else if (typeof getSelectedRoute === 'undefined') {
    throw new Error('getSelectedRoute property is required')
  }

  return {
    applyRouting(routes) {
      const { route } = getExpandedRoutes(routes || []).filter(r => r.id === history.current.id)[0] || nullRoute
      return route()
    },

    addInterceptor() {
    },

    navigate(id) {
      history.pushState(null, '', id)
    }
  }
}
