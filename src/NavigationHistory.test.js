import { NavigationHistory } from './NavigationHistory'

describe('NavigationHistory class', () => {
  describe('constrcutor()', () => {
    it('should throw an error if no id is passed in', () => {
      expect(() => {
        const navigationHistory = new NavigationHistory
      }).toThrow()
    })

    it('should store the id passed in as the current one', () => {
      const navigationHistory = new NavigationHistory(null, '', '/')
      expect(navigationHistory.current.id).toBe('/')

      // History API validation
      expect(navigationHistory.length).toBe(1)
      expect(navigationHistory.state).toBe(null)

      // Routing API validation
      expect(navigationHistory.items.length).toBe(1)
      expect(navigationHistory.items[navigationHistory.items.length - 1]).toBe(navigationHistory.current)
    })
  })

  describe('append()', () => {
    it('should append the new URL', () => {
      const navigationHistory = new NavigationHistory(null, '', '/')

      navigationHistory.pushState(null, '', '/abc')

      // History API validation
      expect(navigationHistory.length).toBe(2)
      expect(navigationHistory.state).toBe(null)

      // Routing API validation
      expect(navigationHistory.items.length).toBe(2)
      expect(navigationHistory.current.id).toBe('/abc')
    })
  })
})
