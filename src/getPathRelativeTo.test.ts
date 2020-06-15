import { getPathRelativeTo } from './getPathRelativeTo'

describe('getPathRelativeTo()', () => {
  it('should return / the paths are equal', () => {
    expect(getPathRelativeTo('/foo', '/foo')).toBe('/')
  })

  it('should return the original path if the base is an empty string or /', () => {
    expect(getPathRelativeTo('', '/foo/bar')).toBe('/foo/bar')
    expect(getPathRelativeTo('/', '/foo/bar')).toBe('/foo/bar')
  })

  it('should return the correct path', () => {
    expect(getPathRelativeTo('/foo', '/foo/bar')).toBe('/bar')
    expect(getPathRelativeTo('/a/b', '/a/b/see/three')).toBe('/see/three')
    expect(getPathRelativeTo('/a/be', '/a/b/see/three')).toBe('/a/b/see/three')
  })
})
