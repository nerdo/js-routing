import { getExpandedRoutes } from './getExpandedRoutes'

export const makeRouter = ({ history, getSelectedRoute } = {}) => {
  if (typeof history === 'undefined') {
    throw new Error('history property is required')
  } else if (typeof getSelectedRoute === 'undefined') {
    throw new Error('getSelectedRoute property is required')
  }

  return {
    history,

    applyRouting(routes) {
      const selected = getSelectedRoute(getExpandedRoutes(routes || []), history)
      return selected ? selected.route() : null
    },

    addInterceptor() {
    },

    navigate(id) {
      history.pushState(null, '', id)
    }
  }
}
