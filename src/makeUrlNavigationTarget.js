import { objectFromQueryString } from './objectFromQueryString'

export const makeUrlNavigationTarget = input => {
  const anchorIndex = input.indexOf('#')
  const queryIndex = input.indexOf('?')
  const toMaxIndex = anchorIndex >= 0 ? anchorIndex : (queryIndex >= 0 ? queryIndex : void 0)
  const id = input.substr(0, toMaxIndex)
  const params = queryIndex < 0 ? void 0 : objectFromQueryString(input.substr(queryIndex + 1))
  return { input, id, params }
}
