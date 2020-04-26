import { makeRouter } from './makeRouter'
import { getSelectedUrlRoute } from './getSelectedUrlRoute'
import { NavigationHistory } from './NavigationHistory'

const typical = {
  // TODO pass the browser history object as the 4th parameter
  history: () => new NavigationHistory(null, '', null)
}

export const makeUrlRouter = ({ history = typical.history } = typical) => {
  return makeRouter({
    history: typeof history === 'function' ? history() : history,
    getSelectedRoute: getSelectedUrlRoute
  })
}
