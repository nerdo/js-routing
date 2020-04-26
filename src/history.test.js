import { history } from './history'
import { URLHistory } from './URLHistory'

describe('URL: history', () => {
  it('should be defined as a URLHistory object', () => {
    expect(history).toBeDefined()
    expect(history).toBeInstanceOf(URLHistory)
  })
})
