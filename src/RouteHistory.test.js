import { RouteHistory } from './RouteHistory'

describe('RouteHistory class', () => {
  describe('constrcutor()', () => {
    it('should throw an error if no id is passed in', () => {
      expect(() => {
        const routeHistory = new RouteHistory
      }).toThrow()
    })

    it('should store the id passed in as the current one', () => {
      const routeHistory = new RouteHistory(null, '', '/')
      expect(routeHistory.current.id).toBe('/')

      // History API validation
      expect(routeHistory.length).toBe(1)
      expect(routeHistory.state).toBe(null)

      // Routing API validation
      expect(routeHistory.items.length).toBe(1)
      expect(routeHistory.items[routeHistory.items.length - 1]).toBe(routeHistory.current)
    })
  })

  describe('append()', () => {
    it('should append the new URL', () => {
      const routeHistory = new RouteHistory(null, '', '/')

      routeHistory.pushState(null, '', '/abc')

      // History API validation
      expect(routeHistory.length).toBe(2)
      expect(routeHistory.state).toBe(null)

      // Routing API validation
      expect(routeHistory.items.length).toBe(2)
      expect(routeHistory.current.id).toBe('/abc')
    })
  })
})
