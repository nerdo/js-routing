import { getExpandedRoutes } from './getExpandedRoutes'

export const makeRouting = ({ history, getSelectedRoute } = {}) => {
  if (typeof history === 'undefined') {
    throw new Error('history property is required')
  } else if (typeof getSelectedRoute === 'undefined') {
    throw new Error('getSelectedRoute property is required')
  }

  return {
    applyRouting(routes) {
      return getExpandedRoutes(routes).filter(r => r.id === history.current.id)[0] || null
    },

    addInterceptor() {
    },

    navigate() {
    }
  }
}
