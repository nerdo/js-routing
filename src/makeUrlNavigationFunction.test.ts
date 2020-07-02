import { makeUrlNavigationFunction } from './makeUrlNavigationFunction'

describe('makeUrlNavigationFunction()', () => {
  it('should return a function', () => {
    const router = { history: {}, makeNavigationTarget() {} }
    const navigate = makeUrlNavigationFunction(router)
    expect(navigate).toBeInstanceOf(Function)
  })

  it('should return a Promise when called', () => {
    const router = { history: { push() {} }, makeNavigationTarget() {} }
    const navigate = makeUrlNavigationFunction(router)
    expect(navigate('')).toBeInstanceOf(Promise)
  })
})
