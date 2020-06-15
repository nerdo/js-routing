export const objectFromQueryString = queryString => {
  if (typeof queryString === 'undefined') {
    return void 0
  }

  return queryString
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
}
