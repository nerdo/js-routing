export class NavigationHistory {
  constructor(state, title, id) {
    if (typeof id === 'undefined') {
      throw new Error('NavigationHistory requires the current id as an argument')
    }

    this.replaceState = this.replaceState.bind(this)
    this.pushState = this.pushState.bind(this)
    this.setCurrent = this.setCurrent.bind(this)

    this.items = [null]
    this.replaceState(state, title, id)
  }

  replaceState(state, title, id) {
    this.setCurrent({
      id,
      params: state,
      title
    })
    this.items[this.items.length - 1] = this.current
    this.length = this.items.length
  }

  pushState(state, title, id) {
    this.setCurrent({
      id,
      params: state,
      title
    })
    this.items.push(this.current)
    this.length = this.items.length
  }

  setCurrent(current) {
    this.current = current
    this.state = current.params
  }
}
