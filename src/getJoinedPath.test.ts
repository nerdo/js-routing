import { getJoinedPath } from './getJoinedPath'

describe('getJoinedPath()', () => {
  describe('well formed inputs', () => {
    it('should return the correct path', () => {
      expect(getJoinedPath('')).toBe('')
      expect(getJoinedPath('/')).toBe('/')
      expect(getJoinedPath('foo', '/bar')).toBe('foo/bar')
      expect(getJoinedPath('foo/', '/bar')).toBe('foo/bar')
      expect(getJoinedPath('/foo', '/bar')).toBe('/foo/bar')
      expect(getJoinedPath('/foo', '/bar/')).toBe('/foo/bar')
      expect(getJoinedPath('/foo/', '/bar')).toBe('/foo/bar')
      expect(getJoinedPath('/foo', 'bar')).toBe('/foo/bar')
      expect(getJoinedPath('foo', 'bar')).toBe('foo/bar')
      expect(getJoinedPath('/a/b', '/c', '/d')).toBe('/a/b/c/d')
      expect(getJoinedPath('/a/b', '/c/', '/d')).toBe('/a/b/c/d')
      expect(getJoinedPath('a/b', '/c', '/d')).toBe('a/b/c/d')
      expect(getJoinedPath('a/b/', '/c', '/d')).toBe('a/b/c/d')
      expect(getJoinedPath('/a/b', 'c', 'd', 'e/f')).toBe('/a/b/c/d/e/f')
      expect(getJoinedPath('/a/b', 'c', 'd', 'e/f/')).toBe('/a/b/c/d/e/f')
      expect(getJoinedPath('a/b', 'c', 'd', 'e/f')).toBe('a/b/c/d/e/f')
    })
  })

  describe('malformed inputs', () => {
    it('should return a sanitized path', () => {
      expect(getJoinedPath('//')).toBe('/')
      expect(getJoinedPath('///')).toBe('/')
      expect(getJoinedPath('///a')).toBe('/a')
      expect(getJoinedPath('a///')).toBe('a')
      expect(getJoinedPath('a//b')).toBe('a/b')
      expect(getJoinedPath('a///b')).toBe('a/b')
      expect(getJoinedPath('a//b//')).toBe('a/b')
    })
  })
})
