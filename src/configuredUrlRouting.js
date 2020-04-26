import { makeRouting } from './makeRouting'
import { history } from './history'

export const configuredUrlRouting = () => makeRouting({ history, getSelectedRoute: 1 })
