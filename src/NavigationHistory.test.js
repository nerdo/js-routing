import { NavigationHistory } from './NavigationHistory'

describe('NavigationHistory class', () => {
  describe('constrcutor()', () => {
    it('should throw an error if no id is passed in', () => {
      expect(() => {
        const navigationHistory = new NavigationHistory
      }).toThrow()
    })

    it('should store the id passed in as the current one', () => {
      const navigationHistory = new NavigationHistory('/')
      expect(navigationHistory.current.id).toBe('/')

      expect(navigationHistory.targets.length).toBe(1)
      expect(navigationHistory.targets[0]).toBe(navigationHistory.current)
    })
  })

  describe('push()', () => {
    it('should append the new navigation target', () => {
      const navigationHistory = new NavigationHistory('/')
      const params = {}
      const state = {}

      navigationHistory.push('/abc', params, state)

      expect(navigationHistory.targets.length).toBe(2)
      expect(navigationHistory.current.id).toBe('/abc')
      expect(navigationHistory.current.params).toBe(params)
      expect(navigationHistory.current.state).toBe(state)
    })
  })

  describe('replace()', () => {
    it('should replace the current navigation target', () => {
      const navigationHistory = new NavigationHistory('/')
      const params = {}
      const state = {}

      navigationHistory.replace('/bar', params, state)

      expect(navigationHistory.targets.length).toBe(1)
      expect(navigationHistory.current.id).toBe('/bar')
      expect(navigationHistory.current.params).toBe(params)
      expect(navigationHistory.current.state).toBe(state)
    })
  })
})
