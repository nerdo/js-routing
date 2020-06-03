import { makeUrlNavigationFunction } from './makeUrlNavigationFunction'

describe('makeUrlNavigationFunction()', () => {
  it('should return a function', () => {
    const navigate = makeUrlNavigationFunction()
    expect(navigate).toBeInstanceOf(Function)
  })

  it('should return a Promise when called', () => {
    const navigate = makeUrlNavigationFunction()
    expect(navigate()).toBeInstanceOf(Promise)
  })
})
