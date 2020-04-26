import { getExpandedRoutes } from './getExpandedRoutes'

export const makeRouter = ({ history, makeNavigationTarget, getSelectedRoute } = {}) => {
  if (typeof history === 'undefined') {
    throw new Error('history property is required')
  } else if (typeof getSelectedRoute === 'undefined') {
    throw new Error('getSelectedRoute property is required')
  } else if (typeof makeNavigationTarget === 'undefined') {
    throw new Error('makeNavigationTarget property is required')
  }

  return {
    history,
    makeNavigationTarget,
    getSelectedRoute,

    applyRouting(routes) {
      const selected = getSelectedRoute(getExpandedRoutes(routes || []), history)
      return selected ? selected.route() : null
    },

    navigate(input) {
      history.push(makeNavigationTarget(input))
    },

    addInterceptor() {
    }
  }
}
