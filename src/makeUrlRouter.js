import { makeRouter } from './makeRouter'
import { getSelectedUrlRoute } from './getSelectedUrlRoute'
import { NavigationHistory } from './NavigationHistory'

const typical = {
  // TODO pass the browser history object as the last parameter
  history: () => new NavigationHistory(window ? window.location.pathname : '')
}

export const makeUrlRouter = ({ history = typical.history } = typical) => makeRouter({
  history: typeof history === 'function' ? history() : history,
  getSelectedRoute: getSelectedUrlRoute
})
