import { NavigationTarget, PopStateHandler, Router } from './interfaces'

export const makeUrlPopStateHandler = (router: Router): PopStateHandler => {
  return (event: PopStateEvent) => {
    if (event.state && typeof event.state.id !== 'undefined') {
      const target = event.state as NavigationTarget
      router.history.replace(target)
    }
  }
}
