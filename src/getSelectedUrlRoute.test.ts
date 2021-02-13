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
    id: (id) => id === '/function/matcher' || id === '/method/man/wu/tang',
    action: () => 'function matcher'
  }
  const regExRoute = {
    id: /^\/employee\/T(\d{5})\/?/,
    action: () => 'regex route'
  }
  const documents = {
    id: '/documents?page&numPerPage',
    action: () => 'required query string'
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
    functionMatcher,
    regExRoute,
    documents
  ]

  describe('exact match', () => {
    it('should return the correct route', () => {
      const routes = allRoutes

      const history = new NavigationHistory({ id: '/about' })

      const selected = getSelectedUrlRoute(routes, history.current.id, history.current.params)

      expect(selected).toBe(about)
    })
  })

  describe('URL variations that should match', () => {
    it('should return the correct route', () => {
      const routes = allRoutes
      const history = new NavigationHistory({ id: '/' })

      history.push({ id: '/about///' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(about)

      history.push({ id: '//about///' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(about)

      history.push({ id: '//about' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(about)
    })
  })

  describe('URL parameters', () => {
    it('should return the correct route', () => {
      const routes = allRoutes
      const history = new NavigationHistory({ id: '/' })

      history.push({ id: '/user/foo' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(userProfile)

      history.push({ id: '/user//bar///' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(userProfile)

      history.push({ id: '/user/bar/photos' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(userPhotos)
    })
  })

  describe('required query string parameters', () => {
    it('should return the correct route', () => {
      const routes = allRoutes
      const history = new NavigationHistory({ id: '/' })

      history.push({ id: '/documents' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).not.toBeDefined()

      history.push({ id: '/documents?page=1' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).not.toBeDefined()

      history.push({ id: '/documents?numPerPage=10' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).not.toBeDefined()

      history.push({
        id: '/documents',
        params: {
          page: '1',
          numPerPage: '10'
        }
      })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(documents)
    })
  })

  describe('nesting', () => {
    it('should return the correct route', () => {
      const routes = allRoutes
      const history = new NavigationHistory({ id: '/' })

      history.push({ id: '/product/foo-bars/details' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(productNest)

      history.push({ id: '/product/foo-bars//details' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(productNest)

      history.push({ id: '/product/foo-bars/details/edit' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(productNest)
    })

    describe('precedence', () => {
      describe('array form', () => {
        it('should return the nest if it is defined first', () => {
          const routes = [home, productNest, specialProduct, about]

          const history = new NavigationHistory({ id: '/' })
          history.push({ id: '/product/special-product' })
          expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(productNest)
        })

        it('should return the regular route if it is defined first', () => {
          const routes = [home, specialProduct, productNest, about]

          const history = new NavigationHistory({ id: '/' })
          history.push({ id: '/product/special-product' })
          expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(specialProduct)
        })
      })
    })

    describe('child routes', () => {
      it('should select the correct child route', () => {
        const tagline = {
          id: '/tagline',
          action: () => 'tagline'
        }
        const filmography = {
          id: '/filmography',
          action: () => 'filmography'
        }

        const routes = [tagline, filmography]

        const history = new NavigationHistory({ id: '/' })
        history.push({ id: '/actors/bernie-mac/tagline' })
        expect(getSelectedUrlRoute(routes, history.current.id, history.current.params, '/actors/bernie-mac')).toBe(
          tagline
        )
      })
    })
  })

  describe('function matcher', () => {
    it('should return the correct route', () => {
      const routes = allRoutes
      const history = new NavigationHistory({ id: '/' })

      history.push({ id: '/function/matcher' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(functionMatcher)

      history.push({ id: '/method/man/wu/tang' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(functionMatcher)
    })
  })

  describe('regular expression matcher', () => {
    it('should return the correct route', () => {
      const routes = allRoutes
      const history = new NavigationHistory({ id: '/' })

      history.push({ id: '/employee/T90210' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(regExRoute)

      history.push({ id: '/employee/T90210/' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).toBe(regExRoute)
    })
  })

  describe('non matches', () => {
    it('should return undefined', () => {
      const routes = allRoutes
      const history = new NavigationHistory({ id: '/' })

      history.push({ id: '/a' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).not.toBeDefined()

      history.push({ id: '/lamb/chops' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).not.toBeDefined()

      history.push({ id: '/employee/TXX210' })
      expect(getSelectedUrlRoute(routes, history.current.id, history.current.params)).not.toBeDefined()
    })
  })
})
