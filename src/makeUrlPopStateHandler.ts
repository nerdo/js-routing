import { NavigationTarget, PopStateHandler, Router } from './interfaces';

export const makeUrlPopStateHandler = (router: Router): PopStateHandler => {
  return (event: PopStateEvent) => {
    if (typeof event.state?.id !== 'undefined') {
      const target = event.state as NavigationTarget
      router.navigate(target.id, false, target.params, target.state)
    }
  }
}
