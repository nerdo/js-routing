import { URLHistory } from './URLHistory'

describe('URLHistory class', () => {
  describe('constrcutor()', () => {
    it('should throw an error if no URL is passed in', () => {
      expect(() => {
        const urlHistory = new URLHistory
      }).toThrow()
    })

    it('should store the URL passed in as the current one', () => {
      const urlHistory = new URLHistory('/')
      expect(urlHistory.current.id).toBe('/')
      expect(urlHistory.items.length).toBe(1)
      expect(urlHistory.items[urlHistory.items.length - 1]).toBe(urlHistory.current)
    })
  })

  describe('append()', () => {
    it('should append the new URL', () => {
      const urlHistory = new URLHistory('/')
      urlHistory.append('/abc')
      expect(urlHistory.items.length).toBe(2)
      expect(urlHistory.current.id).toBe('/abc')
    })
  })
})
