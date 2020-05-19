import { NavigationHistory } from './NavigationHistory'

describe('NavigationHistory class', () => {
  // Note: these tests check for values instead of asserting that current is equal to what we passed in.
  // As of 4/26/2020, the input does not get deep cloned (or cloned at all), but it probably should
  // for the sake of preventing history from literally being re-written.

  describe('constrcutor()', () => {
    it('should throw an error if no id is passed in', () => {
      const instantiation = () => {
        const navigationHistory = new NavigationHistory
      }
      expect(instantiation).toThrow('NavigationHistory requires the target.id as an argument')
    })

    it('should store the id passed in as the current one', () => {
      const target = { id: '/' }

      const navigationHistory = new NavigationHistory(target)

      expect(navigationHistory.current.id).toBe(target.id)
      expect(navigationHistory.targets.length).toBe(1)
      expect(navigationHistory.targets[0]).toBe(navigationHistory.current)
    })

    it('should accept an object that implments the History API as a second parameter', () => {
      const historyApi = {}
      const navigationHistory = new NavigationHistory({ id: '/' }, historyApi)

      expect(navigationHistory.historyApi).toBe(historyApi)
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

    it('should call pushState() on the historyApi if it exists', () => {
      const historyApi = {
        pushState: jest.fn()
      }
      const navigationHistory = new NavigationHistory({ id: '/' }, historyApi)
      const params = {}
      const state = {}
      const target = { id: '/abc', params, state }

      navigationHistory.push(target)

      expect(historyApi.pushState).toHaveBeenCalledTimes(1)
      expect(historyApi.pushState).toHaveBeenCalledWith(target, '', target.id)
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

    it('should call replaceState() on the historyApi if it exists', () => {
      const historyApi = {
        replaceState: jest.fn()
      }
      const navigationHistory = new NavigationHistory({ id: '/' }, historyApi)
      const params = {}
      const state = {}
      const target = { id: '/bar', params, state }

      navigationHistory.replace(target)

      expect(historyApi.replaceState).toHaveBeenCalledTimes(1)
      expect(historyApi.replaceState).toHaveBeenCalledWith(target, '', target.id)
    })
  })
})
