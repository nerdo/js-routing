export class NavigationHistory {
  constructor(id, params) {
    if (typeof id === 'undefined') {
      throw new Error('NavigationHistory requires the current id as an argument')
    }

    this.initialize = this.initialize.bind(this)
    this.replace = this.replace.bind(this)
    this.push = this.push.bind(this)

    this.initialize(id, params)
  }

  initialize(id, params) {
    this.current = {
      id,
      params
    }
    this.targets = [this.current]
  }

  replace(id, params) {
    this.current = {
      id,
      params
    }
    this.targets[this.targets.length - 1] = this.current
  }

  push(id, params) {
    this.current = {
      id,
      params
    }
    this.targets.push(this.current)
  }
}
