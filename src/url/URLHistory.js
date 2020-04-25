export class URLHistory {
  constructor(id) {
    if (typeof id === 'undefined') {
      throw new Error('URLHistory requires the current URL as an argument')
    }

    this.items = []
    this.append(id)
  }

  append(id) {
    this.current = {
      id
    }
    this.items.push(this.current)
  }
}
