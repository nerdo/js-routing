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
  const specialProduct = {
    id: '/product/special-product',
    action: () => 'special product'
  }
  const functionMatcher = {
    id: id => id === '/function/matcher' || id === '/method/man/wu/tang',
    action: () => 'function matcher'
  }

  const allRoutes = [
    home,
    about,
    fooBar,
    userProfile,
    userPhotos,
    specialProduct,
    productNest,
    productDetailsChild,
    functionMatcher
  ]

  describe('exact match', () => {
    it('should return the correct route', () => {
      const routes = allRoutes

      const history = new NavigationHistory({ id: '/about' })

      const selected = getSelectedUrlRoute(routes, history)

      expect(selected).toBe(about)
    })
  })

  describe('URL variations that should match', () => {
    it('should return the correct route', () => {
      const routes = allRoutes
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
      const routes = allRoutes
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
      const routes = allRoutes
      const history = new NavigationHistory({ id: '/' })

      history.push({ id: '/product/foo-bars/details' })
      expect(getSelectedUrlRoute(routes, history)).toBe(productNest)

      history.push({ id: '/product/foo-bars//details' })
      expect(getSelectedUrlRoute(routes, history)).toBe(productNest)

      history.push({ id: '/product/foo-bars/details/edit' })
      expect(getSelectedUrlRoute(routes, history)).toBe(productNest)
    })

    describe('precedence', () => {
      describe('array form', () => {
        it('should return the nest if it is defined first', () => {
          const routes = [
            home,
            productNest,
            specialProduct,
            about
          ]

          const history = new NavigationHistory({ id: '/' })
          history.push({ id: '/product/special-product' })
          expect(getSelectedUrlRoute(routes, history)).toBe(productNest)
        })

        it('should return the regular route if it is defined first', () => {
          const routes = [
            home,
            specialProduct,
            productNest,
            about
          ]

          const history = new NavigationHistory({ id: '/' })
          history.push({ id: '/product/special-product' })
          expect(getSelectedUrlRoute(routes, history)).toBe(specialProduct)
        })
      })
    })
  })

  describe('function matcher', () => {
    it('should return the correct route', () => {
      const routes = allRoutes
      const history = new NavigationHistory({ id: '/' })

      history.push({ id: '/function/matcher' })
      expect(getSelectedUrlRoute(routes, history)).toBe(functionMatcher)

      history.push({ id: '/method/man/wu/tang' })
      expect(getSelectedUrlRoute(routes, history)).toBe(functionMatcher)
    })
  })

  describe('regular expression matcher', () => {

  })
})
