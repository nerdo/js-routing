export const getJoinedPath = (...paths: string[]) => (paths[0][0] === '/' ? '/' : '') +
  paths
    .join('/')
    .split('/')
    .filter(path => path !== '')
    .join('/')
