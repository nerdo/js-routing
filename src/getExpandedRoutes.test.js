import { getExpandedRoutes } from './getExpandedRoutes'

describe('getExpandedRoutes()', () => {
  it('should return the original array if the argument is an array', () => {
    const routes = [
      {
          id: '/',
          route: 'home'
      },
      {
          id: '/about',
          route: 'about'
      },
      'it',
      'should',
      'not',
      'touch',
      'this',
      'array',
      'at',
      'all'
    ]

    const expanded = getExpandedRoutes(routes)

    expect(expanded).toBe(routes)
  })

  it('should expand an object to an array of objects', () => {
    const routes = {
      '/': 'home',
      '/about': 'about'
    }

    const expanded = getExpandedRoutes(routes)

    expect(expanded).not.toBe(routes)
    expect(Array.isArray(expanded)).toBe(true)
    expect(expanded.length).toBe(2)

    const homeRoute = expanded.filter(r => r.id === '/')[0]
    const aboutRoute = expanded.filter(r => r.id === '/about')[0]

    expect(homeRoute.id).toBe('/')
    expect(homeRoute.route).toBe('home')
    expect(aboutRoute.id).toBe('/about')
    expect(aboutRoute.route).toBe('about')
  })
})
