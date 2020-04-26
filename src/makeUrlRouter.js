import { makeRouter } from './makeRouter'
import { URLHistory } from './URLHistory'

const typical = {
  history: () => new URLHistory(null, '', null)
}

export const makeUrlRouter = ({ history = typical.history } = typical) => {
  return makeRouter({
    history: typeof history === 'function' ? history() : history,
    getSelectedRoute: 1
  })
}
