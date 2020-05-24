export const getJoinedPath = (...paths) => (paths[0][0] === '/' ? '/' : '') +
  paths
    .join('/')
    .split('/')
    .filter(path => path !== '')
    .join('/')
