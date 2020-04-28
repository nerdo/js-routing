import { getSelectedUrlRoute } from './getSelectedUrlRoute'
import { NavigationHistory } from './NavigationHistory'

describe('getSelectedUrlRoute()', () => {
  const home = {
    id: '/',
    action: () => 'home'
  }
  const about = {
    id: '/about',
    action: () => 'about'
  }
  const fooBar = {
    id: '/foo/bar',
    action: () => 'foo bar'
  }
  const userProfile = {
    id: '/user/:username',
    action: () => 'user profile'
  }
  const userPhotos = {
    id: '/user/:username/photos',
    action: () => 'user photos'
  }
  const productNest = {
    id: '/product/:productSlug',
    isNest: true,
    action: () => 'product nest'
  }
  const productDetailsChild = {
    id: '/details',
    action: () => 'product details'
  }

  describe('exact match', () => {
    it('should return the correct route', () => {
      const routes = [
        home,
        about,
        fooBar
      ]
      const history = new NavigationHistory({ id: '/about' })

      const selected = getSelectedUrlRoute(routes, history)

      expect(selected).toBe(about)
    })
  })

  describe('URL variations that should match', () => {
    it('should return the correct route', () => {
      const routes = [
        home,
        about,
        fooBar
      ]
      const history = new NavigationHistory({ id: '/' })

      history.push({ id: '/about///' })
      expect(getSelectedUrlRoute(routes, history)).toBe(about)

      history.push({ id: '//about///' })
      expect(getSelectedUrlRoute(routes, history)).toBe(about)

      history.push({ id: '//about' })
      expect(getSelectedUrlRoute(routes, history)).toBe(about)
    })
  })

  describe('URL parameters', () => {
    it('should return the correct route', () => {
      const routes = [
        home,
        about,
        userProfile,
        userPhotos,
        fooBar
      ]
      const history = new NavigationHistory({ id: '/' })

      history.push({ id: '/user/foo' })
      expect(getSelectedUrlRoute(routes, history)).toBe(userProfile)

      history.push({ id: '/user//bar///' })
      expect(getSelectedUrlRoute(routes, history)).toBe(userProfile)

      history.push({ id: '/user/bar/photos' })
      expect(getSelectedUrlRoute(routes, history)).toBe(userPhotos)
    })
  })

  describe('nests', () => {
    it('should return the correct route', () => {
      const routes = [
        home,
        productNest,
        about
      ]
      const history = new NavigationHistory({ id: '/' })

      history.push({ id: '/product/foo-bars/details' })
      expect(getSelectedUrlRoute(routes, history)).toBe(productNest)

      history.push({ id: '/product/foo-bars//details' })
      expect(getSelectedUrlRoute(routes, history)).toBe(productNest)

      history.push({ id: '/product/foo-bars/details/edit' })
      expect(getSelectedUrlRoute(routes, history)).toBe(productNest)
    })

    describe('precedence', () => {
    })
  })
})
