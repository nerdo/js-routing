export const makeUrlNavigationTarget = input => {
  const anchorIndex = input.indexOf('#')
  const queryIndex = input.indexOf('?')
  const toMaxIndex = anchorIndex >= 0 ? anchorIndex : (queryIndex >= 0 ? queryIndex : void 0)
  const to = input.substr(0, toMaxIndex)
  const params = queryIndex < 0
    ? void 0
    : input
      .substr(queryIndex + 1)
      .split('&')
      .filter(string => string !== '')
      .map(string => {
        const pair = string.indexOf('=') >= 0 ? string.split('=') : [string, '']
        return [pair[0], decodeURIComponent(pair[1])]
      })
      .reduce(
        (obj, pair) => ({
          ...obj,
          [pair[0]]: pair[1]
        }),
        {}
      )
  return { to, params }
}
