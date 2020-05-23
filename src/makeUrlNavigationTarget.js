import { objectFromQueryString } from './objectFromQueryString'

export const makeUrlNavigationTarget = (input, baseId) => {
  const anchorIndex = input.indexOf('#')
  const queryIndex = input.indexOf('?')
  const toMaxIndex = anchorIndex >= 0 ? anchorIndex : (queryIndex >= 0 ? queryIndex : void 0)
  const params = queryIndex < 0 ? void 0 : objectFromQueryString(input.substr(queryIndex + 1))
  const isRelativeId = input[0] !== '/' && (baseId || '').length > 0
  const inputId = input.substr(0, toMaxIndex)
  const id = isRelativeId ? `${baseId === '/' ? '' : baseId}/${inputId}` : inputId
  return { input, id, params }
}
