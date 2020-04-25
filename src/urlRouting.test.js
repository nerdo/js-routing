import { urlRouting } from '.'

describe('urlRouting', () => {
  it('should be defined as an object', () => {
    expect(urlRouting).toBeDefined()
    expect(typeof urlRouting).toBe('object')
  })

  describe('applyRouting()', () => {
    const { applyRouting, navigate } = urlRouting

    it('should return null when no routes are provided', () => {
      const returnValue = applyRouting()
      expect(returnValue).toBeNull()
    })

    it('should return null when no routes match', () => {
      const returnValue = applyRouting([])
      expect(returnValue).toBeNull()
    })

    describe('simple routes', () => {
      it('should return the correct route', () => {
        const routes = {
          '/': () => 'home',
          '/about': () => 'about',
          '/foo/bar': () => 'foo bar'
        }

        navigate('/')

        const route = applyRouting(routes)

        expect(route).toBe('home')
      })
    })
  })
})
