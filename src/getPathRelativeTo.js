export const getPathRelativeTo = (parentPath, path) => {
  const pathEqualsParent = path === parentPath
  if (pathEqualsParent) {
    return '/'
  }

  const pathStartsWithParent = path.substr(0, parentPath.length) === parentPath && path[parentPath.length] === '/'
  if (pathStartsWithParent) {
    return path.substr(parentPath.length)
  }

  return path
}
