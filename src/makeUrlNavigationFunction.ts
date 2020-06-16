import { MakeRouterNavigationFunction } from './interfaces'

export const makeUrlNavigationFunction: MakeRouterNavigationFunction = router => {
  const { history, makeNavigationTarget } = router || {}
  const baseId = history && history.current ? history.current.id : ''
  return async input => {
    history.push(makeNavigationTarget(input, baseId))
  }
}
