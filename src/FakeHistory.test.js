import { FakeHistory } from './FakeHistory'

describe('FakeHistory class', () => {
  describe('constrcutor()', () => {
    it('should throw an error if no id is passed in', () => {
      expect(() => {
        const fakeHistory = new FakeHistory
      }).toThrow()
    })

    it('should store the id passed in as the current one', () => {
      const fakeHistory = new FakeHistory(null, '', '/')
      expect(fakeHistory.current.id).toBe('/')

      // History API validation
      expect(fakeHistory.length).toBe(1)
      expect(fakeHistory.state).toBe(null)

      // Routing API validation
      expect(fakeHistory.items.length).toBe(1)
      expect(fakeHistory.items[fakeHistory.items.length - 1]).toBe(fakeHistory.current)
    })
  })

  describe('append()', () => {
    it('should append the new URL', () => {
      const fakeHistory = new FakeHistory(null, '', '/')

      fakeHistory.pushState(null, '', '/abc')

      // History API validation
      expect(fakeHistory.length).toBe(2)
      expect(fakeHistory.state).toBe(null)

      // Routing API validation
      expect(fakeHistory.items.length).toBe(2)
      expect(fakeHistory.current.id).toBe('/abc')
    })
  })
})
