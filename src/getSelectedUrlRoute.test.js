import { getSelectedUrlRoute } from './getSelectedUrlRoute'
import { NavigationHistory } from './NavigationHistory'

describe('getSelectedUrlRoute()', () => {
  const home = {
    id: '/',
    route: () => 'home'
  }
  const about = {
    id: '/about',
    route: () => 'about'
  }
  const fooBar = {
    id: '/foo/bar',
    route: () => 'foo bar'
  }
  const userProfile = {
    id: '/profile/:username',
    route: () => 'user profile'
  }

  describe('exact match', () => {
    it('should return the correct route', () => {
      const routes = [
        home,
        about,
        fooBar
      ]
      const history = new NavigationHistory('/about')

      const selected = getSelectedUrlRoute(routes, history)

      expect(selected).toBe(about)
    })
  })

  describe('URL with extra slashes', () => {
    it('should return the correct route', () => {
      const routes = [
        home,
        about,
        fooBar
      ]
      const history = new NavigationHistory('/about///')

      const selected = getSelectedUrlRoute(routes, history)

      expect(selected).toBe(about)
    })
  })

  describe('URL parameters', () => {
    it('should return the correct route', () => {
      const routes = [
        home,
        about,
        userProfile,
        fooBar
      ]
      const history = new NavigationHistory('/user/cue8chalk')

      const selected = getSelectedUrlRoute(routes, history)

      expect(selected).toBe(userProfile)
    })
  })
})
