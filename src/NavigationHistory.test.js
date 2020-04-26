import { NavigationHistory } from './NavigationHistory'

describe('NavigationHistory class', () => {
  // Note: these tests check for values instead of asserting that current is equal to what we passed in.
  // As of 4/26/2020, the input does not get deep cloned (or cloned at all), but it probably should
  // for the sake of preventing history from literally being re-written.

  describe('constrcutor()', () => {
    it('should throw an error if no id is passed in', () => {
      expect(() => {
        const navigationHistory = new NavigationHistory
      }).toThrow()
    })

    it('should store the id passed in as the current one', () => {
      const target = { id: '/' }

      const navigationHistory = new NavigationHistory(target)

      expect(navigationHistory.current.id).toBe(target.id)
      expect(navigationHistory.targets.length).toBe(1)
      expect(navigationHistory.targets[0]).toBe(navigationHistory.current)
    })
  })

  describe('push()', () => {
    it('should append the new navigation target', () => {
      const navigationHistory = new NavigationHistory({ id: '/' })
      const params = {}
      const state = {}
      const target = { id: '/abc', params, state }

      navigationHistory.push(target)

      expect(navigationHistory.targets.length).toBe(2)
      expect(navigationHistory.current.id).toBe(target.id)
      expect(navigationHistory.current.params).toBe(params)
      expect(navigationHistory.current.state).toBe(state)
    })
  })

  describe('replace()', () => {
    it('should replace the current navigation target', () => {
      const navigationHistory = new NavigationHistory({ id: '/' })
      const params = {}
      const state = {}
      const target = { id: '/bar', params, state }

      navigationHistory.replace(target)

      expect(navigationHistory.targets.length).toBe(1)
      expect(navigationHistory.current.id).toBe(target.id)
      expect(navigationHistory.current.params).toBe(params)
      expect(navigationHistory.current.state).toBe(state)
    })
  })
})
