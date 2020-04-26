import { getSelectedUrlRoute } from './getSelectedUrlRoute'
import { NavigationHistory } from './NavigationHistory'

describe('getSelectedUrlRoute()', () => {
  describe('simple routes', () => {
    it('should return the correct route', () => {
      const home = {
        id: '/',
        route: () => 'home'
      }
      const about = {
        id: '/about',
        route: () => 'about'
      }
      const foobar = {
        id: '/foo/bar',
        route: () => 'foo bar'
      }
      const routes = [
        home,
        about,
        foobar
      ]
      const history = new NavigationHistory('/about')

      const selected = getSelectedUrlRoute(routes, history)

      expect(selected).toBe(about)
    })
  })
})
